-- ==============================================================================
-- INSPIRE BUSINESS ACADEMY — DATABASE SCHEMA & RLS INTEGRITY (TRD & MIGRATION 001-004)
-- Date: 19 Oct 2026
-- Description: Hardened schema, role validation, RPC submission pipelines, and storage policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'blocked');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.submission_status AS ENUM ('submitted', 'under_review', 'reviewed', 'needs_revision', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. CORE TABLES

-- 3.1 PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  father_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Karachi',
  roll_no text NOT NULL DEFAULT '',
  batch text NOT NULL DEFAULT '',
  skill text NOT NULL DEFAULT '',
  course_id text NOT NULL DEFAULT '',
  avatar_path text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin')),
  approval_status text NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'blocked')),
  is_approved boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  admission_date text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  skills_list text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique index on roll_no (ignoring empty strings)
CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_roll_no ON public.profiles (lower(roll_no)) WHERE roll_no <> '';

-- 3.2 ADMINS TABLE (Single Source of Truth per TRD §6)
CREATE TABLE IF NOT EXISTS public.admins (
  uid uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  roll_no text NOT NULL DEFAULT 'ADMIN'
);

-- 3.3 COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id text PRIMARY KEY,
  code text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  duration text NOT NULL,
  description text NOT NULL DEFAULT '',
  modules text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  cover_image text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3.4 BATCHES
CREATE TABLE IF NOT EXISTS public.batches (
  id text PRIMARY KEY,
  name text NOT NULL,
  course_id text REFERENCES public.courses(id) ON DELETE CASCADE,
  start_date text NOT NULL,
  timing text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

-- 3.5 SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id text PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT '',
  roll_no text NOT NULL DEFAULT '',
  course_id text NOT NULL DEFAULT '',
  course_title text NOT NULL DEFAULT '',
  submission_type text NOT NULL DEFAULT 'project' CHECK (submission_type IN ('project', 'assignment', 'case_study')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  project_url text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  file_size bigint NOT NULL DEFAULT 0,
  file_path text NOT NULL DEFAULT '',
  version integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'reviewed', 'needs_revision', 'rejected')),
  rating numeric(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  marks numeric NOT NULL DEFAULT -1,
  max_marks numeric NOT NULL DEFAULT 100,
  feedback text NOT NULL DEFAULT '',
  internal_note text NOT NULL DEFAULT '', -- Hidden from student
  reviewed_by text NOT NULL DEFAULT '',
  reviewed_at text NOT NULL DEFAULT '',
  is_deleted boolean NOT NULL DEFAULT false, -- Logical archive
  archived_at timestamptz,
  archived_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status_before_archive text,
  is_public_showcase boolean NOT NULL DEFAULT false,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  submission_date text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_file_path ON public.submissions(file_path);

-- 3.6 SUBMISSION VERSIONS
CREATE TABLE IF NOT EXISTS public.submission_versions (
  id text PRIMARY KEY,
  submission_id text NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  project_url text NOT NULL DEFAULT '',
  file_name text NOT NULL DEFAULT '',
  file_size bigint NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  submitted_at timestamptz NOT NULL DEFAULT now()
);

-- 3.7 DELETION REQUESTS
CREATE TABLE IF NOT EXISTS public.delete_requests (
  id text PRIMARY KEY,
  submission_id text NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  submission_title text NOT NULL DEFAULT '',
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT '',
  roll_no text NOT NULL DEFAULT '',
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note text NOT NULL DEFAULT '',
  requested_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by text NOT NULL DEFAULT ''
);

-- 3.8 ATTENDANCE
CREATE TABLE IF NOT EXISTS public.attendance (
  id text PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT '',
  roll_no text NOT NULL DEFAULT '',
  course_id text NOT NULL DEFAULT '',
  batch_id text NOT NULL DEFAULT '',
  attendance_date text NOT NULL,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note text NOT NULL DEFAULT '',
  marked_by text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, attendance_date);

-- 3.9 ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id text PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  target_audience text NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'course', 'batch')),
  target_course text NOT NULL DEFAULT '',
  target_batch text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT ''
);

-- 3.10 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id text PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'announcement',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3.11 CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id text PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  roll_no text NOT NULL,
  course_id text NOT NULL,
  course_title text NOT NULL,
  certificate_code text NOT NULL UNIQUE,
  issued_date text NOT NULL,
  grade_text text NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3.12 AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id text PRIMARY KEY,
  actor_id text NOT NULL,
  actor_email text NOT NULL,
  action text NOT NULL,
  target_resource text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- 4. TRUSTED ADMIN VALIDATOR (TRD §6 - Strictly checks public.admins, NO hard-coded email lists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE uid = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delete_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. SECURITY RPC: RESUBMIT SUBMISSION (TRD §5 S3)
CREATE OR REPLACE FUNCTION public.resubmit_submission(
  p_id text,
  p_project_url text,
  p_description text
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.submissions%ROWTYPE;
BEGIN
  SELECT * INTO s FROM public.submissions WHERE id = p_id FOR UPDATE;
  IF NOT FOUND OR s.student_id <> auth.uid() OR s.is_deleted OR s.status <> 'needs_revision' THEN
    RAISE EXCEPTION 'Action not permitted.';
  END IF;

  INSERT INTO public.submission_versions(id, submission_id, student_id, version_number, project_url, description, submitted_at)
  VALUES ('ver-' || gen_random_uuid(), s.id, s.student_id, s.version, s.project_url, s.description, s.submitted_at);

  UPDATE public.submissions SET
    project_url = p_project_url,
    description = p_description,
    version = s.version + 1,
    status = 'submitted',
    submitted_at = now(),
    updated_at = now()
  WHERE id = p_id;
END $$;

-- 7. OFFICIAL ACCREDITED COURSES (The 10 Official IBA Courses)
INSERT INTO public.courses (id, code, title, category, duration, description, modules, is_active, cover_image)
VALUES
  ('computer-course', 'CC-01', 'Computer Course', '', '', '', '{}', true, ''),
  ('ms-office-course', 'MSO-02', 'MS Office Course', '', '', '', '{}', true, ''),
  ('graphic-design-photoshop', 'GD-03', 'Graphic Design (Photoshop)', '', '', '', '{}', true, ''),
  ('capcut-video-editing', 'CVE-04', 'CapCut Video Editing', '', '', '', '{}', true, ''),
  ('ai-tools-mastery', 'ATM-05', 'AI Tools Mastery', '', '', '', '{}', true, ''),
  ('youtube-automation', 'YTA-06', 'YouTube Automation', '', '', '', '{}', true, ''),
  ('app-dev-gemini', 'ADG-07', 'App Dev (Gemini 3.1 Pro)', '', '', '', '{}', true, ''),
  ('facebook-mastery', 'FBM-08', 'Facebook Mastery', '', '', '', '{}', true, ''),
  ('local-dropshipping', 'LDS-09', 'Local Dropshipping', '', '', '', '{}', true, ''),
  ('organic-digital-marketing', 'ODM-10', 'Organic Digital Marketing', '', '', '', '{}', true, '')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  code = EXCLUDED.code,
  is_active = true;

-- Default general batch
INSERT INTO public.batches (id, name, course_id, start_date, timing, is_active)
VALUES ('batch-general', 'General Batch (Morning)', 'computer-course', '2026-02-01', '10:00 AM - 12:00 PM', true)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  is_active = true;

