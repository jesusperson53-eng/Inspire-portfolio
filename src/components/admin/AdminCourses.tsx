import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Search,
  Power,
  Edit3,
  Save,
  X,
  Layers,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Course, Batch } from '../../types/academy';

export const AdminCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'batches'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Course Edit Modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Course Toggle Active Modal
  const [toggleCourseModal, setToggleCourseModal] = useState<{ course: Course; nextStatus: boolean } | null>(null);

  // Batch Create / Edit Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchId, setBatchId] = useState('');
  const [batchName, setBatchName] = useState('');
  const [batchCourseId, setBatchCourseId] = useState('');
  const [batchStartDate, setBatchStartDate] = useState('2026-03-01');
  const [batchTiming, setBatchTiming] = useState('10:00 AM - 12:00 PM');
  const [batchActive, setBatchActive] = useState(true);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshData = async () => {
    try {
      const [c, b] = await Promise.all([
        adminService.getCourses(),
        adminService.getBatches(),
      ]);
      setCourses(c);
      setBatches(b);
    } catch (e) {
      console.error('Failed to load courses/batches from Supabase:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleConfirmCourseToggle = async () => {
    if (!toggleCourseModal) return;
    const { course, nextStatus } = toggleCourseModal;
    const res = await adminService.setCourseActive(course.id, nextStatus);
    setToggleCourseModal(null);

    if (res.success) {
      refreshData();
      showToast(
        nextStatus
          ? `Course "${course.title}" activated in public catalog.`
          : `Course "${course.title}" deactivated. Existing student records remain preserved.`
      );
    } else {
      showToast(res.error || 'Failed to toggle course status.', true);
    }
  };

  const handleStartEdit = (course: Course) => {
    setEditingCourse(course);
    setEditDesc(course.description || '');
    setEditDuration(course.duration || '');
    setEditCategory(course.category || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const updated: Course = {
      ...editingCourse,
      description: editDesc,
      duration: editDuration,
      category: editCategory,
    };

    const res = await adminService.upsertCourse(updated);
    if (res.success) {
      setEditingCourse(null);
      refreshData();
      showToast(`Course details updated for "${updated.title}".`);
    } else {
      showToast(res.error || 'Failed to update course.', true);
    }
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBatchData: Batch = {
      id: batchId || `batch-${Date.now()}`,
      name: batchName,
      course_id: batchCourseId || courses[0]?.id || 'computer-course',
      start_date: batchStartDate,
      timing: batchTiming,
      is_active: batchActive,
    };

    const res = await adminService.upsertBatch(newBatchData);
    if (res.success) {
      setIsBatchModalOpen(false);
      setBatchId('');
      setBatchName('');
      refreshData();
      showToast(`Batch "${newBatchData.name}" saved successfully.`);
    } else {
      showToast(res.error || 'Failed to save batch.', true);
    }
  };

  const handleToggleBatch = async (b: Batch) => {
    const res = await adminService.upsertBatch({ ...b, is_active: !b.is_active });
    if (res.success) {
      await refreshData();
      showToast(`Batch "${b.name}" ${!b.is_active ? 'activated' : 'deactivated'}.`);
    } else {
      showToast(res.error || 'Failed to update batch status.', true);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBatches = batches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.timing.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCoursesCount = courses.filter((c) => c.is_active).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-lg animate-in fade-in ${
            toast.isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.isError ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-900" />
            <span>Curriculum & Batches Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the 10 official vocational courses, toggle active availability, and schedule training batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'batches' && (
            <button
              onClick={() => {
                setBatchId('');
                setBatchName('');
                setBatchCourseId(courses[0]?.id || '');
                setIsBatchModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Batch</span>
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold border border-blue-100">
            <span>{activeCoursesCount} of {courses.length} Courses Active</span>
          </span>
        </div>
      </div>

      {/* Tabs Switcher: Courses vs Batches */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => {
            setActiveTab('courses');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'courses' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Official Courses ({courses.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('batches');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'batches' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scheduled Batches ({batches.length})
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder={activeTab === 'courses' ? 'Search by course title, code, or slug...' : 'Search by batch name, timing...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl shadow-2xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* SECTION 1: COURSES VIEW */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          {/* Mobile Cards (<640px) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filteredCourses.map((course, idx) => (
              <div key={course.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">#{idx + 1} • {course.code}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      course.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {course.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  <span className="font-mono text-[11px] block">{course.id}</span>
                  {course.category && <span className="text-[11px] text-blue-600 font-semibold block">{course.category}</span>}
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => handleStartEdit(course)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setToggleCourseModal({ course, nextStatus: !course.is_active })}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                      course.is_active
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {course.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>=640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">Course Title</th>
                  <th className="py-3.5 px-6">Slug (ID)</th>
                  <th className="py-3.5 px-6">Course Code</th>
                  <th className="py-3.5 px-6 text-center">Catalog Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      No courses found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, idx) => (
                    <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-900 shrink-0" />
                          <span>{course.title}</span>
                        </div>
                        {course.category && (
                          <span className="text-[10px] text-blue-600 font-semibold uppercase block ml-6">
                            {course.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-[11px] text-slate-600">{course.id}</td>
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-700">{course.code}</td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            course.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {course.is_active ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(course)}
                            title="Edit course details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setToggleCourseModal({ course, nextStatus: !course.is_active })}
                            title={course.is_active ? 'Deactivate course' : 'Activate course'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              course.is_active
                                ? 'text-emerald-700 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: BATCHES VIEW */}
      {activeTab === 'batches' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Batch Identifier</th>
                  <th className="py-3.5 px-6">Batch Name</th>
                  <th className="py-3.5 px-6">Linked Course</th>
                  <th className="py-3.5 px-6">Start Date</th>
                  <th className="py-3.5 px-6">Timing / Schedule</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No batches scheduled.
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    const linkedCourse = courses.find((c) => c.id === batch.course_id);
                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-slate-500 font-bold">{batch.id}</td>
                        <td className="py-3.5 px-6 font-bold text-slate-900">{batch.name}</td>
                        <td className="py-3.5 px-6 text-blue-900 font-semibold">
                          {linkedCourse ? linkedCourse.title : batch.course_id}
                        </td>
                        <td className="py-3.5 px-6 text-slate-600">{batch.start_date}</td>
                        <td className="py-3.5 px-6 text-slate-600">{batch.timing}</td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              batch.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {batch.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setBatchId(batch.id);
                                setBatchName(batch.name);
                                setBatchCourseId(batch.course_id);
                                setBatchStartDate(batch.start_date);
                                setBatchTiming(batch.timing);
                                setBatchActive(batch.is_active);
                                setIsBatchModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-100"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleBatch(batch)}
                              className={`p-1.5 rounded-lg ${
                                batch.is_active
                                  ? 'text-emerald-700 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Course Deactivation (Shared Rules: Never delete referenced courses) */}
      {toggleCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                toggleCourseModal.nextStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                {toggleCourseModal.nextStatus ? 'Activate Course in Catalog?' : 'Deactivate Vocational Course?'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {toggleCourseModal.nextStatus ? (
                  <>
                    Course <strong>{toggleCourseModal.course.title}</strong> will be activated and immediately visible to prospective students on the public course catalog.
                  </>
                ) : (
                  <>
                    Deactivating <strong>{toggleCourseModal.course.title}</strong> will hide it from new registrations and public showcase. Per institutional retention rules, <strong>all existing student submissions, certificates, and grades are permanently preserved</strong> and never deleted.
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setToggleCourseModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCourseToggle}
                className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm ${
                  toggleCourseModal.nextStatus ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {toggleCourseModal.nextStatus ? 'Yes, Activate' : 'Yes, Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">{editingCourse.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingCourse.code} • {editingCourse.id}</p>
              </div>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Category</label>
                <input
                  type="text"
                  placeholder="Vocational & Technical"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration / Commitment</label>
                <input
                  type="text"
                  placeholder="2 Months (48 Contact Hours)"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Description & Learning Outcomes</label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Create / Edit Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">{batchId ? 'Edit Training Batch' : 'Create Training Batch'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Schedule cohort timing and link to course</p>
              </div>
              <button onClick={() => setIsBatchModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Weekend Evening Cohort"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Course *</label>
                <select
                  value={batchCourseId}
                  onChange={(e) => setBatchCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={batchStartDate}
                    onChange={(e) => setBatchStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Timings</label>
                  <input
                    type="text"
                    value={batchTiming}
                    onChange={(e) => setBatchTiming(e.target.value)}
                    placeholder="06:00 PM - 08:00 PM"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
