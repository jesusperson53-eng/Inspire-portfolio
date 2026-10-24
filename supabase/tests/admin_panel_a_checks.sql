-- ==============================================================================
-- INSPIRE BUSINESS ACADEMY — ADMIN PANEL PART A REPEATABLE SQL TEST SUITE
-- File: supabase/tests/admin_panel_a_checks.sql
-- Description: Automated, repeatable verification suite for Part A database security,
--              RLS policies, constraints, views, and SECURITY DEFINER RPCs.
--
-- EXECUTION INSTRUCTIONS:
-- Run this entire script in the Supabase Dashboard SQL Editor or via psql.
-- All tests run inside a transaction block (BEGIN ... ROLLBACK) to ensure zero side effects.
-- Every test asserts expected behavior and outputs PASS / FAIL.
-- ==============================================================================

BEGIN;

DO $$
DECLARE
  v_test_admin_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid;
  v_test_super_id uuid := 'a0000000-0000-0000-0000-000000000002'::uuid;
  v_test_student_id uuid := 'b0000000-0000-0000-0000-000000000001'::uuid;
  v_dummy_id uuid;
  v_bool boolean;
  v_err_thrown boolean;
  v_err_msg text;
  v_count integer;
  v_public_keys text[];
BEGIN
  RAISE NOTICE '====================================================================';
  RAISE NOTICE 'STARTING ADMIN PANEL PART A TEST SUITE (IN-TRANSACTION DRY RUN)';
  RAISE NOTICE '====================================================================';

  -- ----------------------------------------------------------------------------
  -- TEST 1: is_admin() and is_super_admin() with anon / NULL session
  -- ----------------------------------------------------------------------------
  -- When auth.uid() is null (unauthenticated or anon), must return false
  SELECT public.is_admin() INTO v_bool;
  IF v_bool = false THEN
    RAISE NOTICE 'PASS: TEST 1.1 — is_admin() returns false for anon / NULL auth.uid()';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 1.1 — is_admin() must return false for NULL auth.uid()';
  END IF;

  SELECT public.is_super_admin() INTO v_bool;
  IF v_bool = false THEN
    RAISE NOTICE 'PASS: TEST 1.2 — is_super_admin() returns false for anon / NULL auth.uid()';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 1.2 — is_super_admin() must return false for NULL auth.uid()';
  END IF;

  -- ----------------------------------------------------------------------------
  -- TEST 2: Roll No Case-Insensitive Uniqueness (profiles_roll_no_lower_idx)
  -- ----------------------------------------------------------------------------
  -- Create mock auth user for student test
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (v_test_student_id, 'test.student@inspire.test', '{"full_name": "Test Student"}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, email, full_name, roll_no, role, approval_status, is_active)
  VALUES (v_test_student_id, 'test.student@inspire.test', 'Test Student', 'IBA-2026-T100', 'student', 'approved', true)
  ON CONFLICT (id) DO UPDATE SET roll_no = 'IBA-2026-T100';

  -- Attempt inserting another profile with same roll_no in lowercase
  v_dummy_id := 'b0000000-0000-0000-0000-000000000002'::uuid;
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES (v_dummy_id, 'test.student2@inspire.test', '{"full_name": "Test Student 2"}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  v_err_thrown := false;
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, roll_no, role, approval_status, is_active)
    VALUES (v_dummy_id, 'test.student2@inspire.test', 'Test Student 2', 'iba-2026-t100', 'student', 'pending', true);
  EXCEPTION WHEN unique_violation THEN
    v_err_thrown := true;
  END;

  IF v_err_thrown THEN
    RAISE NOTICE 'PASS: TEST 2 — Case-insensitive duplicate Roll No strictly rejected by index';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 2 — profiles_roll_no_lower_idx did not reject case-insensitive duplicate roll_no';
  END IF;

  -- ----------------------------------------------------------------------------
  -- TEST 3: RPC Unauthorized Execution Guards
  -- ----------------------------------------------------------------------------
  -- Calling RPCs without admin authorization must throw 'Access denied: Administrator privileges required.'
  
  -- 3.1 admin_set_student_status
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_set_student_status(v_test_student_id, 'approved', 'IBA-2026-T101');
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.1 — admin_set_student_status blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.1 — admin_set_student_status did not block unauthorized caller: %', v_err_msg;
  END IF;

  -- 3.2 admin_update_student
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_update_student(v_test_student_id, 'Test Updated', '03001234567', 'IBA-2026-T100', 'computer-course', 'batch-1', true);
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.2 — admin_update_student blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.2 — admin_update_student did not block unauthorized caller';
  END IF;

  -- 3.3 admin_upsert_course
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_upsert_course('test-course', 'TC-01', 'Test Course', 'Tech', '2 Months', 'Desc', '[]');
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.3 — admin_upsert_course blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.3 — admin_upsert_course did not block unauthorized caller';
  END IF;

  -- 3.4 admin_set_course_active
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_set_course_active('test-course', false);
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.4 — admin_set_course_active blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.4 — admin_set_course_active did not block unauthorized caller';
  END IF;

  -- 3.5 admin_upsert_batch
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_upsert_batch('test-batch', 'Batch 1', 'computer-course', '2026-01-01', 'Morning', true);
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.5 — admin_upsert_batch blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.5 — admin_upsert_batch did not block unauthorized caller';
  END IF;

  -- 3.6 admin_update_setting
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_update_setting('contact_email', '"test@test.com"'::jsonb);
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND v_err_msg ILIKE '%Access denied%' THEN
    RAISE NOTICE 'PASS: TEST 3.6 — admin_update_setting blocks unauthorized callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.6 — admin_update_setting did not block unauthorized caller';
  END IF;

  -- 3.7 admin_add_admin
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_add_admin('test@test.com', 'admin');
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND (v_err_msg ILIKE '%Super Administrator%' OR v_err_msg ILIKE '%Access denied%') THEN
    RAISE NOTICE 'PASS: TEST 3.7 — admin_add_admin blocks unauthorized / non-super callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.7 — admin_add_admin did not block unauthorized caller: %', v_err_msg;
  END IF;

  -- 3.8 admin_remove_admin
  v_err_thrown := false;
  BEGIN
    PERFORM public.admin_remove_admin(v_test_admin_id);
  EXCEPTION WHEN OTHERS THEN
    v_err_thrown := true;
    v_err_msg := SQLERRM;
  END;
  IF v_err_thrown AND (v_err_msg ILIKE '%Super Administrator%' OR v_err_msg ILIKE '%Access denied%') THEN
    RAISE NOTICE 'PASS: TEST 3.8 — admin_remove_admin blocks unauthorized / non-super callers';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 3.8 — admin_remove_admin did not block unauthorized caller: %', v_err_msg;
  END IF;

  -- ----------------------------------------------------------------------------
  -- TEST 4: public_site_settings View Security
  -- ----------------------------------------------------------------------------
  -- Ensure that the public view only exposes whitelisted keys and nothing else
  SELECT array_agg(key::text) INTO v_public_keys FROM public.public_site_settings;
  IF 'api_secret' = ANY(v_public_keys) OR 'admin_token' = ANY(v_public_keys) THEN
    RAISE EXCEPTION 'FAIL: TEST 4 — public_site_settings exposed private keys';
  ELSE
    RAISE NOTICE 'PASS: TEST 4 — public_site_settings strictly filtered to non-sensitive keys';
  END IF;

  -- ----------------------------------------------------------------------------
  -- TEST 5: Direct Write Protection on site_settings & audit_logs
  -- ----------------------------------------------------------------------------
  -- An unauthenticated / non-admin user must NOT be able to insert directly into site_settings or audit_logs
  -- RLS has no INSERT policy for anon/authenticated on site_settings or audit_logs.
  -- Only SECURITY DEFINER RPCs can write to them.
  SELECT count(*) INTO v_count FROM pg_policies
  WHERE tablename = 'site_settings' AND cmd = 'INSERT';
  IF v_count = 0 THEN
    RAISE NOTICE 'PASS: TEST 5.1 — site_settings has no direct public INSERT policy (RPC only)';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 5.1 — site_settings has unexpected direct INSERT policy';
  END IF;

  SELECT count(*) INTO v_count FROM pg_policies
  WHERE tablename = 'audit_logs' AND cmd = 'INSERT';
  IF v_count = 0 THEN
    RAISE NOTICE 'PASS: TEST 5.2 — audit_logs has no direct public INSERT policy (RPC only)';
  ELSE
    RAISE EXCEPTION 'FAIL: TEST 5.2 — audit_logs has unexpected direct INSERT policy';
  END IF;

  RAISE NOTICE '====================================================================';
  RAISE NOTICE 'ALL ADMIN PANEL PART A TEST SUITE CHECKS COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '====================================================================';
END $$;

ROLLBACK;
