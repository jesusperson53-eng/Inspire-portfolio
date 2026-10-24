import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Archive,
  UserCheck,
  UserX,
  CalendarCheck,
} from 'lucide-react';

interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  switch (norm) {
    case 'submitted':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-700/10 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Submitted</span>
        </span>
      );

    case 'under_review':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-700/15 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Under Review</span>
        </span>
      );

    case 'reviewed':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reviewed & Graded</span>
        </span>
      );

    case 'needs_revision':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-orange-50 text-orange-800 ring-1 ring-orange-600/20 ${sizeClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          <span>Needs Revision</span>
        </span>
      );

    case 'rejected':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );

    case 'archived':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-slate-100 text-slate-700 ring-1 ring-slate-400/20 ${sizeClasses}`}
        >
          <Archive className="w-3.5 h-3.5 text-slate-500" />
          <span>Archived</span>
        </span>
      );

    // Attendance statuses
    case 'present':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Present</span>
        </span>
      );

    case 'late':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Late</span>
        </span>
      );

    case 'absent':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 ${sizeClasses}`}
        >
          <UserX className="w-3.5 h-3.5 text-rose-600" />
          <span>Absent</span>
        </span>
      );

    case 'excused':
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20 ${sizeClasses}`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Excused</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded-lg bg-slate-100 text-slate-700 ${sizeClasses}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
