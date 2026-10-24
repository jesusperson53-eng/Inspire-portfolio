import React, { useState } from 'react';
import {
  Trash2,
  Archive,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { DeleteRequest, Submission } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';

export const AdminDeletionManager: React.FC = () => {
  const deleteRequests = academyStore.getDeleteRequests();
  const archivedSubmissions = academyStore.getArchivedSubmissions();

  const [activeTab, setActiveTab] = useState<'requests' | 'archive'>('requests');
  const [adminNote, setAdminNote] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const pendingRequests = deleteRequests.filter((r) => r.status === 'pending');

  const handleApprove = (reqId: string) => {
    academyStore.adminApproveDeletion(reqId, adminNote || 'Approved by faculty administration');
    setAdminNote('');
    setSelectedRequestId(null);
  };

  const handleReject = (reqId: string) => {
    if (!adminNote.trim()) {
      alert('Please enter a note explaining to the student why the deletion request was rejected.');
      return;
    }
    academyStore.adminRejectDeletion(reqId, adminNote);
    setAdminNote('');
    setSelectedRequestId(null);
  };

  const handleRestore = (subId: string) => {
    if (confirm('Restore this submission to the student active roster? Note: It will not be republished to the public showcase automatically.')) {
      academyStore.adminRestoreSubmission(subId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900">Deletion Requests & Archival Vault</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Review student removal requests under academic retention guidelines. Approved items are safely archived without file destruction.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Pending Removal Requests</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'archive' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived Deliverables ({archivedSubmissions.length})</span>
        </button>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs text-slate-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">Queue Clear</p>
              <p className="text-slate-400 mt-0.5">No student deletion requests are currently pending review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] uppercase">
                          Removal Request
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{req.submission_title}</h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Candidate: <strong>{req.student_name}</strong> ({req.roll_no}) • Requested on:{' '}
                        {formatKarachiDateTime(req.requested_at)}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong className="block text-slate-900 mb-0.5">Student's Stated Reason:</strong>
                    <p className="italic">"{req.reason}"</p>
                  </div>

                  {/* Admin Note Input */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Faculty Resolution Note
                    </label>
                    <input
                      type="text"
                      placeholder="Note to student (e.g. Approved and archived per curriculum protocol)..."
                      value={selectedRequestId === req.id ? adminNote : ''}
                      onChange={(e) => {
                        setSelectedRequestId(req.id);
                        setAdminNote(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Decline Request
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      Approve & Move to Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Archived Vault Tab */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Academic Archival Policy (TRD §5.6):</span>
              <p className="mt-0.5">
                Archived deliverables are hidden from student rosters and public showcases, but their binary assets and version logs are preserved permanently for institutional audits. Faculty administrators can restore any submission at any time.
              </p>
            </div>
          </div>

          {archivedSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-xs text-slate-500 text-xs">
              No deliverables currently archived.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-5">Deliverable Title</th>
                    <th className="py-3 px-5">Student / Roll</th>
                    <th className="py-3 px-5">Archived On</th>
                    <th className="py-3 px-5">Previous Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {archivedSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {sub.title}
                        <span className="block text-[10px] text-slate-400 font-normal">v{sub.version}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-800">{sub.student_name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{sub.roll_no}</div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {sub.archived_at ? formatKarachiDateTime(sub.archived_at) : 'Archived'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                          {sub.status_before_archive || 'submitted'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleRestore(sub.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
