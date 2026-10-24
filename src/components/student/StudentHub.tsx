import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  FileCheck,
  CalendarCheck,
  Bell,
  User,
  Sparkles,
  ArrowRight,
  Award,
  AlertTriangle,
  Clock,
  BookOpen,
  CheckCircle2,
  Megaphone,
  Briefcase,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile } from '../../types/academy';
import { SubmitWorkModal } from './SubmitWorkModal';
import { MySubmissions } from './MySubmissions';
import { StudentAttendance } from './StudentAttendance';
import { StudentProfile } from './StudentProfile';
import { StudentNotifications } from './StudentNotifications';
import { StarRating } from '../common/StarRating';
import { formatKarachiDateTime } from '../../utils/dateUtils';

interface StudentHubProps {
  onOpenAiAdvisor: () => void;
}

export const StudentHub: React.FC<StudentHubProps> = ({ onOpenAiAdvisor }) => {
  const currentUser = academyStore.getCurrentUser();
  const [subTab, setSubTab] = useState<'overview' | 'submissions' | 'attendance' | 'profile' | 'notifications'>('overview');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Student Sign In Required</h3>
        <p className="text-xs text-slate-500 mt-1">
          Please log in with your student credentials or register your official Roll Number to access your academic dashboard.
        </p>
      </div>
    );
  }

  const submissions = academyStore.getSubmissionsForStudent(currentUser.id);
  const attendance = academyStore.getAttendanceForStudent(currentUser.id);
  const announcements = academyStore.getAnnouncements(currentUser);
  const notifications = academyStore.getNotifications(currentUser.id);

  // Compute attendance %
  const attendanceRate = useMemo(() => {
    if (attendance.length === 0) return 100;
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    const lateCount = attendance.filter((a) => a.status === 'late').length;
    return Math.round(((presentCount + lateCount * 0.75) / attendance.length) * 100);
  }, [attendance]);

  // Find latest reviewed submission
  const latestReviewed = useMemo(() => {
    return submissions.find((s) => s.status === 'reviewed' && s.marks >= 0);
  }, [submissions]);

  const pendingRevisionCount = submissions.filter((s) => s.status === 'needs_revision').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 ring-4 ring-white/20 overflow-hidden flex items-center justify-center text-2xl font-black text-amber-300 shrink-0">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt={currentUser.full_name} className="w-full h-full object-cover" />
              ) : (
                currentUser.full_name.charAt(0)
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Welcome back, {currentUser.full_name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-800 text-[11px] font-bold tracking-wide">
                  {currentUser.roll_no}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1 font-medium">{currentUser.course_title}</p>
              <div className="flex items-center gap-2 text-[11px] text-blue-300 mt-1">
                <span>{currentUser.batch}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Active Enrollment</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Work</span>
            </button>
            <button
              onClick={onOpenAiAdvisor}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Advisor</span>
            </button>
            <a
              href="#/workspace/home"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <Briefcase className="w-4 h-4 text-slate-950" />
              <span>Workspace</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="mt-8 flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'overview' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setSubTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'submissions' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>My Submissions ({submissions.length})</span>
          {pendingRevisionCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
              {pendingRevisionCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'attendance' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Attendance ({attendanceRate}%)
        </button>
        <button
          onClick={() => setSubTab('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            subTab === 'notifications' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications ({notifications.filter((n) => !n.is_read).length})</span>
        </button>
        <button
          onClick={() => setSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            subTab === 'profile' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="mt-8">
        {subTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick stats and metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setSubTab('submissions')}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Submissions
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                    <FileCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{submissions.length}</div>
                <div className="text-[11px] text-blue-700 font-semibold mt-1">
                  View evaluation cards →
                </div>
              </div>

              <div
                onClick={() => setSubTab('attendance')}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Attendance Rate
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{attendanceRate}%</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {attendance.length} Sessions logged →
                </div>
              </div>

              <div
                onClick={() => setSubTab('submissions')}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Revisions Needed
                  </span>
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-700">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mt-3">{pendingRevisionCount}</div>
                <div className="text-[11px] text-orange-700 font-semibold mt-1">
                  {pendingRevisionCount > 0 ? 'Requires attention!' : 'All clear'}
                </div>
              </div>

              <div
                onClick={onOpenAiAdvisor}
                className="p-5 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    AI Academic Mentor
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-lg font-bold mt-3">High Thinking Mode</div>
                <div className="text-[11px] text-purple-200 mt-1">
                  Code debug & rubric advice →
                </div>
              </div>
            </div>

            {/* Split Row: Latest Grade Highlight & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Grade Highlight */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" /> Latest Faculty Grade
                    </span>
                    {latestReviewed && (
                      <span className="text-[11px] text-slate-400">
                        {formatKarachiDateTime(latestReviewed.reviewed_at || latestReviewed.submitted_at)}
                      </span>
                    )}
                  </div>

                  {latestReviewed ? (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-extrabold text-slate-900">{latestReviewed.title}</h4>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-black text-emerald-600">
                            {latestReviewed.marks}/{latestReviewed.max_marks}
                          </div>
                          <StarRating rating={latestReviewed.rating} size="sm" />
                        </div>
                      </div>

                      {latestReviewed.feedback && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <strong className="text-blue-900 block mb-0.5">Teacher Remark:</strong>
                          <p className="italic">{latestReviewed.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No assignments graded yet. Submit work above to receive formal evaluation.
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Standard Grading Scale: 100 Max</span>
                  <button
                    onClick={() => setSubTab('submissions')}
                    className="font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
                  >
                    <span>All Submissions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Academy Announcements Feed */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-indigo-600" /> Academy Announcements
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Official Dispatch</span>
                  </div>

                  {announcements.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No announcements posted at this time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {announcements.slice(0, 2).map((ann) => (
                        <div
                          key={ann.id}
                          className={`p-3.5 rounded-2xl border ${
                            ann.priority === 'urgent'
                              ? 'bg-rose-50/60 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-bold text-xs text-slate-900">{ann.title}</h5>
                            {ann.priority === 'urgent' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-600 text-white">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {ann.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Targeted for: {currentUser.batch}</span>
                  <span className="text-blue-900 font-semibold">Inspire Noticeboard</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {subTab === 'submissions' && (
          <MySubmissions student={currentUser} onOpenSubmitNew={() => setIsSubmitModalOpen(true)} />
        )}

        {subTab === 'attendance' && <StudentAttendance student={currentUser} />}

        {subTab === 'notifications' && <StudentNotifications student={currentUser} />}

        {subTab === 'profile' && <StudentProfile student={currentUser} />}
      </div>

      {/* Submit Work Modal */}
      <SubmitWorkModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        student={currentUser}
        onSuccess={() => setSubTab('submissions')}
      />
    </div>
  );
};
