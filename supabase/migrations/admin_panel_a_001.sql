-- ==============================================================================
-- RUN ORDER: 001 (Execute this file first in Supabase SQL Editor for Part A)
-- File: supabase/migrations/admin_panel_a_001.sql
-- Description: Admin Panel Part A Foundation — Admins, Audit Logs, Site Settings,
--              Profiles roll_no uniqueness, Courses integrity, and Security DEFINER RPCs.
-- All statements are non-destructive and idempotent.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMINS TABLE (Single Source of Truth for Administrative Permissions)
CREATE TABLE IF NOT EXISTS public.admins (
  uid uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  roll_no text NOT NULL DEFAULT 'ADMIN',
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin'));
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 3. TRUSTED ADMIN VALIDATORS
-- Security Rule 1: Admin identity is decided ONLY by public.admins, NEVER hard-coded emails or frontend state.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE uid = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE uid = auth.uid() AND role = 'super_admin');
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- Policies on admins table
DROP POLICY IF EXISTS "Admins can view admins table" ON public.admins;
CREATE POLICY "Admins can view admins table"
  ON public.admins FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ==============================================================================
-- ONE-TIME ADMIN SEEDING SNIPPET (SECURITY RULE 2)
-- Run this block manually in Supabase SQL Editor once the two accounts exist in auth.users.
-- Neither account nor password is created here.
-- Any other account (including hr498412@gmail.com) is NOT inserted and remains non-admin.
-- ==============================================================================
/*
INSERT INTO public.admins (uid, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Adeel Bhatti'), 'super_admin'
FROM auth.users
WHERE lower(email) = 'theinspirebusinessacademy@gmail.com'
ON CONFLICT (uid) DO UPDATE SET role = 'super_admin';

INSERT INTO public.admins (uid, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', 'Huzaifa Ghori'), 'admin'
FROM auth.users
WHERE lower(email) = 'huzaifaghori4315@gmail.com'
ON CONFLICT (uid) DO UPDATE SET role = 'admin';
*/

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id text PRIMARY KEY,
  actor_id text NOT NULL,
  actor_email text NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL DEFAULT '',
  target_id text NOT NULL DEFAULT '',
  target_resource text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  timestamp timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_type text NOT NULL DEFAULT '';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_id text NOT NULL DEFAULT '';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_resource text NOT NULL DEFAULT '';
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins only select audit logs" ON public.audit_logs;
CREATE POLICY "Admins only select audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 5. SITE SETTINGS TABLE & SAFE PUBLIC VIEW
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP VIEW IF EXISTS public.public_site_settings;
CREATE OR REPLACE VIEW public.public_site_settings AS
  SELECT key, value
  FROM public.site_settings
  WHERE key IN (
    'academy_name',
    'logo_url',
    'whatsapp_number',
    'contact_email',
    'address',
    'social_links',
    'footer_text',
    'maintenance_flag'
  );

GRANT SELECT ON public.public_site_settings TO anon, authenticated;

DROP POLICY IF EXISTS "Admins can select all site_settings" ON public.site_settings;
CREATE POLICY "Admins can select all site_settings"
  ON public.site_settings FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Public can select safe site_settings" ON public.site_settings;
CREATE POLICY "Public can select safe site_settings"
  ON public.site_settings FOR SELECT
  TO PUBLIC
  USING (key IN ('academy_name', 'logo_url', 'whatsapp_number', 'contact_email', 'address', 'social_links', 'footer_text', 'maintenance_flag'));

-- Default site settings seed (idempotent)
INSERT INTO public.site_settings (key, value)
VALUES
  ('academy_name', '"Inspire Business Academy"'::jsonb),
  ('logo_url', '""'::jsonb),
  ('whatsapp_number', '"+92 321 0000000"'::jsonb),
  ('contact_email', '"theinspirebusinessacademy@gmail.com"'::jsonb),
  ('address', '"Karachi, Sindh, Pakistan"'::jsonb),
  ('social_links', '{"facebook": "", "youtube": "", "instagram": "", "linkedin": ""}'::jsonb),
  ('footer_text', '"Inspire Business Academy is a specialized institute for next-generation technology and practical skills."'::jsonb),
  ('maintenance_flag', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. PROFILES TABLE INTEGRITY
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'blocked'));

