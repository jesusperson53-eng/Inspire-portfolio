-- ==============================================================================
-- INSPIRE BUSINESS ACADEMY — SAFE DEMO CLEANUP SCRIPT
-- File: supabase/cleanup_demo_data.sql
-- Date: 2026-10-20
-- Purpose: 
--   1. Upsert the 10 official active courses (single source of truth).
--   2. Deactivate any referenced old courses; delete unreferenced demo courses.
--   3. Safely purge seed/demo submissions, certificates, announcements, and demo students.
--   4. NEVER touch real student or admin accounts (auth.users and public.admins).
--
-- INSTRUCTIONS FOR DATABASE ADMINISTRATOR:
--   1. Take a full database backup in the Supabase Dashboard before executing.
--   2. Run each commented SELECT preview block first to review affected rows.
--   3. Execute transactions one block at a time.
--   4. To cancel any block during review, replace COMMIT with ROLLBACK.
-- ==============================================================================

-- ==============================================================================
-- STEP 1: UPSERT THE 10 OFFICIAL COURSES (IDEMPOTENT)
-- ==============================================================================
BEGIN;

INSERT INTO public.courses (
  id,
  code,
  title,
  category,
  duration,
  description,
  modules,
  is_active,
  cover_image
) VALUES
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

-- Default general batch linked to the default course
INSERT INTO public.batches (
  id,
  name,
  course_id,
  start_date,
  timing,
  is_active
) VALUES (
  'batch-general',
  'General Batch (Morning)',
  'computer-course',
  '2026-02-01',
  '10:00 AM - 12:00 PM',
  true
)
ON CONFLICT (id) DO UPDATE SET
  course_id = EXCLUDED.course_id,
  is_active = true;

COMMIT;
-- ROLLBACK;


-- ==============================================================================
-- STEP 2: COURSES CLEANUP (RULE 4.4: PRESERVE REFERENCED, DELETE UNREFERENCED)
-- ==============================================================================

-- Preview 2A: View non-official courses that are referenced by real student data (WILL BE SET TO INACTIVE)
/*
SELECT c.id, c.title, c.is_active,
  (SELECT count(*) FROM public.submissions s WHERE s.course_id = c.id) AS submissions_count,
  (SELECT count(*) FROM public.attendance a WHERE a.course_id = c.id) AS attendance_count,
  (SELECT count(*) FROM public.certificates cert WHERE cert.course_id = c.id) AS certs_count,
  (SELECT count(*) FROM public.profiles p WHERE p.course_id = c.id OR p.skill = c.title) AS profiles_count,
  (SELECT count(*) FROM public.batches b WHERE b.course_id = c.id) AS batches_count
FROM public.courses c
WHERE c.id NOT IN (
  'computer-course',
  'ms-office-course',
  'graphic-design-photoshop',
  'capcut-video-editing',
  'ai-tools-mastery',
  'youtube-automation',
  'app-dev-gemini',
  'facebook-mastery',
  'local-dropshipping',
  'organic-digital-marketing'
)
AND (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.course_id = c.id)
  OR EXISTS (SELECT 1 FROM public.attendance a WHERE a.course_id = c.id)
  OR EXISTS (SELECT 1 FROM public.certificates cert WHERE cert.course_id = c.id)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.course_id = c.id OR p.skill = c.title)
  OR EXISTS (SELECT 1 FROM public.batches b WHERE b.course_id = c.id)
);
*/

-- Action 2A: Set referenced non-official courses to is_active = false
BEGIN;

UPDATE public.courses
SET is_active = false
WHERE id NOT IN (
  'computer-course',
  'ms-office-course',
  'graphic-design-photoshop',
  'capcut-video-editing',
  'ai-tools-mastery',
  'youtube-automation',
  'app-dev-gemini',
  'facebook-mastery',
  'local-dropshipping',
  'organic-digital-marketing'
)
AND (
  EXISTS (SELECT 1 FROM public.submissions s WHERE s.course_id = courses.id)
  OR EXISTS (SELECT 1 FROM public.attendance a WHERE a.course_id = courses.id)
  OR EXISTS (SELECT 1 FROM public.certificates cert WHERE cert.course_id = courses.id)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.course_id = courses.id OR p.skill = courses.title)
  OR EXISTS (SELECT 1 FROM public.batches b WHERE b.course_id = courses.id)
);

