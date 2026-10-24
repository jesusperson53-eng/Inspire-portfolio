-- ==============================================================================
-- RUN ORDER: 002 (Execute this file second in Supabase SQL Editor for Part A, after admin_panel_a_001.sql)
-- File: supabase/migrations/admin_panel_a_002_fixes.sql
-- Description: Admin Panel Part A Verifications & Fixes — RLS Policies for Profiles,
--              Courses, Batches, Dashboard Counters, Column Synchronization,
--              and RPC Hardening.
-- All statements are idempotent and non-destructive.
-- ==============================================================================

-- 1. COLUMN SYNCHRONIZATION ON PROFILES
-- Ensures course_title exists on public.profiles alongside legacy skill column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course_title text NOT NULL DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved';

-- 2. REFINED ROLL NUMBER UNIQUE INDEX
-- Handles NULL checks explicitly and ignores empty string entries
DROP INDEX IF EXISTS public.uq_profiles_roll_no;
CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_roll_no ON public.profiles (lower(roll_no))
  WHERE roll_no IS NOT NULL AND trim(roll_no) <> '';

-- 3. ROW LEVEL SECURITY POLICIES FOR PROFILES
-- Guarantees authenticated admins can view and filter all students under RLS,
-- students can view their own profile, and public visitors see only approved active profiles.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view approved profiles" ON public.profiles;
CREATE POLICY "Public can view approved profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (approval_status = 'approved' AND is_active = true);

-- 4. ROW LEVEL SECURITY POLICIES FOR COURSES & BATCHES
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can select active courses or admin select all" ON public.courses;
CREATE POLICY "Anyone can select active courses or admin select all"
  ON public.courses FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Anyone can select active batches or admin select all" ON public.batches;
CREATE POLICY "Anyone can select active batches or admin select all"
  ON public.batches FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

-- 5. ADMIN READ POLICIES FOR DASHBOARD COUNTER TELEMETRY
-- Enables public.is_admin() to compute exact server-side counts across all operational tables.
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.submissions;
CREATE POLICY "Admins can view all submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all delete_requests" ON public.delete_requests;
CREATE POLICY "Admins can view all delete_requests"
  ON public.delete_requests FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all attendance" ON public.attendance;
CREATE POLICY "Admins can view all attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all certificates" ON public.certificates;
CREATE POLICY "Admins can view all certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all announcements" ON public.announcements;
CREATE POLICY "Admins can view all announcements"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 6. RPC HARDENING & SYNCHRONIZATION FIXES

-- 6.1 admin_update_student (Synchronizes both skill and course_title columns)
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

  -- Lookup course title if course_id is provided
  IF p_course_id IS NOT NULL AND trim(p_course_id) <> '' THEN
    SELECT title INTO v_course_title FROM public.courses WHERE id = p_course_id;
  END IF;

  UPDATE public.profiles
  SET
    full_name = COALESCE(NULLIF(trim(p_full_name), ''), full_name),
    father_name = COALESCE(NULLIF(trim(p_father_name), ''), father_name),
    phone = COALESCE(NULLIF(trim(p_phone), ''), phone),
    city = COALESCE(NULLIF(trim(p_city), ''), city),
    course_id = COALESCE(NULLIF(trim(p_course_id), ''), course_id),
    skill = COALESCE(v_course_title, skill),
    course_title = COALESCE(v_course_title, course_title, skill),
    batch = COALESCE(NULLIF(trim(p_batch), ''), batch),
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

-- 6.2 admin_upsert_course (Handles auto-generated course IDs and validates title)
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
  v_target_id text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  IF trim(COALESCE(p_title, '')) = '' THEN
    RAISE EXCEPTION 'Course title cannot be empty.';
  END IF;

  v_target_id := COALESCE(
    NULLIF(trim(p_id), ''),
    lower(regexp_replace(trim(p_title), '[^a-zA-Z0-9]+', '-', 'g')),
    'course-' || gen_random_uuid()::text
  );

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.courses (
    id, code, title, category, duration, description, modules, is_active, cover_image
  ) VALUES (
    v_target_id,
    COALESCE(NULLIF(trim(p_code), ''), 'CRS-01'),
    trim(p_title),
    COALESCE(trim(p_category), 'Technology'),
    COALESCE(trim(p_duration), '2 Months'),
    COALESCE(p_description, ''),
    COALESCE(p_modules, '{}'),
    COALESCE(p_is_active, true),
    COALESCE(p_cover_image, '')
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
    v_target_id,
    'course:' || v_target_id,
    jsonb_build_object('title', p_title, 'code', p_code, 'is_active', p_is_active),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_upsert_course(text, text, text, text, text, text, text[], boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_course(text, text, text, text, text, text, text[], boolean, text) TO authenticated;

-- 6.3 admin_upsert_batch (Handles auto-generated batch IDs)
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
  v_target_id text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access Denied: Administrator role required.';
  END IF;

  IF trim(COALESCE(p_name, '')) = '' THEN
    RAISE EXCEPTION 'Batch name cannot be empty.';
  END IF;

  v_target_id := COALESCE(
    NULLIF(trim(p_id), ''),
    'batch-' || gen_random_uuid()::text
  );

  SELECT email INTO v_admin_email FROM auth.users WHERE id = auth.uid();

  INSERT INTO public.batches (
    id, name, course_id, start_date, timing, is_active
  ) VALUES (
    v_target_id,
    trim(p_name),
    p_course_id,
    COALESCE(trim(p_start_date), ''),
    COALESCE(trim(p_timing), ''),
    COALESCE(p_is_active, true)
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
    v_target_id,
    'batch:' || v_target_id,
    jsonb_build_object('name', p_name, 'course_id', p_course_id, 'is_active', p_is_active),
    now(),
    now()
  );
END $$;

REVOKE ALL ON FUNCTION public.admin_upsert_batch(text, text, text, text, text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_batch(text, text, text, text, text, boolean) TO authenticated;

-- 6.4 admin_remove_admin (Verifies admin existence before removal)
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

  -- Verify admin exists
  SELECT email INTO v_target_email FROM public.admins WHERE uid = p_uid;
  IF v_target_email IS NULL THEN
    RAISE EXCEPTION 'Administrator with UID % does not exist.', p_uid;
  END IF;

  -- Check remaining super admins if target is super_admin
  SELECT count(*) INTO v_remaining_super_admins
  FROM public.admins
  WHERE role = 'super_admin' AND uid <> p_uid;

  IF v_remaining_super_admins = 0 AND EXISTS (SELECT 1 FROM public.admins WHERE uid = p_uid AND role = 'super_admin') THEN
    RAISE EXCEPTION 'Operation not permitted: Cannot remove the last Super Administrator.';
  END IF;

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

-- End of admin_panel_a_002_fixes.sql
