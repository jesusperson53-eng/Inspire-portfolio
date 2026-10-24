import {
  UserProfile,
  Course,
  Batch,
  Submission,
  SubmissionVersion,
  DeleteRequest,
  PublicPortfolioItem,
  AttendanceRecord,
  Announcement,
  NotificationItem,
  Certificate,
  AuditLog,
  AcademySettings,
  SubmissionStatus,
  AttendanceStatus,
  TargetAudience,
  AdminRecord,
} from '../types/academy';
import { getKarachiTodayString, formatKarachiDate } from '../utils/dateUtils';
import { OFFICIAL_COURSES, DEFAULT_COURSE_ID } from '../config/courseCatalog';

const STORAGE_KEY = 'inspire_academy_db_v2';
const SESSION_KEY = 'inspire_academy_session_v1';

// 10 Official Courses from single source of truth
const INITIAL_COURSES: Course[] = OFFICIAL_COURSES;

// Initial Batches
const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-general',
    name: 'General Batch (Morning)',
    course_id: DEFAULT_COURSE_ID,
    start_date: '2026-02-01',
    timing: '10:00 AM - 12:00 PM',
    is_active: true,
  },
];

// Empty user lists - no hardcoded or mock users. All authentication and admin permissions are database-grounded.
const INITIAL_ADMINS: UserProfile[] = [];
const INITIAL_ADMIN_RECORDS: AdminRecord[] = [];
const INITIAL_STUDENTS: UserProfile[] = [];

// Clean empty collections - no fake demo submissions, certificates, announcements, or attendance
const INITIAL_SUBMISSIONS: Submission[] = [];
const INITIAL_CERTIFICATES: Certificate[] = [];
const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

// Initial Settings matching site_settings key/values
const INITIAL_SETTINGS: AcademySettings = {
  academy_name: 'Inspire Business Academy',
  logo_url: '',
  whatsapp_number: '+92 321 0000000',
  contact_email: 'theinspirebusinessacademy@gmail.com',
  address: 'Karachi, Sindh, Pakistan',
  social_links: {
    facebook: 'https://facebook.com/inspirebusinessacademy',
    youtube: 'https://youtube.com/@inspirebusinessacademy',
    instagram: 'https://instagram.com/inspirebusinessacademy',
    linkedin: 'https://linkedin.com/company/inspirebusinessacademy',
  },
  footer_text: 'Inspire Business Academy is a specialized institute for next-generation technology, digital commerce, and industry-accredited practical education.',
  maintenance_flag: false,
  official_phone: '+92 300 0000000',
  official_whatsapp: '+92 321 0000000',
  official_email: 'theinspirebusinessacademy@gmail.com',
  location: 'Karachi, Pakistan',
  timezone: 'Asia/Karachi',
  default_max_marks: 100,
};

function generateInitialAttendance(): AttendanceRecord[] {
  return [];
}

interface DatabaseState {
  courses: Course[];
  batches: Batch[];
  users: UserProfile[];
  admins: AdminRecord[];
  submissions: Submission[];
  delete_requests: DeleteRequest[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  certificates: Certificate[];
  audit_logs: AuditLog[];
  settings: AcademySettings;
}

class AcademyStore {
  private state: DatabaseState;
  private currentUser: UserProfile | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.currentUser = this.loadSession();
  }