COMMIT;
-- ROLLBACK;


-- Preview 2B: View unreferenced demo courses (SAFE TO DELETE)
/*
SELECT c.id, c.title
FROM public.courses c
WHERE c.id NOT IN (
  'computer-course',
  'ms-office-course',
  'graphic-design-photoshop',
  'capcut-video-editing',
  'ai-tools-mastery',
  'youtube-automation',
  'app-dev-gemini',
  'facebook-mastery',
  'local-dropshipping',
  'organic-digital-marketing'
)
AND NOT EXISTS (SELECT 1 FROM public.submissions s WHERE s.course_id = c.id)
AND NOT EXISTS (SELECT 1 FROM public.attendance a WHERE a.course_id = c.id)
AND NOT EXISTS (SELECT 1 FROM public.certificates cert WHERE cert.course_id = c.id)
AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.course_id = c.id OR p.skill = c.title)
AND NOT EXISTS (SELECT 1 FROM public.batches b WHERE b.course_id = c.id);
*/

-- Action 2B: Delete unreferenced demo courses
BEGIN;

DELETE FROM public.courses
WHERE id NOT IN (
  'computer-course',
  'ms-office-course',
  'graphic-design-photoshop',
  'capcut-video-editing',
  'ai-tools-mastery',
  'youtube-automation',
  'app-dev-gemini',
  'facebook-mastery',
  'local-dropshipping',
  'organic-digital-marketing'
)
AND NOT EXISTS (SELECT 1 FROM public.submissions s WHERE s.course_id = courses.id)
AND NOT EXISTS (SELECT 1 FROM public.attendance a WHERE a.course_id = courses.id)
AND NOT EXISTS (SELECT 1 FROM public.certificates cert WHERE cert.course_id = courses.id)
AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.course_id = courses.id OR p.skill = courses.title)
AND NOT EXISTS (SELECT 1 FROM public.batches b WHERE b.course_id = courses.id);

COMMIT;
-- ROLLBACK;


-- ==============================================================================
-- STEP 3: REMOVE OBVIOUS DEMO / SEED ROWS FROM TABLES
-- (Never touches real auth.users or public.admins)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 3.1 SUBMISSIONS & SUBMISSION VERSIONS
-- ------------------------------------------------------------------------------
-- Preview 3.1: View demo submissions to be deleted
/*
SELECT id, title, student_name, course_title, submitted_at
FROM public.submissions
WHERE id IN ('sub-001', 'sub-002', 'sub-003', 'sub-004')
   OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
   OR title ILIKE '%demo%'
   OR title ILIKE '%sample%';
*/

BEGIN;

-- Delete dependent deletion requests first
DELETE FROM public.delete_requests
WHERE submission_id IN (
  SELECT id FROM public.submissions
  WHERE id IN ('sub-001', 'sub-002', 'sub-003', 'sub-004')
     OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
     OR title ILIKE '%demo%'
     OR title ILIKE '%sample%'
);

-- Delete dependent versions
DELETE FROM public.submission_versions
WHERE submission_id IN (
  SELECT id FROM public.submissions
  WHERE id IN ('sub-001', 'sub-002', 'sub-003', 'sub-004')
     OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
     OR title ILIKE '%demo%'
     OR title ILIKE '%sample%'
);

-- Delete demo submissions
DELETE FROM public.submissions
WHERE id IN ('sub-001', 'sub-002', 'sub-003', 'sub-004')
   OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
   OR title ILIKE '%demo%'
   OR title ILIKE '%sample%';

COMMIT;
-- ROLLBACK;


