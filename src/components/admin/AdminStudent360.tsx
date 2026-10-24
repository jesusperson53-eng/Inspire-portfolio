import React, { useState } from 'react';
import {
  X,
  User,
  CalendarCheck,
  FileCheck,
  Award,
  Trash2,
  Share2,
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Edit3,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { adminService } from '../../services/adminService';
import { UserProfile } from '../../types/academy';
import { StatusChip } from '../common/StatusChip';
import { formatKarachiDate, formatKarachiDateTime } from '../../utils/dateUtils';

interface AdminStudent360Props {
  studentId: string;
  onClose: () => void;
  onStudentUpdated?: () => void;
}

export const AdminStudent360: React.FC<AdminStudent360Props> = ({
  studentId,
  onClose,
  onStudentUpdated,
}) => {
  const student = academyStore.getStudentById(studentId);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'attendance' | 'submissions' | 'grades' | 'deletions' | 'portfolio' | 'certificates' | 'activity'
  >('profile');

  // Edit safe fields modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student?.full_name || '');
  const [editFather, setEditFather] = useState(student?.father_name || '');
  const [editPhone, setEditPhone] = useState(student?.phone || '');
  const [editCity, setEditCity] = useState(student?.city || 'Karachi');
  const [editCourseId, setEditCourseId] = useState(student?.course_id || '');
  const [editBatch, setEditBatch] = useState(student?.batch || '');
  const [editBio, setEditBio] = useState(student?.bio || '');
  const [editSkills, setEditSkills] = useState((student?.skills_list || []).join(', '));
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  if (!student) return null;

  const courses = academyStore.getCourses();
  const batches = academyStore.getBatches();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSubmitting(true);

    const skillsArray = editSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await adminService.updateStudent(student.id, {
      full_name: editName,
      father_name: editFather,
      phone: editPhone,
      city: editCity,
      course_id: editCourseId,
      batch: editBatch,
      bio: editBio,
      skills_list: skillsArray,
    });

    setEditSubmitting(false);

    if (res.success) {
      setIsEditing(false);
      onStudentUpdated?.();
    } else {
      setEditError(res.error || 'Failed to update student profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-5 text-white relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 ring-2 ring-white/20 overflow-hidden flex items-center justify-center text-xl font-black text-amber-300 shrink-0">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
              ) : (
                student.full_name.charAt(0) || 'S'
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">{student.full_name}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-800 text-blue-100 font-bold">
                  {student.roll_no}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    student.approval_status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : student.approval_status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {student.approval_status}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {student.course_title} • {student.batch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[11px] text-slate-400">Student Record Dossier</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8-Tab Navigation Bar */}
        <div className="flex items-center gap-1 bg-slate-100 border-b border-slate-200 p-1.5 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Profile
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Attendance
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'submissions' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Submissions
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'grades' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Grades
          </button>
          <button
            onClick={() => setActiveTab('deletions')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'deletions' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            5. Deletions
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'portfolio' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6. Portfolio
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'certificates' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7. Certificates
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'activity' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            8. Activity
          </button>
        </div>

        {/* Tab Content Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Profile (Live in Part A) */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Student Profile & Dossier</h3>
                  <p className="text-xs text-slate-500">
                    Safe institutional fields managed via SECURITY DEFINER RPC. Password credentials are never exposed or editable.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{student.roll_no}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="font-bold text-sm text-slate-900 truncate block">{student.email}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone / WhatsApp</span>
                  <span className="font-bold text-sm text-slate-900">{student.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Father Name</span>
                  <span className="font-bold text-sm text-slate-900">{student.father_name || 'N/A'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City / Campus</span>
                  <span className="font-bold text-sm text-slate-900">{student.city || 'Karachi'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Date</span>
                  <span className="font-bold text-sm text-slate-900">{formatKarachiDate(student.admission_date)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrolled Program</span>
                  <span className="font-bold text-sm text-slate-900">{student.course_title}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Batch Schedule</span>
                  <span className="font-bold text-sm text-slate-900">{student.batch}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio / Statement</span>
                <p className="text-xs text-slate-700 leading-relaxed">{student.bio || 'No statement provided.'}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Verified Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {(student.skills_list || []).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TABS 2-8: Empty State Banners explicitly indicating "Available in Part B" */}
          {activeTab !== 'profile' && (
            <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-blue-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 capitalize">
                  {activeTab} Management
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  This section is designated for Part B of the Admin Panel implementation (Submissions grading, attendance rosters, certificates registry, and deletion workflows).
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <span>Available in Part B</span>
              </span>
            </div>
          )}
        </div>

        {/* Edit Student Safe Fields Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold">Edit Student Profile</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{student.roll_no} • {student.email}</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {editError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {editError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Father Name</label>
                    <input
                      type="text"
                      value={editFather}
                      onChange={(e) => setEditFather(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enrolled Course</label>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Schedule</label>
                  <input
                    type="text"
                    value={editBatch}
                    onChange={(e) => setEditBatch(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Statement</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="Computer, Typing, Office"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {editSubmitting ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
