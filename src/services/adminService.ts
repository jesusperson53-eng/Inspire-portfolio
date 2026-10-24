import { supabase, isSupabaseConfigured, verifyDatabaseIsAdmin } from '../lib/supabase';
import {
  UserProfile,
  Course,
  Batch,
  AuditLog,
  AdminRecord,
  AcademySettings,
  ApprovalStatus,
} from '../types/academy';

export interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  pendingApprovals: number;
  pendingReviews: number;
  pendingDeletions: number;
  activeCourses: number;
  recentLogs: AuditLog[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StudentFilterOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  courseId?: string;
  batch?: string;
  status?: string;
}

export interface AuditLogFilterOptions {
  page?: number;
  pageSize?: number;
  action?: string;
  actorEmail?: string;
  startDate?: string;
  endDate?: string;
}

class AdminService {
  /**
   * Check if current user has verified administrator privileges.
   * Security Rule: Determined exclusively by database via public.is_admin().
   * Any timeout, error, or unauthenticated session strictly returns false.
   */
  public async verifyAdmin(): Promise<{
    isAdmin: boolean;
    isSuperAdmin: boolean;
    role?: 'super_admin' | 'admin';
    email?: string;
    userId?: string;
  }> {
    if (!isSupabaseConfigured || !supabase) {
      return { isAdmin: false, isSuperAdmin: false };
    }
    return await verifyDatabaseIsAdmin();
  }