-- ------------------------------------------------------------------------------
-- 3.2 CERTIFICATES
-- ------------------------------------------------------------------------------
-- Preview 3.2: View demo certificates
/*
SELECT id, certificate_code, student_name, course_title, issued_date
FROM public.certificates
WHERE certificate_code IN ('IBA-2026-WD-084', 'IBA-2026-PY-112')
   OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe');
*/

BEGIN;

DELETE FROM public.certificates
WHERE certificate_code IN ('IBA-2026-WD-084', 'IBA-2026-PY-112')
   OR student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe');

COMMIT;
-- ROLLBACK;


-- ------------------------------------------------------------------------------
-- 3.3 ATTENDANCE
-- ------------------------------------------------------------------------------
-- Preview 3.3: View demo attendance records
/*
SELECT id, student_name, attendance_date, status, note
FROM public.attendance
WHERE student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
   OR note ILIKE '%demo%'
   OR note ILIKE '%seed%';
*/

BEGIN;

DELETE FROM public.attendance
WHERE student_name IN ('Zayan Ahmed', 'Fatima Noor', 'Bilal Tariq', 'Sample Student', 'Demo Student', 'John Doe')
   OR note ILIKE '%demo%'
   OR note ILIKE '%seed%';

COMMIT;
-- ROLLBACK;


-- ------------------------------------------------------------------------------
-- 3.4 ANNOUNCEMENTS & NOTIFICATIONS
-- ------------------------------------------------------------------------------
-- Preview 3.4: View demo announcements
/*
SELECT id, title, target_audience, created_at
FROM public.announcements
WHERE id IN ('ann-1', 'ann-2')
   OR title ILIKE '%demo%'
   OR title ILIKE '%sample%';
*/

BEGIN;

DELETE FROM public.announcements
WHERE id IN ('ann-1', 'ann-2')
   OR title ILIKE '%demo%'
   OR title ILIKE '%sample%';

DELETE FROM public.notifications
WHERE title ILIKE '%demo%'
   OR title ILIKE '%sample%'
   OR message ILIKE '%demo%';

COMMIT;
-- ROLLBACK;


-- ------------------------------------------------------------------------------
-- 3.5 AUDIT LOGS (SEED / TEST ENTRIES)
-- ------------------------------------------------------------------------------
-- Preview 3.5: View test/seed audit logs
/*
SELECT id, actor_email, action, target_resource, timestamp
FROM public.audit_logs
WHERE actor_email ILIKE '%@example.com'
   OR target_resource ILIKE '%demo%';
*/

BEGIN;

DELETE FROM public.audit_logs
WHERE actor_email ILIKE '%@example.com'
   OR target_resource ILIKE '%demo%';

COMMIT;
-- ROLLBACK;


-- ------------------------------------------------------------------------------
-- 3.6 PROFILES (FAKE DEMO STUDENTS ONLY)
-- Strict Guard: Only profiles with explicit demo emails or IDs.
-- Explicitly EXCLUDES admins and the verified student hr498412@gmail.com.
-- ------------------------------------------------------------------------------
-- Preview 3.6: View demo profiles to be removed
/*
SELECT id, email, full_name, roll_no, role
FROM public.profiles
WHERE (
  email ILIKE '%@example.com'
  OR full_name IN ('Sample Student', 'Demo Student', 'John Doe')
)
AND email NOT IN ('theinspirebusinessacademy@gmail.com', 'huzaifaghori4315@gmail.com', 'hr498412@gmail.com')
AND id NOT IN (SELECT uid FROM public.admins);
*/

BEGIN;

DELETE FROM public.profiles
WHERE (
  email ILIKE '%@example.com'
  OR full_name IN ('Sample Student', 'Demo Student', 'John Doe')
)
AND email NOT IN ('theinspirebusinessacademy@gmail.com', 'huzaifaghori4315@gmail.com', 'hr498412@gmail.com')
AND id NOT IN (SELECT uid FROM public.admins);

COMMIT;
-- ROLLBACK;

-- End of cleanup_demo_data.sql
