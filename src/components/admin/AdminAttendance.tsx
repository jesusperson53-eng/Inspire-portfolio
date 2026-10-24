import React, { useState } from 'react';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  Download,
  Calendar,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile, AttendanceStatus } from '../../types/academy';
import { getKarachiTodayString, formatKarachiDate } from '../../utils/dateUtils';

export const AdminAttendance: React.FC = () => {
  const students = academyStore.getAllStudents();
  const courses = academyStore.getCourses();
  const batches = academyStore.getBatches();

  const [selectedDate, setSelectedDate] = useState<string>(getKarachiTodayString());
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  const filteredStudents = students.filter((s) => {
    if (selectedCourseId !== 'all' && s.course_id !== selectedCourseId) return false;
    if (selectedBatch !== 'all' && s.batch !== selectedBatch) return false;
    return true;
  });

  const attendanceList = academyStore.getAttendance();

  const getStudentStatusForDate = (studentId: string): AttendanceStatus | null => {
    const record = attendanceList.find(
      (a) => a.student_id === studentId && a.attendance_date === selectedDate
    );
    return record ? record.status : null;
  };

  const handleMarkStatus = (student: UserProfile, status: AttendanceStatus) => {
    academyStore.adminMarkAttendance({
      student_id: student.id,
      course_id: student.course_id,
      batch_id: student.batch,
      attendance_date: selectedDate,
      status,
    });
  };

  const handleMarkAllPresent = () => {
    academyStore.adminMarkAllPresent(
      selectedCourseId === 'all' ? '' : selectedCourseId,
      selectedBatch === 'all' ? '' : selectedBatch,
      selectedDate
    );
  };

  const handleExportCSV = () => {
    const csvContent = academyStore.exportAttendanceCSV(
      selectedCourseId === 'all' ? undefined : selectedCourseId,
      selectedBatch === 'all' ? undefined : selectedBatch
    );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Inspire_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Institutional Attendance Roster</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log physical laboratory & lecture attendance across batches with official export capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Session Date (Karachi Time)
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Course Filter
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
          >
            <option value="all">All Academic Programs</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Batch Schedule Filter
          </label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
          >
            <option value="all">All Active Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Student Roster ({filteredStudents.length} Students) — {formatKarachiDate(selectedDate)}
          </span>
          <span className="text-[11px] text-slate-400">Click a state to record</span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No students found matching your active filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Student Information</th>
                  <th className="py-3 px-6">Course & Batch</th>
                  <th className="py-3 px-6 text-center">4-State Attendance Selector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu) => {
                  const currentStatus = getStudentStatusForDate(stu.id);

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-slate-900">{stu.full_name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{stu.roll_no} • {stu.email}</div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-800">{stu.course_title}</div>
                        <div className="text-[10px] text-slate-500">{stu.batch}</div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(stu, 'present')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(stu, 'late')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              currentStatus === 'late'
                                ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-400'
                                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            }`}
                          >
                            Late
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(stu, 'absent')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                            }`}
                          >
                            Absent
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMarkStatus(stu, 'excused')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              currentStatus === 'excused'
                                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                            }`}
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