  /**
   * Real counts query for Dashboard per A2.
   * Executes exact server-side counts via Supabase RLS.
   */
  public async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Admin metrics require a live Supabase connection.');
    }

    const [
      totalStudentsRes,
      activeStudentsRes,
      pendingApprovalsRes,
      pendingReviewsRes,
      pendingDeletionsRes,
      activeCoursesRes,
      recentLogsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('approval_status', 'pending'),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('is_deleted', false).in('status', ['submitted', 'under_review']),
      supabase.from('delete_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

    if (totalStudentsRes.error) {
      throw new Error(totalStudentsRes.error.message);
    }

    return {
      totalStudents: totalStudentsRes.count || 0,
      activeStudents: activeStudentsRes.count || 0,
      pendingApprovals: pendingApprovalsRes.count || 0,
      pendingReviews: pendingReviewsRes.count || 0,
      pendingDeletions: pendingDeletionsRes.count || 0,
      activeCourses: activeCoursesRes.count || 0,
      recentLogs: (recentLogsRes.data as AuditLog[]) || [],
    };
  }

  /**
   * Students Directory with Search, Filters, and Server-Side Pagination (A2)
   */
  public async getStudents(options: StudentFilterOptions): Promise<PaginatedResult<UserProfile>> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Student management requires a live Supabase connection.');
    }

    const page = Math.max(1, options.page || 1);
    const pageSize = options.pageSize || 10;
    const search = options.search?.trim() || '';
    const courseId = options.courseId && options.courseId !== 'all' ? options.courseId : '';
    const batch = options.batch && options.batch !== 'all' ? options.batch : '';
    const status = options.status && options.status !== 'all' ? options.status : '';

    let query = supabase.from('profiles').select('*', { count: 'exact' }).eq('role', 'student');
    if (courseId) query = query.eq('course_id', courseId);
    if (batch) query = query.eq('batch', batch);
    if (status) query = query.eq('approval_status', status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,roll_no.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: (data || []) as UserProfile[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize) || 1,
    };
  }

  /**
   * Fetch single student profile by ID
   */
  public async getStudentById(studentId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserProfile | null;
  }

  /**
   * Set student approval status via SECURITY DEFINER RPC: public.admin_set_student_status
   */
  public async setStudentStatus(
    studentId: string,
    status: ApprovalStatus
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_set_student_status', {
      p_student_id: studentId,
      p_status: status,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Update student profile fields via SECURITY DEFINER RPC: public.admin_update_student
   */
  public async updateStudent(
    studentId: string,
    data: {
      full_name: string;
      father_name: string;
      phone: string;
      city: string;
      course_id: string;
      batch: string;
      bio?: string;
      skills_list?: string[];
    }
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_update_student', {
      p_student_id: studentId,
      p_full_name: data.full_name,
      p_father_name: data.father_name,
      p_phone: data.phone,
      p_city: data.city,
      p_course_id: data.course_id,
      p_batch: data.batch,
      p_bio: data.bio || '',
      p_skills_list: data.skills_list || [],
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Create student with duplicate Roll No validation
   */
  public async createStudent(data: {
    full_name: string;
    father_name: string;
    email: string;
    phone: string;
    city: string;
    roll_no: string;
    course_id: string;
    batch: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const cleanRollNo = data.roll_no.trim().toUpperCase();
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate roll number
    const { data: existingRoll, error: rollErr } = await supabase
      .from('profiles')
      .select('id')
      .ilike('roll_no', cleanRollNo)
      .maybeSingle();

    if (rollErr) {
      return { success: false, error: rollErr.message };
    }

    if (existingRoll) {
      return {
        success: false,
        error: `Student Roll Number "${cleanRollNo}" is already assigned to another candidate.`,
      };
    }

    // Lookup course title
    const { data: courseData } = await supabase
      .from('courses')
      .select('title')
      .eq('id', data.course_id)
      .maybeSingle();

    const courseTitle = courseData?.title || 'Enrolled Course';

    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .insert({
        full_name: data.full_name.trim(),
        father_name: data.father_name.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        city: data.city.trim(),
        roll_no: cleanRollNo,
        course_id: data.course_id,
        course_title: courseTitle,
        skill: courseTitle,
        batch: data.batch.trim(),
        role: 'student',
        approval_status: 'pending',
        is_approved: false,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      return { success: false, error: insertErr.message };
    }

    return { success: true, user: inserted as UserProfile };
  }

  /**
   * Courses Management
   */
  public async getCourses(): Promise<Course[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as Course[];
  }

  public async setCourseActive(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_set_course_active', {
      p_id: id,
      p_is_active: isActive,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  public async upsertCourse(course: Course): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_upsert_course', {
      p_id: course.id,
      p_code: course.code,
      p_title: course.title,
      p_category: course.category,
      p_duration: course.duration,
      p_description: course.description,
      p_modules: course.modules || [],
      p_is_active: course.is_active,
      p_cover_image: course.cover_image || '',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Batches Management
   */
  public async getBatches(): Promise<Batch[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []) as Batch[];
  }

  public async upsertBatch(batch: Batch): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_upsert_batch', {
      p_id: batch.id,
      p_name: batch.name,
      p_course_id: batch.course_id,
      p_start_date: batch.start_date,
      p_timing: batch.timing,
      p_is_active: batch.is_active,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Site Settings Management
   */
  public async getSettings(): Promise<AcademySettings> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw new Error(error.message);

    const map: Record<string, any> = {};
    (data || []).forEach((row) => {
      map[row.key] = row.value;
    });

    return {
      academy_name: typeof map['academy_name'] === 'string' ? map['academy_name'] : 'Inspire Business Academy',
      logo_url: typeof map['logo_url'] === 'string' ? map['logo_url'] : '',
      whatsapp_number: typeof map['whatsapp_number'] === 'string' ? map['whatsapp_number'] : '+92 321 0000000',
      contact_email: typeof map['contact_email'] === 'string' ? map['contact_email'] : 'theinspirebusinessacademy@gmail.com',
      address: typeof map['address'] === 'string' ? map['address'] : 'Karachi, Sindh, Pakistan',
      social_links: map['social_links'] || {
        facebook: '',
        youtube: '',
        instagram: '',
        linkedin: '',
      },
      footer_text: typeof map['footer_text'] === 'string'
        ? map['footer_text']
        : 'Inspire Business Academy is a specialized institute for next-generation technology and practical skills.',
      maintenance_flag: Boolean(map['maintenance_flag']),
      official_phone: typeof map['official_phone'] === 'string' ? map['official_phone'] : '+92 300 0000000',
      official_whatsapp: typeof map['whatsapp_number'] === 'string' ? map['whatsapp_number'] : '+92 321 0000000',
      official_email: typeof map['contact_email'] === 'string' ? map['contact_email'] : 'theinspirebusinessacademy@gmail.com',
      location: typeof map['address'] === 'string' ? map['address'] : 'Karachi, Pakistan',
      timezone: 'Asia/Karachi',
      default_max_marks: 100,
    };
  }

  public async updateSetting(key: string, value: any): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_update_setting', {
      p_key: key,
      p_value: value,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Admins Management (Super Admin only per Security Rule 1 & A2)
   */
  public async getAdmins(): Promise<AdminRecord[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []) as AdminRecord[];
  }

  public async addAdmin(email: string, role: 'super_admin' | 'admin'): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_add_admin', {
      p_email: email.trim().toLowerCase(),
      p_role: role,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  public async updateAdminRole(email: string, role: 'super_admin' | 'admin'): Promise<{ success: boolean; error?: string }> {
    return this.addAdmin(email, role);
  }

  public async removeAdmin(uid: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    const { error } = await supabase.rpc('admin_remove_admin', {
      p_uid: uid,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * Audit Logs with Filtering and Server-Side Pagination
   */
  public async getAuditLogs(options: AuditLogFilterOptions): Promise<PaginatedResult<AuditLog>> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const page = Math.max(1, options.page || 1);
    const pageSize = options.pageSize || 15;
    const action = options.action?.trim() || '';
    const actor = options.actorEmail?.trim().toLowerCase() || '';

    let q = supabase.from('audit_logs').select('*', { count: 'exact' });
    if (action && action !== 'all' && action !== 'ALL') q = q.eq('action', action);
    if (actor) q = q.ilike('actor_email', `%${actor}%`);
    if (options.startDate) q = q.gte('created_at', options.startDate);
    if (options.endDate) q = q.lte('created_at', options.endDate);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await q.order('created_at', { ascending: false }).range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: (data || []) as AuditLog[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize) || 1,
    };
  }
}

export const adminService = new AdminService();