/*
-- PRE-CHECK FOR DUPLICATE ROLL NUMBERS BEFORE INDEX CREATION:
SELECT lower(roll_no) AS duplicate_roll_no, count(*)
FROM public.profiles
WHERE roll_no IS NOT NULL AND roll_no <> ''
GROUP BY lower(roll_no)
HAVING count(*) > 1;
*/
CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_roll_no ON public.profiles (lower(roll_no)) WHERE roll_no <> '';

-- 7. COURSES TABLE INTEGRITY
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- 8. SECURITY DEFINER RPCS FOR PART A

-- 8.1 admin_set_student_status
CREATE OR REPLACE FUNCTION public.admin_set_student_status(
  p_student_id uuid,
  p_status text
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  IF p_status NOT IN ('pending', 'approved', 'rejected', 'blocked') THEN
    RAISE EXCEPTION 'Invalid approval status: %', p_status;
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  UPDATE public.profiles
  SET
    approval_status = p_status,
    is_active = (p_status = 'approved'),
    is_approved = (p_status = 'approved'),
    updated_at = now()
  WHERE id = p_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile with id % not found.', p_student_id;
  END IF;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'SET_STUDENT_STATUS',
    'student',
    p_student_id::text,
    'profile:' || p_student_id::text,
    jsonb_build_object('new_status', p_status),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_set_student_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_student_status(uuid, text) TO authenticated;

-- 8.2 admin_update_student
CREATE OR REPLACE FUNCTION public.admin_update_student(
  p_student_id uuid,
  p_full_name text,
  p_father_name text,
  p_phone text,
  p_city text,
  p_course_id text,
  p_batch text,
  p_bio text,
  p_skills_list text[]
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
  v_course_title text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  SELECT title INTO v_course_title FROM public.courses WHERE id = p_course_id;

  UPDATE public.profiles
  SET
    full_name = COALESCE(trim(p_full_name), full_name),
    father_name = COALESCE(trim(p_father_name), father_name),
    phone = COALESCE(trim(p_phone), phone),
    city = COALESCE(trim(p_city), city),
    course_id = COALESCE(p_course_id, course_id),
    skill = COALESCE(v_course_title, skill),
    batch = COALESCE(trim(p_batch), batch),
    bio = COALESCE(p_bio, bio),
    skills_list = COALESCE(p_skills_list, skills_list),
    updated_at = now()
  WHERE id = p_student_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile with id % not found.', p_student_id;
  END IF;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'UPDATE_STUDENT_PROFILE',
    'student',
    p_student_id::text,
    'profile:' || p_student_id::text,
    jsonb_build_object('full_name', p_full_name, 'course_id', p_course_id, 'batch', p_batch),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_update_student(uuid, text, text, text, text, text, text, text, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_student(uuid, text, text, text, text, text, text, text, text[]) TO authenticated;

-- 8.3 admin_upsert_course
CREATE OR REPLACE FUNCTION public.admin_upsert_course(
  p_id text,
  p_code text,
  p_title text,
  p_category text,
  p_duration text,
  p_description text,
  p_modules text[],
  p_is_active boolean,
  p_cover_image text
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.courses (
    id, code, title, category, duration, description, modules, is_active, cover_image
  ) VALUES (
    p_id, p_code, p_title, p_category, p_duration, p_description, p_modules, p_is_active, p_cover_image
  )
  ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    duration = EXCLUDED.duration,
    description = EXCLUDED.description,
    modules = EXCLUDED.modules,
    is_active = EXCLUDED.is_active,
    cover_image = EXCLUDED.cover_image;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'UPSERT_COURSE',
    'course',
    p_id,
    'course:' || p_id,
    jsonb_build_object('title', p_title, 'code', p_code, 'is_active', p_is_active),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_upsert_course(text, text, text, text, text, text, text[], boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_course(text, text, text, text, text, text, text[], boolean, text) TO authenticated;

-- 8.4 admin_set_course_active (Never delete referenced courses per Shared Rules)
CREATE OR REPLACE FUNCTION public.admin_set_course_active(
  p_id text,
  p_is_active boolean
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  UPDATE public.courses
  SET is_active = p_is_active
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course with id % not found.', p_id;
  END IF;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'SET_COURSE_ACTIVE',
    'course',
    p_id,
    'course:' || p_id,
    jsonb_build_object('is_active', p_is_active),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_set_course_active(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_course_active(text, boolean) TO authenticated;

-- 8.5 admin_upsert_batch
CREATE OR REPLACE FUNCTION public.admin_upsert_batch(
  p_id text,
  p_name text,
  p_course_id text,
  p_start_date text,
  p_timing text,
  p_is_active boolean
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.batches (
    id, name, course_id, start_date, timing, is_active
  ) VALUES (
    p_id, p_name, p_course_id, p_start_date, p_timing, p_is_active
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    course_id = EXCLUDED.course_id,
    start_date = EXCLUDED.start_date,
    timing = EXCLUDED.timing,
    is_active = EXCLUDED.is_active;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'UPSERT_BATCH',
    'batch',
    p_id,
    'batch:' || p_id,
    jsonb_build_object('name', p_name, 'course_id', p_course_id, 'is_active', p_is_active),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_upsert_batch(text, text, text, text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_batch(text, text, text, text, text, boolean) TO authenticated;

-- 8.6 admin_update_setting
CREATE OR REPLACE FUNCTION public.admin_update_setting(
  p_key text,
  p_value jsonb
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.site_settings (key, value, updated_at, updated_by)
  VALUES (p_key, p_value, now(), auth.uid())
  ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = now(),
    updated_by = auth.uid();

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'admin'),
    'UPDATE_SETTING',
    'setting',
    p_key,
    'setting:' || p_key,
    jsonb_build_object('key', p_key, 'value', p_value),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_update_setting(text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_setting(text, jsonb) TO authenticated;

-- 8.7 admin_add_admin (Super Admin Only)
CREATE OR REPLACE FUNCTION public.admin_add_admin(
  p_email text,
  p_role text
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
  v_target_user auth.users%ROWTYPE;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Super Administrator role required to manage administrators.';
  END IF;

  IF p_role NOT IN ('super_admin', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %. Role must be super_admin or admin.', p_role;
  END IF;

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  SELECT * INTO v_target_user FROM auth.users WHERE lower(email) = lower(trim(p_email)) LIMIT 1;
  IF v_target_user.id IS NULL THEN
    RAISE EXCEPTION 'No user account found with email %. Account must be registered first.', p_email;
  END IF;

  INSERT INTO public.admins (uid, email, full_name, role)
  VALUES (
    v_target_user.id,
    v_target_user.email,
    COALESCE(v_target_user.raw_user_meta_data->>'full_name', 'Administrator'),
    p_role
  )
  ON CONFLICT (uid) DO UPDATE SET
    role = EXCLUDED.role,
    email = EXCLUDED.email;

  -- Also update role in profiles table
  UPDATE public.profiles
  SET role = p_role, updated_at = now()
  WHERE id = v_target_user.id;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'super_admin'),
    'ADD_ADMIN',
    'admin',
    v_target_user.id::text,
    'admin:' || v_target_user.id::text,
    jsonb_build_object('email', p_email, 'role', p_role),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_add_admin(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_add_admin(text, text) TO authenticated;

-- 8.8 admin_remove_admin (Super Admin Only)
CREATE OR REPLACE FUNCTION public.admin_remove_admin(
  p_uid uuid
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin_email text;
  v_remaining_super_admins int;
  v_target_email text;
BEGIN
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access Denied: Super Administrator role required to manage administrators.';
  END IF;

  -- Cannot remove yourself
  IF p_uid = auth.uid() THEN
    RAISE EXCEPTION 'Operation not permitted: You cannot remove your own administrator account.';
  END IF;

  -- Check remaining super admins if target is super_admin
  SELECT count(*) INTO v_remaining_super_admins
  FROM public.admins
  WHERE role = 'super_admin' AND uid <> p_uid;

  IF v_remaining_super_admins = 0 AND EXISTS (SELECT 1 FROM public.admins WHERE uid = p_uid AND role = 'super_admin') THEN
    RAISE EXCEPTION 'Operation not permitted: Cannot remove the last Super Administrator.';
  END IF;

  SELECT email INTO v_target_email FROM public.admins WHERE uid = p_uid;
  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  DELETE FROM public.admins WHERE uid = p_uid;

  -- Revert profile role to student
  UPDATE public.profiles
  SET role = 'student', updated_at = now()
  WHERE id = p_uid;

  INSERT INTO public.audit_logs (
    id, actor_id, actor_email, action, target_type, target_id, target_resource, metadata, created_at, timestamp
  ) VALUES (
    'log-' || gen_random_uuid(),
    auth.uid()::text,
    COALESCE(v_admin_email, 'super_admin'),
    'REMOVE_ADMIN',
    'admin',
    p_uid::text,
    'admin:' || p_uid::text,
    jsonb_build_object('target_email', v_target_email),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_remove_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_remove_admin(uuid) TO authenticated;

-- End of admin_panel_a_001.sql
