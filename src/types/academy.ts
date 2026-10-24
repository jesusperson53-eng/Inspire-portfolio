export type UserRole = 'student' | 'admin' | 'super_admin';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export type SubmissionStatus =
  | 'submitted'
  | 'under_review'
  | 'reviewed'
  | 'needs_revision'
  | 'rejected'
  | 'archived';

export type SubmissionType = 'project' | 'assignment' | 'case_study';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type AnnouncementPriority = 'normal' | 'high' | 'urgent';

export type TargetAudience = 'all' | 'course' | 'batch';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  father_name: string;
  phone: string;
  city: string;
  roll_no: string; // Unique student ID e.g. IBA-2026-001
  batch: string;
  course_id: string;
  course_title: string;
  avatar_url?: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  is_approved: boolean;
  is_active: boolean;
  admission_date: string;
  bio?: string;
  skill?: string;
  skills_list: string[];
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  duration: string;
  description: string;
  modules: string[];
  is_active: boolean;
  cover_image: string;
}

export interface Batch {
  id: string;
  name: string;
  course_id: string;
  start_date: string;
  timing: string;
  is_active: boolean;
}

export interface SubmissionVersion {
  id: string;
  version_number: number;
  file_name?: string;
  file_size?: number;
  project_url?: string;
  description: string;
  submitted_at: string;
}

export interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  course_id: string;
  course_title: string;
  submission_type: SubmissionType;
  title: string;
  description: string;
  project_url?: string;
  file_name?: string;
  file_size?: number;
  file_path?: string;
  version: number;
  status: SubmissionStatus;
  rating: number | null; // 0 to 5, allows half steps (e.g. 4.5)
  marks: number; // -1 if not graded yet, otherwise e.g. 88
  max_marks: number; // default 100
  feedback: string;
  internal_note: string; // Admin-only private note
  reviewed_by?: string;
  reviewed_at?: string;
  is_deleted: boolean; // logical archive flag
  archived_at?: string;
  archived_by?: string;
  status_before_archive?: SubmissionStatus;
  submitted_at: string;
  submission_date: string; // Karachi date string YYYY-MM-DD
  versions_history: SubmissionVersion[];
  is_public_showcase?: boolean;
}

export interface DeleteRequest {
  id: string;
  submission_id: string;
  submission_title: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  requested_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface PublicPortfolioItem {
  id: string;
  submission_id: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  course_id: string;
  course_title: string;
  title: string;
  description: string;
  preview_url?: string;
  project_url: string;
  rating: number;
  is_featured: boolean;
  is_public: boolean;
  approved_by: string;
  approved_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  course_id: string;
  batch_id: string;
  attendance_date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  marked_by: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target_audience: TargetAudience;
  target_course?: string;
  target_batch?: string;
  priority: AnnouncementPriority;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

export interface NotificationItem {
  id: string;
  student_id: string;
  title: string;
  message: string;
  category: 'review' | 'grade' | 'revision' | 'deletion' | 'announcement';
  is_read: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  student_name: string;
  roll_no: string;
  course_id: string;
  course_title: string;
  certificate_code: string; // e.g. IBA-2026-WD-084
  issued_date: string;
  grade_text: string;
  is_verified: boolean;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_email: string;
  action: string;
  target_resource: string;
  target_type?: string;
  target_id?: string;
  timestamp: string;
  created_at?: string;
  metadata?: any;
}

export interface AdminRecord {
  uid: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

export interface AcademySettings {
  academy_name: string;
  logo_url?: string;
  whatsapp_number: string;
  contact_email: string;
  address: string;
  social_links: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  footer_text: string;
  maintenance_flag: boolean;
  official_phone?: string;
  official_whatsapp?: string;
  official_email?: string;
  location?: string;
  timezone?: string;
  default_max_marks?: number;
}
