import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  ExternalLink,
  Lock,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Submission, SubmissionStatus } from '../../types/academy';
import { StarRating } from '../common/StarRating';
import { StatusChip } from '../common/StatusChip';
import { formatKarachiDateTime } from '../../utils/dateUtils';

interface AdminReviewQueueProps {
  submission: Submission | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminReviewQueue: React.FC<AdminReviewQueueProps> = ({
  submission,
  onClose,
  onSuccess,
}) => {
  const currentUser = academyStore.getCurrentUser();

  const [status, setStatus] = useState<SubmissionStatus>(submission?.status || 'reviewed');
  const [rating, setRating] = useState<number>(submission?.rating ?? 4.5);
  const [marks, setMarks] = useState<number>(submission && submission.marks >= 0 ? submission.marks : 85);
  const [maxMarks] = useState<number>(submission?.max_marks || 100);
  const [feedback, setFeedback] = useState<string>(submission?.feedback || '');
  const [internalNote, setInternalNote] = useState<string>(submission?.internal_note || '');
  const [saving, setSaving] = useState(false);

  if (!submission) return null;

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const reviewerName = currentUser?.full_name || 'Academic Faculty Board';

    academyStore.adminReviewSubmission(submission.id, {
      status,
      rating,
      marks: Number(marks),
      feedback,
      internal_note: internalNote,
      reviewer_name: reviewerName,
    });

    setSaving(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Evaluation & Grading Suite
            </span>
            <h3 className="text-lg font-bold">Review Deliverable: {submission.title}</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Candidate: <strong>{submission.student_name}</strong> ({submission.roll_no}) • {submission.course_title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Body: Left = Student Submission & Links, Right = Grading Controls */}
        <form onSubmit={handleSaveReview} className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Panel: Submission Deliverable Details */}
          <div className="p-6 space-y-4 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Deliverable Metadata
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={submission.status} size="sm" />
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-xs font-bold">
                  Version {submission.version}
                </span>
                <span className="text-[11px] text-slate-500">
                  {formatKarachiDateTime(submission.submitted_at)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Student Reflection ("What I Learned")
              </span>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                {submission.description}
              </div>
            </div>

            {/* Launchable Deliverable Links & Files */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Submitted Assets
              </span>
              <div className="space-y-2">
                {submission.project_url && (
                  <a
                    href={submission.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-white border border-blue-200 hover:border-blue-400 text-blue-900 flex items-center justify-between text-xs font-bold transition-all shadow-2xs"
                  >
                    <span className="truncate">{submission.project_url}</span>
                    <ExternalLink className="w-4 h-4 shrink-0 text-blue-700 ml-2" />
                  </a>
                )}
                {submission.file_name && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                    <span className="font-mono truncate">📎 {submission.file_name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">Private Storage</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Grading Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Evaluation Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="reviewed">Reviewed & Graded (Passing)</option>
                <option value="needs_revision">Needs Revision (Send back to student)</option>
                <option value="under_review">Under Review (Hold for second opinion)</option>
                <option value="rejected">Rejected (Unsatisfactory)</option>
              </select>
            </div>

            {/* Rating Stars (Supports Halves) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Star Rating (0 to 5 in 0.5 steps)
              </label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <StarRating
                  rating={rating}
                  interactive={true}
                  onChange={(val) => setRating(val)}
                  size="lg"
                />
                <span className="text-xs font-bold text-slate-700">{rating} / 5.0 Stars</span>
              </div>
            </div>

            {/* Numerical Score */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Numerical Marks (Out of {maxMarks})
              </label>
              <input
                type="number"
                min="0"
                max={maxMarks}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
              />
            </div>

            {/* Public Feedback */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Student-Facing Feedback (Public on Student Portal)
              </label>
              <textarea
                rows={3}
                placeholder="Give actionable feedback on code structure, algorithmic efficiency, UX polish, and next steps..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            {/* Private Internal Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Internal Faculty Note (Strictly Hidden from Student)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Confidential notes for faculty board only (e.g. plagiarism check, viva schedule, referral note)..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-rose-50/50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:outline-none text-slate-800"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-900/20 cursor-pointer"
              >
                {saving ? 'Recording Grade...' : 'Commit Evaluation'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
