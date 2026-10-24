import React, { useMemo } from 'react';
import {
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile } from '../../types/academy';
import { StatusChip } from '../common/StatusChip';
import { formatKarachiDate } from '../../utils/dateUtils';

interface StudentAttendanceProps {
  student: UserProfile;
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({ student }) => {
  const records = academyStore.getAttendanceForStudent(student.id);

  // Compute stats
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const late = records.filter((r) => r.status === 'late').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const excused = records.filter((r) => r.status === 'excused').length;

    // Rate: present + (0.5 * late) / total
    const effectivePresent = present + late * 0.75;
    const percentage = total > 0 ? Math.round((effectivePresent / total) * 100) : 100;

    return { total, present, late, absent, excused, percentage };
  }, [records]);

  // Sort by date descending
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900">Academic Attendance Log</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Campus sessions and laboratory attendance for Roll No: <strong className="font-mono">{student.roll_no}</strong>
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Attendance Rate
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span
              className={`text-2xl font-black ${
                stats.percentage >= 80 ? 'text-emerald-600' : stats.percentage >= 70 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {stats.percentage}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Min 75% required</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Present
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-2">{stats.present}</div>
          <span className="text-[10px] text-emerald-600 mt-1">Sessions on time</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Late
          </span>
          <div className="text-2xl font-black text-amber-700 mt-2">{stats.late}</div>
          <span className="text-[10px] text-amber-600 mt-1">Under 20m grace</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
            Absent
          </span>
          <div className="text-2xl font-black text-rose-700 mt-2">{stats.absent}</div>
          <span className="text-[10px] text-rose-600 mt-1">Unexcused days</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
            Excused
          </span>
          <div className="text-2xl font-black text-indigo-700 mt-2">{stats.excused}</div>
          <span className="text-[10px] text-indigo-600 mt-1">Prior notice given</span>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Daily Session History ({records.length} Recorded Days)
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Asia/Karachi Timezone</span>
        </div>

        {sortedRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No attendance sessions recorded yet for your enrollment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Attendance Status</th>
                  <th className="py-3 px-6">Notes / Remarks</th>
                  <th className="py-3 px-6">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      {formatKarachiDate(r.attendance_date)}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusChip status={r.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {r.note || 'Regular campus session'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">{r.marked_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
