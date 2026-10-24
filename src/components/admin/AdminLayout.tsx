import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Trash2,
  CalendarCheck,
  Megaphone,
  Award,
  History,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  BookOpen,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { InspireLogo } from '../common/InspireLogo';
import { supabase } from '../../lib/supabase';
import { adminService } from '../../services/adminService';
import { Submission } from '../../types/academy';

// Lazy-load all administrative pages per Routing & Shell specification
const AdminDashboard = lazy(() =>
  import('./AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminStudents = lazy(() =>
  import('./AdminStudents').then((m) => ({ default: m.AdminStudents }))
);
const AdminCourses = lazy(() =>
  import('./AdminCourses').then((m) => ({ default: m.AdminCourses }))
);
const AdminSettings = lazy(() =>
  import('./AdminSettings').then((m) => ({ default: m.AdminSettings }))
);
const AdminAdmins = lazy(() =>
  import('./AdminAdmins').then((m) => ({ default: m.AdminAdmins }))
);
const AdminAuditLogs = lazy(() =>
  import('./AdminAuditLogs').then((m) => ({ default: m.AdminAuditLogs }))
);
const AdminAttendance = lazy(() =>
  import('./AdminAttendance').then((m) => ({ default: m.AdminAttendance }))
);
const AdminDeletionManager = lazy(() =>
  import('./AdminDeletionManager').then((m) => ({ default: m.AdminDeletionManager }))
);
const AdminAnnouncements = lazy(() =>
  import('./AdminAnnouncements').then((m) => ({ default: m.AdminAnnouncements }))
);
const AdminCertificates = lazy(() =>
  import('./AdminCertificates').then((m) => ({ default: m.AdminCertificates }))
);
const AdminReviewQueue = lazy(() =>
  import('./AdminReviewQueue').then((m) => ({ default: m.AdminReviewQueue }))
);

interface AdminLayoutProps {
  onExitToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitToPublic }) => {
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: 'super_admin' | 'admin' }>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState<Submission | null>(null);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Derive initial tab from hash URL (e.g. #/admin/students -> 'students')
  const getSubRouteFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const parts = hash.split('/');
    if (parts[0] === 'admin' && parts[1]) {
      return parts[1];
    }
    return 'dashboard';
  };

  const [activeNav, setActiveNav] = useState(getSubRouteFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveNav(getSubRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    adminService.verifyAdmin().then((res) => {
      setAdminUser({ email: res.email, role: res.role });
    });
    adminService.getDashboardMetrics()
      .then((m) => setPendingReviewsCount(m.pendingReviews))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeNav === 'reviews' && supabase) {
      supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setSubmissions(data as Submission[]);
        });
    }
  }, [activeNav]);

  const handleNavChange = (tabId: string) => {
    setActiveNav(tabId);
    window.location.hash = `#/admin/${tabId}`;
    setMobileSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    onExitToPublic();
  };

  const isSuperAdmin = adminUser.role === 'super_admin';

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'courses', label: 'Curriculum & Batches', icon: BookOpen },
    { id: 'reviews', label: 'Grading Review Queue', icon: Clock },
    { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
    { id: 'deletions', label: 'Deletions & Archive', icon: Trash2 },
    { id: 'certificates', label: 'Certificates Registry', icon: Award },
    { id: 'announcements', label: 'Broadcasts', icon: Megaphone },
    { id: 'settings', label: 'Academy Site Settings', icon: Settings },
    ...(isSuperAdmin
      ? [{ id: 'admins', label: 'Admins & Credentials', icon: KeyRound }]
      : []),
    { id: 'audit', label: 'Audit Trail Telemetry', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased selection:bg-blue-900 selection:text-white">
      {/* Sidebar Desktop (>=1024px) */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 text-white border-r border-slate-900 shrink-0">
        <div className="p-6 border-b border-slate-900">
          <InspireLogo size="md" variant="light" />
          <div className="mt-3 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            <span>Executive Control Console</span>
          </div>
        </div>

        {/* Current Admin Pill */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="font-bold text-white flex items-center justify-between">
            <span className="truncate">{adminUser?.email?.split('@')[0] || 'Administrator'}</span>
            <span
              className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                isSuperAdmin
                  ? 'bg-amber-950 text-amber-300 border border-amber-800/80 font-bold'
                  : 'bg-blue-950 text-blue-300 border border-blue-800/80'
              }`}
            >
              {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-1">{adminUser?.email}</div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'reviews' && pendingReviewsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          <button
            onClick={onExitToPublic}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website View</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-bold cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar across desktop and mobile */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Hamburger on Mobile */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="lg:hidden">
              <InspireLogo size="sm" />
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-slate-800">Admin Console</span>
              <span>/</span>
              <span className="capitalize font-semibold text-blue-900">{activeNav}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{adminUser?.email}</span>
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Drawer (<1024px) */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-slate-950 text-white p-4 space-y-2 border-b border-slate-900 animate-in slide-in-from-top-3">
            <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="font-bold text-white">{adminUser?.email?.split('@')[0] || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400">{adminUser?.email}</div>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                className={`w-full flex items-center justify-between p-2.5 text-xs font-bold rounded-xl ${
                  activeNav === item.id ? 'bg-blue-900 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'reviews' && pendingReviewsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
              <button onClick={onExitToPublic} className="text-xs text-blue-400 font-bold">
                Public Website View
              </button>
              <button onClick={handleLogout} className="text-xs text-rose-400 font-bold">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area with Suspense for lazy loading */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          <Suspense
            fallback={
              <div className="p-16 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Loading console module...
                </p>
              </div>
            }
          >
            {activeNav === 'dashboard' && (
              <AdminDashboard
                onNavigateTab={handleNavChange}
                onOpenReviewModal={(sub) => setReviewingSubmission(sub)}
              />
            )}

            {activeNav === 'students' && <AdminStudents />}

            {activeNav === 'courses' && <AdminCourses />}

            {activeNav === 'settings' && <AdminSettings />}

            {activeNav === 'admins' && <AdminAdmins />}

            {activeNav === 'audit' && <AdminAuditLogs />}

            {activeNav === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Submissions Review Queue</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluate student deliverables with marks, star ratings, and teacher notes.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-6">Deliverable Title</th>
                        <th className="py-3.5 px-6">Candidate</th>
                        <th className="py-3.5 px-6">Program</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.filter((s) => !s.is_deleted).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                            No submissions in queue.
                          </td>
                        </tr>
                      ) : (
                        submissions
                          .filter((s) => !s.is_deleted)
                          .map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/80">
                              <td className="py-3.5 px-6 font-bold text-slate-900">
                                {sub.title}
                                <span className="block text-[10px] text-slate-400 font-normal">v{sub.version}</span>
                              </td>
                              <td className="py-3.5 px-6">
                                <div className="font-semibold text-slate-800">{sub.student_name}</div>
                                <div className="font-mono text-[10px] text-slate-500">{sub.roll_no}</div>
                              </td>
                              <td className="py-3.5 px-6 text-slate-700">{sub.course_title}</td>
                              <td className="py-3.5 px-6">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-900 border border-blue-200">
                                  {sub.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <button
                                  onClick={() => setReviewingSubmission(sub)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs"
                                >
                                  Grade / Edit
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeNav === 'attendance' && <AdminAttendance />}

            {activeNav === 'deletions' && <AdminDeletionManager />}

            {activeNav === 'announcements' && <AdminAnnouncements />}

            {activeNav === 'certificates' && <AdminCertificates />}

            {reviewingSubmission && (
              <AdminReviewQueue
                submission={reviewingSubmission}
                onClose={() => setReviewingSubmission(null)}
                onSuccess={() => {
                  setReviewingSubmission(null);
                }}
              />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
};
