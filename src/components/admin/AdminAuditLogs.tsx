import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Clock,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Eye,
  X,
  FileCode,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedAction, setSelectedAction] = useState('all');
  const [actorSearch, setActorSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Metadata inspector modal
  const [inspectingLog, setInspectingLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({
        page: currentPage,
        pageSize: 12,
        action: selectedAction,
        actorEmail: actorSearch,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, selectedAction, actorSearch, startDate, endDate]);

  const uniqueActions = [
    'ALL',
    'USER_LOGIN',
    'SET_STUDENT_STATUS',
    'UPDATE_STUDENT_PROFILE',
    'STUDENT_REGISTER',
    'UPSERT_COURSE',
    'SET_COURSE_ACTIVE',
    'UPSERT_BATCH',
    'TOGGLE_BATCH_ACTIVE',
    'UPDATE_SETTING',
    'ADD_ADMIN',
    'REMOVE_ADMIN',
    'UPDATE_ADMIN_ROLE',
    'SUBMISSION_REVIEWED',
    'DELETION_APPROVED_ARCHIVED',
    'DELETION_REJECTED',
    'CERTIFICATE_ISSUED',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-blue-900" />
          <span>Institutional Audit Trail & Governance</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable system events tracking administrative grading, student onboarding, privilege changes, and settings mutations.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Event Action
            </label>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
            >
              <option value="all">All Action Types</option>
              {uniqueActions.filter((a) => a !== 'ALL').map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Actor email filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Actor Email
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by actor email..."
                value={actorSearch}
                onChange={(e) => {
                  setActorSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Audit Logs Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Recorded Events ({total})
          </span>
          <span className="text-[11px] text-slate-400">
            Timestamps rendered in Asia/Karachi (PKT, UTC+5)
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading immutable audit stream...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No audit events found</p>
            <p className="text-slate-400">No events matched the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (<640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-100">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatKarachiDateTime(log.timestamp || log.created_at || '')}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-800">
                    {log.target_resource || log.target_type || 'System Resource'}
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono break-all">
                    By: {log.actor_email}
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <button
                      onClick={() => setInspectingLog(log)}
                      className="text-[11px] text-blue-900 font-bold hover:underline"
                    >
                      Inspect Details →
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table (>=640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6">Timestamp (Asia/Karachi)</th>
                    <th className="py-3.5 px-6">Action Identifier</th>
                    <th className="py-3.5 px-6">Actor Identity</th>
                    <th className="py-3.5 px-6">Target Resource</th>
                    <th className="py-3.5 px-6">Payload Metadata</th>
                    <th className="py-3.5 px-6 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 text-slate-500 font-sans text-[11px] whitespace-nowrap">
                        {formatKarachiDateTime(log.timestamp || log.created_at || '')}
                      </td>
                      <td className="py-3.5 px-6 font-bold">
                        <span className="bg-blue-50 text-blue-900 font-mono text-[10px] px-2.5 py-1 rounded-md border border-blue-100">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-700">{log.actor_email}</td>
                      <td className="py-3.5 px-6 text-slate-800 font-medium">{log.target_resource || log.target_type || '—'}</td>
                      <td className="py-3.5 px-6 text-[10px] text-slate-400 font-mono truncate max-w-xs">
                        {log.metadata ? JSON.stringify(log.metadata) : '—'}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => setInspectingLog(log)}
                          title="Inspect raw event JSON"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Showing {logs.length} of {total} audit records
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

      {/* Inspect Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>Audit Event Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{inspectingLog.id}</p>
              </div>
              <button onClick={() => setInspectingLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Action</span>
                  <span className="font-bold text-blue-900">{inspectingLog.action}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Timestamp</span>
                  <span className="text-slate-700">{formatKarachiDateTime(inspectingLog.timestamp || inspectingLog.created_at || '')}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Actor Email</span>
                  <span className="font-mono text-slate-700 break-all">{inspectingLog.actor_email}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Resource</span>
                  <span className="text-slate-700">{inspectingLog.target_resource || inspectingLog.target_type || '—'}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 block uppercase text-[10px] mb-1">
                  Metadata JSON Payload
                </span>
                <pre className="p-4 rounded-2xl bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto max-h-56">
                  {JSON.stringify(inspectingLog.metadata || {}, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectingLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