  private loadState(): DatabaseState {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Ensure ONLY the 10 official courses exist, preserving any admin is_active changes
        const existingCourses: Course[] = parsed.courses || [];
        const sanitizedCourses = OFFICIAL_COURSES.map((official) => {
          const matched = existingCourses.find(
            (c) => c.id === official.id || c.title.toLowerCase() === official.title.toLowerCase()
          );
          return matched ? { ...official, is_active: matched.is_active, description: matched.description || official.description } : official;
        });

        const sanitizedUsers: UserProfile[] = (parsed.users || []).filter((u: UserProfile) => {
          if (u.id === 'student-zayan' || u.id === 'student-fatima' || u.id === 'student-bilal') return false;
          if (u.email && u.email.endsWith('@example.com')) return false;
          return true;
        });

        // Filter out demo submissions
        const sanitizedSubmissions: Submission[] = (parsed.submissions || []).filter((s: Submission) => {
          if (s.id === 'sub-001' || s.id === 'sub-002' || s.id === 'sub-003' || s.id === 'sub-004') return false;
          if (s.student_id === 'student-zayan' || s.student_id === 'student-fatima' || s.student_id === 'student-bilal') return false;
          return true;
        });

        // Filter out demo certificates
        const sanitizedCertificates: Certificate[] = (parsed.certificates || []).filter((c: Certificate) => {
          if (c.id === 'cert-001' || c.id === 'cert-002') return false;
          if (c.certificate_code === 'IBA-2026-WD-084' || c.certificate_code === 'IBA-2026-PY-112') return false;
          return true;
        });

        // Filter out demo announcements
        const sanitizedAnnouncements: Announcement[] = (parsed.announcements || []).filter((a: Announcement) => {
          if (a.id === 'ann-1' || a.id === 'ann-2') return false;
          return true;
        });

        // Filter out demo attendance
        const sanitizedAttendance: AttendanceRecord[] = (parsed.attendance || []).filter((a: AttendanceRecord) => {
          if (a.student_id === 'student-zayan' || a.student_id === 'student-fatima' || a.student_id === 'student-bilal') return false;
          return true;
        });

        // Filter out demo notifications
        const sanitizedNotifications: NotificationItem[] = (parsed.notifications || []).filter((n: NotificationItem) => {
          if (n.id === 'notif-1' || n.id === 'notif-2') return false;
          return true;
        });

        // Admins table representation
        const sanitizedAdmins: AdminRecord[] = parsed.admins && parsed.admins.length > 0 ? parsed.admins : [];

        // Ensure settings merge with new site_settings keys
        const mergedSettings: AcademySettings = {
          ...INITIAL_SETTINGS,
          ...(parsed.settings || {}),
        };

        const state: DatabaseState = {
          courses: sanitizedCourses,
          batches: parsed.batches && parsed.batches.length > 0 ? parsed.batches : INITIAL_BATCHES,
          users: sanitizedUsers,
          admins: sanitizedAdmins,
          submissions: sanitizedSubmissions,
          delete_requests: parsed.delete_requests || [],
          attendance: sanitizedAttendance,
          announcements: sanitizedAnnouncements,
          notifications: sanitizedNotifications,
          certificates: sanitizedCertificates,
          audit_logs: parsed.audit_logs || [],
          settings: mergedSettings,
        };

        this.saveState(state);
        return state;
      }
    } catch (e) {
      console.warn('Error loading database from localStorage, initializing fresh:', e);
    }

    const defaultState: DatabaseState = {
      courses: INITIAL_COURSES,
      batches: INITIAL_BATCHES,
      users: [],
      admins: [],
      submissions: [],
      delete_requests: [],
      attendance: [],
      announcements: [],
      notifications: [],
      certificates: [],
      audit_logs: [],
      settings: INITIAL_SETTINGS,
    };

    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state?: DatabaseState): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state || this.state));
      }
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
    }
  }

  private loadSession(): UserProfile | null {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(SESSION_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('Error loading session:', e);
    }
    return null;
  }

  private saveSession(user: UserProfile | null): void {
    try {
      if (typeof localStorage !== 'undefined') {
        if (user) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.error('Error saving session:', e);
    }
  }

  private notify(): void {
    this.saveState(this.state);
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Session & Auth
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAdmin(userId?: string): boolean {
    const targetId = userId || this.currentUser?.id;
    if (!targetId) return false;
    return this.state.admins.some((a) => a.uid === targetId);
  }

  public isSuperAdmin(userId?: string): boolean {
    const targetId = userId || this.currentUser?.id;
    if (!targetId) return false;
    return this.state.admins.some((a) => a.uid === targetId && a.role === 'super_admin');
  }

  public login(email: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.state.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'Account not found with this email. Please check spelling or register.' };
    }

    // Security Rule 1: Admin role decided ONLY by trusted admins table
    const adminRecord = this.state.admins.find((a) => a.uid === user.id || a.email.toLowerCase() === cleanEmail);
    if (adminRecord) {
      user.role = adminRecord.role;
    } else {
      user.role = 'student';
    }

    if (!user.is_active || user.approval_status === 'blocked') {
      return { success: false, error: 'This account is currently inactive or blocked by administration.' };
    }

    this.currentUser = user;
    this.saveSession(user);
    this.logAudit(user.id, user.email, 'USER_LOGIN', `user:${user.id}`, { role: user.role });
    this.notify();
    return { success: true, user };
  }

  public registerStudent(data: {
    full_name: string;
    father_name: string;
    email: string;
    phone: string;
    city: string;
    roll_no: string;
    course_id: string;
    batch: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanRollNo = data.roll_no.trim().toUpperCase();

    // Verify email uniqueness
    if (this.state.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A student with this email address already exists.' };
    }

    // Verify roll number uniqueness
    if (this.state.users.some((u) => u.roll_no.toUpperCase() === cleanRollNo)) {
      return { success: false, error: `Student ID / Roll No "${cleanRollNo}" is already assigned to another student.` };
    }

    const course = this.state.courses.find((c) => c.id === data.course_id);

    const newUser: UserProfile = {
      id: `student-${Date.now()}`,
      email: cleanEmail,
      full_name: data.full_name.trim(),
      father_name: data.father_name.trim(),
      phone: data.phone.trim(),
      city: data.city.trim() || 'Karachi',
      roll_no: cleanRollNo,
      batch: data.batch || 'Batch 2026-A',
      course_id: data.course_id,
      course_title: course ? course.title : 'General Academic Program',
      role: 'student',
      approval_status: 'approved', // Auto-approved for frictionless onboarding, can be moderated
      is_approved: true,
      is_active: true,
      admission_date: getKarachiTodayString(),
      skills_list: ['Student', course ? course.title : 'General Studies'],
      created_at: new Date().toISOString(),
    };

    this.state.users.push(newUser);
    this.currentUser = newUser;
    this.saveSession(newUser);

    this.logAudit(newUser.id, newUser.email, 'STUDENT_REGISTER', `user:${newUser.id}`, { roll_no: newUser.roll_no });

    // Send welcome notification
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: newUser.id,
      title: 'Welcome to Inspire Business Academy',
      message: `Your student profile has been registered with Student ID ${newUser.roll_no}. You can now submit assignments and track progress.`,
      category: 'announcement',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.notify();
    return { success: true, user: newUser };
  }

  public logout(): void {
    if (this.currentUser) {
      this.logAudit(this.currentUser.id, this.currentUser.email, 'USER_LOGOUT', `user:${this.currentUser.id}`);
    }
    this.currentUser = null;
    this.saveSession(null);
    this.notify();
  }

  // Course Management
  public getCourses(): Course[] {
    return this.state.courses;
  }

  public getActiveCourses(): Course[] {
    return this.state.courses.filter((c) => c.is_active);
  }

  public toggleCourseActive(courseId: string, isActive?: boolean): { success: boolean; course?: Course } {
    const course = this.state.courses.find((c) => c.id === courseId);
    if (!course) return { success: false };
    course.is_active = isActive !== undefined ? isActive : !course.is_active;
    this.saveState();
    this.notify();
    return { success: true, course };
  }

  public updateCourse(courseData: Partial<Course> & { id: string }): { success: boolean; course?: Course } {
    const index = this.state.courses.findIndex((c) => c.id === courseData.id);
    if (index === -1) return { success: false };
    this.state.courses[index] = { ...this.state.courses[index], ...courseData };
    this.saveState();
    this.notify();
    return { success: true, course: this.state.courses[index] };
  }

  public getBatches(): Batch[] {
    return this.state.batches;
  }

  public getAllStudents(): UserProfile[] {
    return this.state.users.filter((u) => u.role === 'student');
  }

  public getStudentById(id: string): UserProfile | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public getSubmissions(): Submission[] {
    return this.state.submissions;
  }

  public getSubmissionsForStudent(studentId: string): Submission[] {
    return this.state.submissions.filter((s) => s.student_id === studentId && !s.is_deleted);
  }

  public getPublicPortfolios(): PublicPortfolioItem[] {
    // Generate public showcase items from reviewed and approved submissions
    return this.state.submissions
      .filter((s) => !s.is_deleted && s.is_public_showcase && (s.status === 'reviewed' || s.rating !== null))
      .map((s) => ({
        id: `pub-${s.id}`,
        submission_id: s.id,
        student_id: s.student_id,
        student_name: s.student_name,
        roll_no: s.roll_no,
        course_id: s.course_id,
        course_title: s.course_title,
        title: s.title,
        description: s.description,
        project_url: s.project_url || '',
        preview_url: s.file_path,
        rating: s.rating || 5.0,
        is_featured: (s.marks >= 95 || s.rating === 5),
        is_public: true,
        approved_by: s.reviewed_by || 'Academy Review Board',
        approved_at: s.reviewed_at || s.submitted_at,
      }));
  }

  public getDeleteRequests(): DeleteRequest[] {
    return this.state.delete_requests;
  }

  public getArchivedSubmissions(): Submission[] {
    return this.state.submissions.filter((s) => s.is_deleted);
  }

  public getAttendance(): AttendanceRecord[] {
    return this.state.attendance;
  }

  public getAttendanceForStudent(studentId: string): AttendanceRecord[] {
    return this.state.attendance.filter((a) => a.student_id === studentId);
  }

  public getAnnouncements(student?: UserProfile | null): Announcement[] {
    if (!student || student.role === 'admin' || student.role === 'super_admin') {
      return this.state.announcements;
    }
    return this.state.announcements.filter((a) => {
      if (!a.is_published) return false;
      if (a.target_audience === 'all') return true;
      if (a.target_audience === 'course' && a.target_course === student.course_id) return true;
      if (a.target_audience === 'batch' && a.target_batch === student.batch) return true;
      return false;
    });
  }

  public getNotifications(studentId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.student_id === studentId);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.notify();
    }
  }

  public getCertificates(): Certificate[] {
    return this.state.certificates;
  }

  public verifyCertificateByCode(code: string): Certificate | null {
    const clean = code.trim().toUpperCase();
    return this.state.certificates.find((c) => c.certificate_code.toUpperCase() === clean && c.is_verified) || null;
  }

  public getAuditLogs(): AuditLog[] {
    return this.state.audit_logs;
  }

  public getSettings(): AcademySettings {
    return this.state.settings;
  }

  // Student Actions
  public submitWork(data: {
    student_id: string;
    course_id: string;
    submission_type: 'project' | 'assignment' | 'case_study';
    title: string;
    description: string;
    project_url?: string;
    file_name?: string;
    file_size?: number;
  }): { success: boolean; submission?: Submission; error?: string } {
    const student = this.state.users.find((u) => u.id === data.student_id);
    if (!student) return { success: false, error: 'Student profile not found.' };

    const course = this.state.courses.find((c) => c.id === data.course_id) || {
      id: data.course_id,
      title: student.course_title,
    };

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      roll_no: student.roll_no,
      course_id: course.id,
      course_title: course.title,
      submission_type: data.submission_type,
      title: data.title.trim(),
      description: data.description.trim(),
      project_url: data.project_url?.trim(),
      file_name: data.file_name,
      file_size: data.file_size,
      version: 1,
      status: 'submitted',
      rating: null,
      marks: -1,
      max_marks: this.state.settings.default_max_marks || 100,
      feedback: '',
      internal_note: '',
      is_deleted: false,
      submitted_at: new Date().toISOString(),
      submission_date: getKarachiTodayString(),
      versions_history: [],
      is_public_showcase: false,
    };

    this.state.submissions.unshift(newSub);
    this.logAudit(student.id, student.email, 'SUBMISSION_CREATED', `submission:${newSub.id}`, { title: newSub.title });
    this.notify();
    return { success: true, submission: newSub };
  }

  public resubmitWork(
    submissionId: string,
    data: {
      description: string;
      project_url?: string;
      file_name?: string;
      file_size?: number;
    }
  ): { success: boolean; error?: string } {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub) return { success: false, error: 'Submission not found.' };

    if (sub.is_deleted) return { success: false, error: 'Cannot resubmit an archived submission.' };

    // Capture previous version snapshot
    const previousSnapshot: SubmissionVersion = {
      id: `v-${sub.version}-${Date.now()}`,
      version_number: sub.version,
      project_url: sub.project_url,
      file_name: sub.file_name,
      file_size: sub.file_size,
      description: sub.description,
      submitted_at: sub.submitted_at,
    };

    sub.versions_history.push(previousSnapshot);
    sub.version += 1;
    sub.description = data.description.trim();
    if (data.project_url) sub.project_url = data.project_url.trim();
    if (data.file_name) {
      sub.file_name = data.file_name;
      sub.file_size = data.file_size;
    }
    sub.status = 'submitted'; // Reset status to submitted for re-review
    sub.submitted_at = new Date().toISOString();
    sub.submission_date = getKarachiTodayString();

    this.logAudit(sub.student_id, sub.student_name, 'SUBMISSION_RESUBMITTED', `submission:${sub.id}`, {
      new_version: sub.version,
    });
    this.notify();
    return { success: true };
  }

  public requestDeletion(submissionId: string, reason: string): { success: boolean; error?: string } {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub) return { success: false, error: 'Submission not found.' };

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'Please provide a clear reason for the deletion request.' };
    }

    // Check if pending request exists
    if (this.state.delete_requests.some((r) => r.submission_id === submissionId && r.status === 'pending')) {
      return { success: false, error: 'A deletion request is already pending review for this submission.' };
    }

    const request: DeleteRequest = {
      id: `del-req-${Date.now()}`,
      submission_id: sub.id,
      submission_title: sub.title,
      student_id: sub.student_id,
      student_name: sub.student_name,
      roll_no: sub.roll_no,
      reason: reason.trim(),
      status: 'pending',
      requested_at: new Date().toISOString(),
    };

    this.state.delete_requests.unshift(request);
    this.logAudit(sub.student_id, sub.student_name, 'DELETION_REQUESTED', `submission:${sub.id}`, { reason });
    this.notify();
    return { success: true };
  }

  public updateStudentProfile(
    studentId: string,
    updates: { full_name?: string; bio?: string; skills_list?: string[]; avatar_url?: string; phone?: string; city?: string }
  ): { success: boolean } {
    const student = this.state.users.find((u) => u.id === studentId);
    if (!student) return { success: false };

    if (updates.full_name) student.full_name = updates.full_name.trim();
    if (updates.bio !== undefined) student.bio = updates.bio;
    if (updates.skills_list) student.skills_list = updates.skills_list;
    if (updates.avatar_url) student.avatar_url = updates.avatar_url;
    if (updates.phone) student.phone = updates.phone;
    if (updates.city) student.city = updates.city;

    if (this.currentUser && this.currentUser.id === student.id) {
      this.currentUser = student;
      this.saveSession(student);
    }

    this.notify();
    return { success: true };
  }

  // Admin Actions
  public adminReviewSubmission(
    submissionId: string,
    review: {
      status: SubmissionStatus;
      rating: number | null;
      marks: number;
      feedback: string;
      internal_note: string;
      reviewer_name: string;
    }
  ): { success: boolean; error?: string } {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub) return { success: false, error: 'Submission not found.' };

    sub.status = review.status;
    sub.rating = review.rating;
    sub.marks = review.marks;
    sub.feedback = review.feedback.trim();
    sub.internal_note = review.internal_note.trim();
    sub.reviewed_by = review.reviewer_name;
    sub.reviewed_at = new Date().toISOString();

    // If grade is exemplary, optionally auto-suggest showcase
    if (review.rating && review.rating >= 4.5 && review.status === 'reviewed') {
      sub.is_public_showcase = true;
    }

    // Send notification to student
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: sub.student_id,
      title: review.status === 'needs_revision' ? 'Changes Requested on Submission' : 'Assignment Reviewed & Graded',
      message:
        review.status === 'needs_revision'
          ? `Instructor ${review.reviewer_name} requested updates on "${sub.title}". Check teacher notes to resubmit.`
          : `Your submission "${sub.title}" has been graded: ${review.marks >= 0 ? `${review.marks}/${sub.max_marks}` : 'Reviewed'}${
              review.rating ? ` (${review.rating} Stars)` : ''
            }.`,
      category: review.status === 'needs_revision' ? 'revision' : 'grade',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'SUBMISSION_REVIEWED', `submission:${sub.id}`, {
      status: review.status,
      marks: review.marks,
      rating: review.rating,
    });

    this.notify();
    return { success: true };
  }

  public adminApproveDeletion(requestId: string, adminNote: string): { success: boolean } {
    const req = this.state.delete_requests.find((r) => r.id === requestId);
    if (!req) return { success: false };

    req.status = 'approved';
    req.admin_note = adminNote;
    req.resolved_at = new Date().toISOString();
    req.resolved_by = this.currentUser?.full_name || 'Admin';

    // Logically archive the submission (TRD §5.6 - NEVER delete files or rows permanently, archive with full audit)
    const sub = this.state.submissions.find((s) => s.id === req.submission_id);
    if (sub) {
      sub.status_before_archive = sub.status;
      sub.is_deleted = true;
      sub.status = 'archived';
      sub.archived_at = new Date().toISOString();
      sub.archived_by = this.currentUser?.id || 'admin';
      sub.is_public_showcase = false; // Hide from public portfolio
    }

    // Notify student
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: req.student_id,
      title: 'Deletion Request Approved',
      message: `Your request to remove "${req.submission_title}" has been approved and securely archived.`,
      category: 'deletion',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'DELETION_APPROVED_ARCHIVED', `submission:${req.submission_id}`, {
      reason: req.reason,
      adminNote,
    });

    this.notify();
    return { success: true };
  }

  public adminRejectDeletion(requestId: string, adminNote: string): { success: boolean } {
    const req = this.state.delete_requests.find((r) => r.id === requestId);
    if (!req) return { success: false };

    req.status = 'rejected';
    req.admin_note = adminNote;
    req.resolved_at = new Date().toISOString();
    req.resolved_by = this.currentUser?.full_name || 'Admin';

    // Notify student
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: req.student_id,
      title: 'Deletion Request Declined',
      message: `Your deletion request for "${req.submission_title}" was declined. Reason: ${adminNote || 'Contact administration.'}`,
      category: 'deletion',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'DELETION_REJECTED', `request:${req.id}`, { adminNote });
    this.notify();
    return { success: true };
  }

  public adminRestoreSubmission(submissionId: string): { success: boolean } {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub || !sub.is_deleted) return { success: false };

    sub.is_deleted = false;
    sub.status = sub.status_before_archive || 'submitted';
    sub.archived_at = undefined;
    sub.archived_by = undefined;
    sub.is_public_showcase = false; // Does not auto-republish publicly (TRD §5.6)

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'SUBMISSION_RESTORED', `submission:${sub.id}`);
    this.notify();
    return { success: true };
  }

  public togglePublicShowcase(submissionId: string, isPublic: boolean, isFeatured: boolean = false): void {
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.is_public_showcase = isPublic;
      this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'PORTFOLIO_SHOWCASE_TOGGLED', `submission:${sub.id}`, {
        isPublic,
        isFeatured,
      });
      this.notify();
    }
  }

  public adminMarkAttendance(record: {
    student_id: string;
    course_id: string;
    batch_id: string;
    attendance_date: string;
    status: AttendanceStatus;
    note?: string;
  }): void {
    const student = this.state.users.find((u) => u.id === record.student_id);
    if (!student) return;

    const existingIndex = this.state.attendance.findIndex(
      (a) => a.student_id === record.student_id && a.attendance_date === record.attendance_date
    );

    const fullRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? this.state.attendance[existingIndex].id : `att-${record.student_id}-${record.attendance_date}`,
      student_id: record.student_id,
      student_name: student.full_name,
      roll_no: student.roll_no,
      course_id: record.course_id,
      batch_id: record.batch_id,
      attendance_date: record.attendance_date,
      status: record.status,
      note: record.note,
      marked_by: this.currentUser?.full_name || 'Admin Instructor',
    };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = fullRecord;
    } else {
      this.state.attendance.push(fullRecord);
    }

    this.notify();
  }

  public adminMarkAllPresent(courseId: string, batchId: string, attendance_date: string): void {
    const targetStudents = this.state.users.filter(
      (u) => u.role === 'student' && (!courseId || u.course_id === courseId) && (!batchId || u.batch === batchId)
    );

    targetStudents.forEach((stu) => {
      this.adminMarkAttendance({
        student_id: stu.id,
        course_id: stu.course_id,
        batch_id: stu.batch,
        attendance_date,
        status: 'present',
      });
    });

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'MARK_ALL_PRESENT', `date:${attendance_date}`, {
      count: targetStudents.length,
      courseId,
    });
    this.notify();
  }

  public createAnnouncement(data: {
    title: string;
    message: string;
    target_audience: TargetAudience;
    target_course?: string;
    target_batch?: string;
    priority: 'normal' | 'high' | 'urgent';
  }): Announcement {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title.trim(),
      message: data.message.trim(),
      target_audience: data.target_audience,
      target_course: data.target_course,
      target_batch: data.target_batch,
      priority: data.priority,
      is_published: true,
      created_at: new Date().toISOString(),
      created_by: this.currentUser?.full_name || 'Academy Administration',
    };

    this.state.announcements.unshift(newAnn);
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'ANNOUNCEMENT_CREATED', `announcement:${newAnn.id}`);
    this.notify();
    return newAnn;
  }

  public issueCertificate(data: {
    student_id: string;
    course_id: string;
    grade_text: string;
  }): { success: boolean; certificate?: Certificate; error?: string } {
    const student = this.state.users.find((u) => u.id === data.student_id);
    if (!student) return { success: false, error: 'Student not found.' };

    const course = this.state.courses.find((c) => c.id === data.course_id);
    const courseCode = course ? course.code.split('-')[0] : 'IBA';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const certCode = `IBA-2026-${courseCode}-${randomSuffix}`;

    const cert: Certificate = {
      id: `cert-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      roll_no: student.roll_no,
      course_id: data.course_id,
      course_title: course ? course.title : student.course_title,
      certificate_code: certCode,
      issued_date: getKarachiTodayString(),
      grade_text: data.grade_text.trim(),
      is_verified: true,
    };

    this.state.certificates.push(cert);

    // Notify student
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      student_id: student.id,
      title: 'Official Certificate Issued!',
      message: `Congratulations! Your verified certificate for ${cert.course_title} has been issued with Credential Code: ${cert.certificate_code}`,
      category: 'grade',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'CERTIFICATE_ISSUED', `cert:${cert.certificate_code}`, {
      student_id: student.id,
    });
    this.notify();
    return { success: true, certificate: cert };
  }

  public updateAcademySettings(settings: Partial<AcademySettings>): void {
    this.state.settings = { ...this.state.settings, ...settings };
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'SETTINGS_UPDATED', 'academy_settings');
    this.notify();
  }

  // Part A Admin Methods
  public getAdmins(): AdminRecord[] {
    return [...this.state.admins];
  }

  public addAdmin(email: string, role: 'super_admin' | 'admin'): { success: boolean; error?: string } {
    if (!this.isSuperAdmin()) {
      return { success: false, error: 'Access Denied: Super Administrator role required to manage administrators.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = this.state.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existingUser) {
      return { success: false, error: `No registered account found with email "${cleanEmail}". The user must register first.` };
    }
    if (this.state.admins.some((a) => a.uid === existingUser.id || a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'This account already holds administrator privileges.' };
    }

    const newAdmin: AdminRecord = {
      uid: existingUser.id,
      email: existingUser.email,
      full_name: existingUser.full_name || 'Administrator',
      role,
      created_at: new Date().toISOString(),
    };
    this.state.admins.push(newAdmin);
    existingUser.role = role;

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'ADD_ADMIN', `admin:${existingUser.id}`, {
      email: cleanEmail,
      role,
    });
    this.notify();
    return { success: true };
  }

  public updateAdminRole(uid: string, newRole: 'super_admin' | 'admin'): { success: boolean; error?: string } {
    if (!this.isSuperAdmin()) {
      return { success: false, error: 'Access Denied: Super Administrator role required.' };
    }
    const adm = this.state.admins.find((a) => a.uid === uid);
    if (!adm) return { success: false, error: 'Admin record not found.' };

    if (adm.role === 'super_admin' && newRole === 'admin') {
      const remainingSuper = this.state.admins.filter((a) => a.role === 'super_admin' && a.uid !== uid).length;
      if (remainingSuper === 0) {
        return { success: false, error: 'Cannot demote the last Super Administrator.' };
      }
    }

    adm.role = newRole;
    const user = this.state.users.find((u) => u.id === uid);
    if (user) user.role = newRole;

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'UPDATE_ADMIN_ROLE', `admin:${uid}`, {
      new_role: newRole,
    });
    this.notify();
    return { success: true };
  }

  public removeAdmin(uid: string): { success: boolean; error?: string } {
    if (!this.isSuperAdmin()) {
      return { success: false, error: 'Access Denied: Super Administrator role required.' };
    }
    if (this.currentUser?.id === uid) {
      return { success: false, error: 'Operation not permitted: You cannot remove your own administrator account.' };
    }
    const target = this.state.admins.find((a) => a.uid === uid);
    if (!target) return { success: false, error: 'Admin not found.' };

    if (target.role === 'super_admin') {
      const remainingSuper = this.state.admins.filter((a) => a.role === 'super_admin' && a.uid !== uid).length;
      if (remainingSuper === 0) {
        return { success: false, error: 'Cannot remove the last Super Administrator.' };
      }
    }

    this.state.admins = this.state.admins.filter((a) => a.uid !== uid);
    const user = this.state.users.find((u) => u.id === uid);
    if (user) user.role = 'student';

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'REMOVE_ADMIN', `admin:${uid}`, {
      target_email: target.email,
    });
    this.notify();
    return { success: true };
  }

  public setStudentStatus(studentId: string, status: 'pending' | 'approved' | 'rejected' | 'blocked'): { success: boolean; error?: string } {
    const student = this.state.users.find((u) => u.id === studentId);
    if (!student) return { success: false, error: 'Student not found.' };

    student.approval_status = status;
    student.is_active = status === 'approved';
    student.is_approved = status === 'approved';

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'SET_STUDENT_STATUS', `student:${student.id}`, {
      new_status: status,
      roll_no: student.roll_no,
    });
    this.notify();
    return { success: true };
  }

  public updateStudent(studentId: string, data: Partial<UserProfile>): { success: boolean; error?: string } {
    const student = this.state.users.find((u) => u.id === studentId);
    if (!student) return { success: false, error: 'Student not found.' };

    // Update safe fields only
    if (data.full_name !== undefined) student.full_name = data.full_name.trim();
    if (data.father_name !== undefined) student.father_name = data.father_name.trim();
    if (data.phone !== undefined) student.phone = data.phone.trim();
    if (data.city !== undefined) student.city = data.city.trim();
    if (data.bio !== undefined) student.bio = data.bio;
    if (data.skills_list !== undefined) student.skills_list = data.skills_list;
    if (data.batch !== undefined) student.batch = data.batch.trim();
    if (data.course_id !== undefined) {
      const course = this.state.courses.find((c) => c.id === data.course_id);
      student.course_id = data.course_id;
      if (course) {
        student.course_title = course.title;
        student.skill = course.title;
      }
    }

    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'UPDATE_STUDENT_PROFILE', `student:${student.id}`, {
      full_name: student.full_name,
      course_id: student.course_id,
      batch: student.batch,
    });
    this.notify();
    return { success: true };
  }

  public upsertCourse(courseData: Partial<Course> & { id: string; title: string; code: string }): { success: boolean; course?: Course; error?: string } {
    const existingIndex = this.state.courses.findIndex((c) => c.id === courseData.id);
    let updatedCourse: Course;
    if (existingIndex >= 0) {
      this.state.courses[existingIndex] = { ...this.state.courses[existingIndex], ...courseData };
      updatedCourse = this.state.courses[existingIndex];
    } else {
      updatedCourse = {
        id: courseData.id,
        title: courseData.title,
        code: courseData.code,
        category: courseData.category || '',
        duration: courseData.duration || '2 Months',
        description: courseData.description || '',
        modules: courseData.modules || [],
        is_active: courseData.is_active !== undefined ? courseData.is_active : true,
        cover_image: courseData.cover_image || '',
      };
      this.state.courses.push(updatedCourse);
    }
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'UPSERT_COURSE', `course:${updatedCourse.id}`, {
      title: updatedCourse.title,
      code: updatedCourse.code,
      is_active: updatedCourse.is_active,
    });
    this.notify();
    return { success: true, course: updatedCourse };
  }

  public upsertBatch(batchData: Batch): { success: boolean; batch?: Batch } {
    const existingIndex = this.state.batches.findIndex((b) => b.id === batchData.id);
    if (existingIndex >= 0) {
      this.state.batches[existingIndex] = { ...this.state.batches[existingIndex], ...batchData };
    } else {
      this.state.batches.push(batchData);
    }
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'UPSERT_BATCH', `batch:${batchData.id}`, {
      name: batchData.name,
      course_id: batchData.course_id,
      is_active: batchData.is_active,
    });
    this.notify();
    return { success: true, batch: batchData };
  }

  public toggleBatchActive(batchId: string, isActive?: boolean): { success: boolean } {
    const b = this.state.batches.find((batch) => batch.id === batchId);
    if (!b) return { success: false };
    b.is_active = isActive !== undefined ? isActive : !b.is_active;
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'TOGGLE_BATCH_ACTIVE', `batch:${batchId}`, {
      is_active: b.is_active,
    });
    this.notify();
    return { success: true };
  }

  public updateSetting(key: string, value: any): { success: boolean } {
    (this.state.settings as any)[key] = value;
    if (key === 'whatsapp_number') this.state.settings.official_whatsapp = value;
    if (key === 'contact_email') this.state.settings.official_email = value;
    if (key === 'address') this.state.settings.location = value;
    this.logAudit(this.currentUser?.id || 'admin', this.currentUser?.email || 'admin', 'UPDATE_SETTING', `setting:${key}`, { value });
    this.notify();
    return { success: true };
  }

  public exportAttendanceCSV(courseId?: string, batchId?: string): string {
    const filtered = this.state.attendance.filter(
      (a) => (!courseId || a.course_id === courseId) && (!batchId || a.batch_id === batchId)
    );

    const headers = ['Attendance ID', 'Date (Karachi)', 'Roll Number', 'Student Name', 'Course ID', 'Status', 'Note', 'Marked By'];
    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.attendance_date}"`,
      `"${r.roll_no}"`,
      `"${r.student_name.replace(/"/g, '""')}"`,
      `"${r.course_id}"`,
      `"${r.status.toUpperCase()}"`,
      `"${(r.note || '').replace(/"/g, '""')}"`,
      `"${r.marked_by.replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  private logAudit(actor_id: string, actor_email: string, action: string, target_resource: string, metadata?: any): void {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id,
      actor_email,
      action,
      target_resource,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.state.audit_logs.unshift(log);
  }
}

export const academyStore = new AcademyStore();
