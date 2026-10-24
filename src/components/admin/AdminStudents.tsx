import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Ban,
  UserCheck,
  UserX,
  RefreshCw,
  X,
  Loader2,
  Edit,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { UserProfile, ApprovalStatus, Course, Batch } from '../../types/academy';
import { AdminStudent360 } from './AdminStudent360';
import { formatKarachiDate } from '../../utils/dateUtils';
import { DEFAULT_COURSE_ID } from '../../config/courseCatalog';

export const AdminStudents: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Data fetching state
  const [loading, setLoading] = useState(false);
  const [studentsData, setStudentsData] = useState<UserProfile[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Selected student for 360 view
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Status Change Confirmation Modal
  const [statusModal, setStatusModal] = useState<{
    student: UserProfile;
    newStatus: ApprovalStatus;
  } | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Add New Student Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRollNo, setNewRollNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newFather, setNewFather] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Karachi');
  const [newCourseId, setNewCourseId] = useState(DEFAULT_COURSE_ID);
  const [newBatch, setNewBatch] = useState('General Batch (Morning)');
  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    adminService.getCourses().then(setCourses).catch(() => {});
    adminService.getBatches().then((b) => {
      setBatches(b);
      if (b.length > 0 && b[0]?.name) {
        setNewBatch(b[0].name);
      }
    }).catch(() => {});
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await adminService.getStudents({
        page: currentPage,
        pageSize,
        search: searchQuery,
        courseId: selectedCourse,
        batch: selectedBatch,
        status: selectedStatus,
      });
      setStudentsData(res.data);
      setTotalStudents(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setFetchError(err?.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchQuery, selectedCourse, selectedBatch, selectedStatus]);

  const handleStatusChangeConfirm = async () => {
    if (!statusModal) return;
    setStatusSubmitting(true);

    const { student, newStatus } = statusModal;
    const res = await adminService.setStudentStatus(student.id, newStatus);
    setStatusSubmitting(false);

    if (res.success) {
      setStatusModal(null);
      fetchStudents();
      showToast(`Student ${student.roll_no} status changed to ${newStatus}.`);
    } else {
      showToast(res.error || 'Failed to update student status.', true);
      setStatusModal(null);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSubmitting(true);

    const res = await adminService.createStudent({
      full_name: newName,
      father_name: newFather,
      email: newEmail,
      phone: newPhone,
      city: newCity,
      roll_no: newRollNo,
      course_id: newCourseId,
      batch: newBatch,
    });

    setAddSubmitting(false);

    if (res.success) {
      setIsAddModalOpen(false);
      setNewName('');
      setNewFather('');
      setNewEmail('');
      setNewRollNo('');
      setNewPhone('');
      fetchStudents();
      showToast(`Student profile ${newRollNo} successfully created.`);
    } else {
      setAddError(res.error || 'Failed to create student profile.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-900" />
            <span>Student Institutional Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search candidates, manage approvals, update verified dossiers, and review academic statuses.
          </p>
        </div>

        <button
          onClick={() => {
            setAddError(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-56 px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
          >
            <option value="all">All Academic Programs</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Batch filter */}
          <select
            value={selectedBatch}
            onChange={(e) => {
              setSelectedBatch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-48 px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-40 px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Directory Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Enrolled Candidates ({totalStudents})
          </span>
          <span className="text-[11px] text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading candidate records from database...</p>
          </div>
        ) : fetchError ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 font-semibold">{fetchError}</p>
            <button
              onClick={fetchStudents}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : studentsData.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No student records found</p>
            <p className="text-slate-400">Try adjusting your search criteria or add a new candidate.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards (<640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {studentsData.map((stu) => (
                <div key={stu.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {stu.avatar_url ? (
                          <img src={stu.avatar_url} alt={stu.full_name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          stu.full_name.charAt(0) || 'S'
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{stu.full_name}</div>
                        <div className="font-mono text-xs text-blue-700 font-bold">{stu.roll_no}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        stu.approval_status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : stu.approval_status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {stu.approval_status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5">
                    <div><strong>Program:</strong> {stu.course_title}</div>
                    <div><strong>Batch:</strong> {stu.batch}</div>
                    <div className="font-mono text-[11px] text-slate-400">{stu.email}</div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedStudentId(stu.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
                    </button>

                    {stu.approval_status !== 'approved' && (
                      <button
                        onClick={() => setStatusModal({ student: stu, newStatus: 'approved' })}
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Approve
                      </button>
                    )}

                    {stu.approval_status === 'approved' && (
                      <button
                        onClick={() => setStatusModal({ student: stu, newStatus: 'blocked' })}
                        className="py-1.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                      >
                        Block
                      </button>
                    )}

                    {stu.approval_status === 'blocked' && (
                      <button
                        onClick={() => setStatusModal({ student: stu, newStatus: 'approved' })}
                        className="py-1.5 px-3 rounded-xl bg-blue-900 text-white font-bold text-xs"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table (>=640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Student Dossier</th>
                    <th className="py-3.5 px-6">Roll Number</th>
                    <th className="py-3.5 px-6">Enrolled Program</th>
                    <th className="py-3.5 px-6">Batch Schedule</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsData.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                            {stu.avatar_url ? (
                              <img src={stu.avatar_url} alt={stu.full_name} className="w-full h-full object-cover" />
                            ) : (
                              stu.full_name.charAt(0) || 'S'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{stu.full_name}</div>
                            <div className="font-mono text-[11px] text-slate-400">{stu.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-800">{stu.roll_no}</td>
                      <td className="py-3.5 px-6 font-medium text-slate-800">{stu.course_title}</td>
                      <td className="py-3.5 px-6 text-slate-600 font-medium">{stu.batch}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            stu.approval_status === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : stu.approval_status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {stu.approval_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-sans">
                        {formatKarachiDate(stu.admission_date || stu.created_at)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentId(stu.id)}
                            title="Open comprehensive 360° student record"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {stu.approval_status === 'pending' && (
                            <>
                              <button
                                onClick={() => setStatusModal({ student: stu, newStatus: 'approved' })}
                                title="Approve candidate"
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setStatusModal({ student: stu, newStatus: 'rejected' })}
                                title="Reject candidate"
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 text-[11px] font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {stu.approval_status === 'approved' && (
                            <button
                              onClick={() => setStatusModal({ student: stu, newStatus: 'blocked' })}
                              title="Block student"
                              className="px-2 py-1 rounded-lg border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-[11px] font-bold cursor-pointer"
                            >
                              Block
                            </button>
                          )}

                          {(stu.approval_status === 'blocked' || stu.approval_status === 'rejected') && (
                            <button
                              onClick={() => setStatusModal({ student: stu, newStatus: 'approved' })}
                              title="Reactivate student"
                              className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-[11px] font-bold cursor-pointer"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (A2) */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Showing {studentsData.length} of {totalStudents} candidate records
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-blue-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal for Destructive/Status Actions (UI Quality requirement) */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                statusModal.newStatus === 'blocked' || statusModal.newStatus === 'rejected'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Status Change: {statusModal.newStatus.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to change student{' '}
                <strong className="text-slate-900">{statusModal.student.full_name}</strong> (Roll No:{' '}
                <span className="font-mono text-blue-900 font-bold">{statusModal.student.roll_no}</span>) to{' '}
                <strong className="text-slate-900 uppercase">{statusModal.newStatus}</strong>?
                {statusModal.newStatus === 'blocked' && (
                  <span className="block mt-1 text-rose-600 font-medium">
                    This will immediately deactivate their login and submission access. Auth account is preserved.
                  </span>
                )}
                {statusModal.newStatus === 'approved' && (
                  <span className="block mt-1 text-emerald-600 font-medium">
                    This will grant active access to the student portal and workspace.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChangeConfirm}
                disabled={statusSubmitting}
                className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm ${
                  statusModal.newStatus === 'blocked' || statusModal.newStatus === 'rejected'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                {statusSubmitting ? 'Processing...' : `Confirm ${statusModal.newStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold">Register New Student</h3>
                <p className="text-xs text-slate-400 mt-0.5">Enrolls student with institutional roll number validation</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {addError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Muhammad Bilal"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father Name</label>
                  <input
                    type="text"
                    placeholder="Muhammad Tariq"
                    value={newFather}
                    onChange={(e) => setNewFather(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll No *</label>
                  <input
                    type="text"
                    required
                    placeholder="IBA-2026-005"
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="bilal@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Specialization *</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Batch Schedule</label>
                <input
                  type="text"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {addSubmitting ? 'Enrolling...' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 360° Record Dossier Modal */}
      {selectedStudentId && (
        <AdminStudent360
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
          onStudentUpdated={fetchStudents}
        />
      )}
    </div>
  );
};
