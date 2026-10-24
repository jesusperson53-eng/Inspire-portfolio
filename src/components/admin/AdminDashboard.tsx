import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Trash2,
  BookOpen,
  ArrowRight,
  Shield,
  Activity,
  Calendar,
  Settings,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { adminService, DashboardMetrics } from '../../services/adminService';
import { Submission } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenReviewModal?: (submission: Submission) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
}) => {
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: 'super_admin' | 'admin' }>({});
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    activeStudents: 0,
    pendingApprovals: 0,
    pendingReviews: 0,
    pendingDeletions: 0,
    activeCourses: 0,
    recentLogs: [],
  });

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminService.verifyAdmin().then((res) => {
      setAdminUser({ email: res.email, role: res.role });
    });
    loadMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Executive Academic Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-900 border border-blue-200">
              {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative telemetry, real-database counts, student approvals, and system activity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Asia/Karachi (PKT, UTC+5)</span>
          </span>
        </div>
      </div>

      {/* 6 Metric Cards (Real Counts per A2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Enrolled
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.totalStudents}
          </div>
          <div className="text-[10px] text-blue-700 font-bold mt-1">Total Students →</div>
        </div>

        {/* Active Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.activeStudents}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">Verified Active →</div>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => onNavigateTab('students')}
          className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-2xs transition-all cursor-pointer group ${
            metrics.pendingApprovals > 0 ? 'border-amber-300 hover:border-amber-400' : 'border-slate-200/90 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition-colors">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.pendingApprovals}
          </div>
          <div className="text-[10px] text-amber-700 font-bold mt-1">
            {metrics.pendingApprovals > 0 ? 'Needs approval →' : 'Zero backlog'}
          </div>
        </div>

        {/* Pending Reviews */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Reviews
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.pendingReviews}
          </div>
          <div className="text-[10px] text-purple-700 font-bold mt-1">Pending Grading →</div>
        </div>

        {/* Pending Deletions */}
        <div
          onClick={() => onNavigateTab('deletions')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Deletions
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 group-hover:bg-rose-100 transition-colors">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.pendingDeletions}
          </div>
          <div className="text-[10px] text-rose-700 font-bold mt-1">Archive Requests →</div>
        </div>

        {/* Active Courses */}
        <div
          onClick={() => onNavigateTab('courses')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Courses
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : metrics.activeCourses}
          </div>
          <div className="text-[10px] text-indigo-700 font-bold mt-1">Official Catalog →</div>
        </div>
      </div>

      {/* Main Grid: Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operational Shortcuts */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-900" />
              <span>Administrative Quick Links</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('students')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                      Manage Student Directory
                    </div>
                    <div className="text-[10px] text-slate-500">Search, approve, edit profiles</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTab('courses')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-100 hover:border-indigo-200 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      Curriculum & Batches
                    </div>
                    <div className="text-[10px] text-slate-500">10 Official Courses & Schedules</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-900 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Site & Campus Settings
                    </div>
                    <div className="text-[10px] text-slate-500">WhatsApp, email, address, branding</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1" />
              </button>

              {adminUser.role === 'super_admin' && (
                <button
                  onClick={() => onNavigateTab('admins')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">
                        Admin Credentials
                      </div>
                      <div className="text-[10px] text-amber-800">Assign & revoke admin privileges</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              <button
                onClick={() => onNavigateTab('audit')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-200 text-slate-800">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Audit Trail Telemetry
                    </div>
                    <div className="text-[10px] text-slate-500">Review immutable event logs</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity from Audit Logs (A2) */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-600" />
                  <span>Recent Institutional Activity Stream</span>
                </h3>
                <button
                  onClick={() => onNavigateTab('audit')}
                  className="text-xs font-bold text-blue-900 hover:underline"
                >
                  View Full Logs →
                </button>
              </div>

              {metrics.recentLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No activity events recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {metrics.recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                            {log.action}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {log.target_resource || log.target_type || 'System'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          by <span className="font-mono text-slate-700">{log.actor_email}</span>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 font-sans">
                        {formatKarachiDateTime(log.timestamp || log.created_at || '')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Security: All write actions recorded via PostgreSQL triggers & RPCs</span>
              <span>Grounded in Asia/Karachi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
