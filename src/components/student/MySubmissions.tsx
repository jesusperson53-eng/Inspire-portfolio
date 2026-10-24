import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ExternalLink,
  History,
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Submission, UserProfile } from '../../types/academy';
import { StatusChip } from '../common/StatusChip';
import { StarRating } from '../common/StarRating';
import { formatKarachiDateTime } from '../../utils/dateUtils';

interface MySubmissionsProps {
  student: UserProfile;
  onOpenSubmitNew: () => void;
}

export const MySubmissions: React.FC<MySubmissionsProps> = ({
  student,
  onOpenSubmitNew,
}) => {
  const submissions = academyStore.getSubmissionsForStudent(student.id);

  const [filterTab, setFilterTab] = useState<'all' | 'needs_revision' | 'reviewed' | 'pending'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Resubmit modal state
  const [resubmittingSub, setResubmittingSub] = useState<Submission | null>(null);
  const [resubmitUrl, setResubmitUrl] = useState('');
  const [resubmitDesc, setResubmitDesc] = useState('');
  const [resubmitError, setResubmitError] = useState<string | null>(null);

  // Deletion request modal state
  const [deletingSub, setDeletingSub] = useState<Submission | null>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filterTab === 'needs_revision') return s.status === 'needs_revision';
    if (filterTab === 'reviewed') return s.status === 'reviewed';
    if (filterTab === 'pending') return s.status === 'submitted' || s.status === 'under_review';
    return true;
  });

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmittingSub) return;
    setResubmitError(null);

    if (!resubmitDesc.trim()) {
      setResubmitError('Please explain what revisions and improvements you made in this new version.');
      return;
    }

    const res = academyStore.resubmitWork(resubmittingSub.id, {
      description: resubmitDesc,
      project_url: resubmitUrl || resubmittingSub.project_url,
    });

    if (res.success) {
      setResubmittingSub(null);
      setResubmitDesc('');
      setResubmitUrl('');
    } else {
      setResubmitError(res.error || 'Failed to submit revised version.');
    }
  };

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingSub) return;
    setDeleteError(null);

    if (!deletionReason.trim() || deletionReason.trim().length < 8) {
      setDeleteError('Please provide a specific justification of at least 8 characters.');
      return;
    }

    const res = academyStore.requestDeletion(deletingSub.id, deletionReason);
    if (res.success) {
      setDeletingSub(null);
      setDeletionReason('');
      alert('Deletion request submitted to faculty administration for review.');
    } else {
      setDeleteError(res.error || 'Failed to submit deletion request.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Submitted Deliverables</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Track evaluation metrics, faculty annotations, and version increments.
          </p>
        </div>

        <button
          onClick={onOpenSubmitNew}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          + Submit New Work
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({submissions.length})
        </button>
        <button
          onClick={() => setFilterTab('needs_revision')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'needs_revision'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-orange-700 hover:bg-orange-50'
          }`}
        >
          <span>Needs Changes</span>
          {submissions.filter((s) => s.status === 'needs_revision').length > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-orange-700 flex items-center justify-center text-[10px] font-bold">
              {submissions.filter((s) => s.status === 'needs_revision').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilterTab('reviewed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'reviewed'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          Reviewed ({submissions.filter((s) => s.status === 'reviewed').length})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'pending'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-blue-700 hover:bg-blue-50'
          }`}
        >
          Pending Review (
          {submissions.filter((s) => s.status === 'submitted' || s.status === 'under_review').length}
          )
        </button>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 text-slate-600 text-xs max-w-md mx-auto space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">No submissions yet. Submit your first assignment.</h4>
          <p className="text-[11px] text-slate-500">
            Upload your assignments, project repositories, or case studies for faculty review and evaluation.
          </p>
          <button
            onClick={onOpenSubmitNew}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
          >
            Submit Assignment
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
          No submissions found under this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub.id;

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Top Bar: Badges + Karachi timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <StatusChip status={sub.status} />
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                        v{sub.version}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                        {sub.submission_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatKarachiDateTime(sub.submitted_at)}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-extrabold text-slate-900">{sub.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {sub.description}
                  </p>

                  {/* Score & Evaluation Bar (if graded) */}
                  {sub.status === 'reviewed' && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StarRating rating={sub.rating} size="sm" />
                          <span className="text-xs font-bold text-slate-900">
                            Score: {sub.marks >= 0 ? `${sub.marks}/${sub.max_marks}` : 'Evaluated'}
                          </span>
                        </div>
                        {sub.reviewed_by && (
                          <span className="text-[11px] text-slate-500 font-semibold">
                            Reviewed by: <strong>{sub.reviewed_by}</strong>
                          </span>
                        )}
                      </div>

                      {/* Progress bar visual */}
                      {sub.marks >= 0 && (
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.marks >= 80 ? 'bg-emerald-500' : sub.marks >= 60 ? 'bg-amber-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(100, (sub.marks / sub.max_marks) * 100)}%` }}
                          ></div>
                        </div>
                      )}

                      {/* Teacher Feedback Text */}
                      {sub.feedback && (
                        <div className="pt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/60">
                          <span className="font-bold text-blue-900 block mb-0.5">Faculty Feedback:</span>
                          <p className="italic text-slate-600">{sub.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If needs revision notice */}
                  {sub.status === 'needs_revision' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Revision Required:</span>
                        <p className="mt-0.5">{sub.feedback || 'Please review assignment criteria and submit an updated version.'}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {sub.project_url && (
                        <a
                          href={sub.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-50 border border-blue-100"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Repository / Link</span>
                        </a>
                      )}
                      {sub.file_name && (
                        <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md">
                          📎 {sub.file_name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Resubmit button: Active ONLY when needs_revision per FR-STU-5 */}
                      {sub.status === 'needs_revision' && (
                        <button
                          onClick={() => {
                            setResubmittingSub(sub);
                            setResubmitUrl(sub.project_url || '');
                            setResubmitDesc('');
                          }}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Resubmit (v{sub.version + 1})</span>
                        </button>
                      )}

                      {/* Request deletion button per FR-STU-9 */}
                      <button
                        onClick={() => {
                          setDeletingSub(sub);
                          setDeletionReason('');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Request Deletion from Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Expand / Collapse version history */}
                      {sub.versions_history.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>History ({sub.versions_history.length})</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Version History */}
                {isExpanded && sub.versions_history.length > 0 && (
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Previous Version Snapshots (Immutable Record):
                    </span>
                    {sub.versions_history.map((ver) => (
                      <div
                        key={ver.id}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                              Version {ver.version_number}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {formatKarachiDateTime(ver.submitted_at)}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs mt-1">{ver.description}</p>
                        </div>
                        {ver.project_url && (
                          <a
                            href={ver.project_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-blue-700 hover:underline shrink-0"
                          >
                            Snapshot URL
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resubmit Modal */}
      {resubmittingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
              <h3 className="text-lg font-bold">Resubmit Assignment (v{resubmittingSub.version + 1})</h3>
              <p className="text-xs text-orange-100 mt-0.5">
                Target: {resubmittingSub.title}
              </p>
            </div>

            <form onSubmit={handleResubmit} className="p-6 space-y-4">
              {resubmitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {resubmitError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Updated Repository / Demo URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={resubmitUrl}
                  onChange={(e) => setResubmitUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Revision Summary (What was improved based on feedback) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the code fixes, design updates, or adjustments made..."
                  value={resubmitDesc}
                  onChange={(e) => setResubmitDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmittingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Submit Version {resubmittingSub.version + 1}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deletion Request Modal */}
      {deletingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-700 to-red-800 p-6 text-white">
              <h3 className="text-lg font-bold">Request Deliverable Removal</h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Target: {deletingSub.title}
              </p>
            </div>

            <form onSubmit={handleDeleteRequest} className="p-6 space-y-4">
              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {deleteError}
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">
                Under Inspire Business Academy academic integrity guidelines, deliverables cannot be directly deleted by students. Submitting this request notifies the faculty board. If approved, the deliverable will be logically archived.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Deletion Request *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why this deliverable needs removal (e.g. accidentally uploaded wrong file, superseded project)..."
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Submit Deletion Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
