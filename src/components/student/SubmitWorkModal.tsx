import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile, SubmissionType } from '../../types/academy';
import { getKarachiTodayString, formatKarachiDate } from '../../utils/dateUtils';
import { DEFAULT_COURSE_ID } from '../../config/courseCatalog';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UserProfile;
  onSuccess: () => void;
}

export const SubmitWorkModal: React.FC<SubmitWorkModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  const courses = academyStore.getCourses();

  const [courseId, setCourseId] = useState(student.course_id || DEFAULT_COURSE_ID);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('project');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'link' | 'file'>('link');
  const [projectUrl, setProjectUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 26214400) {
        setError('File exceeds 25 MB maximum upload limit.');
        return;
      }
      setFileName(file.name);
      setFileSize(file.size);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for your work.');
      return;
    }

    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a detailed description (at least 20 characters) explaining what you learned.');
      return;
    }

    if (mode === 'link' && !projectUrl.trim()) {
      setError('Please provide a valid project repository or deployment URL.');
      return;
    }

    if (mode === 'file' && !fileName) {
      setError('Please select a file to upload.');
      return;
    }

    setSubmitting(true);
    const res = academyStore.submitWork({
      student_id: student.id,
      course_id: courseId,
      submission_type: submissionType,
      title,
      description,
      project_url: mode === 'link' ? projectUrl : undefined,
      file_name: mode === 'file' ? fileName : undefined,
      file_size: mode === 'file' ? fileSize : undefined,
    });
    setSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Submission failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Submit Assignment / Capstone</h3>
            <p className="text-xs text-blue-200">
              Submit your work for faculty review and evaluation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-blue-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Course *</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Classification *</label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="project">Capstone Project</option>
                <option value="assignment">Weekly Assignment</option>
                <option value="case_study">Industry Case Study</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Submission Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Task Queue with Redis and Node.js"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          {/* Segmented Mode Control: Link vs File */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Deliverable Type</label>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('link')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'link' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web / Git URL</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('file')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'file' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Document / Archive</span>
              </button>
            </div>
          </div>

          {mode === 'link' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Repository / Demo Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/your-username/project-repo"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Accepts GitHub, Figma, Google Drive, Vercel, or live website URLs.
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attachment (Max 25 MB) *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50 hover:bg-blue-50/50 transition-colors">
                <input
                  type="file"
                  id="submission-file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="submission-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-8 h-8 text-blue-700" />
                  <span className="text-xs font-bold text-slate-800">
                    {fileName ? fileName : 'Click to select project file'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    PDF, ZIP, DOCX, RAR, PNG, MP4 up to 25MB
                  </span>
                </label>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                What I Learned & Key Technical Challenges *
              </label>
              <span className="text-[10px] text-slate-400">{description.length}/1000</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1000}
              placeholder="Explain the architectural decisions, tools utilized, errors debugged, and practical competencies demonstrated in this submission..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-800" />
              Submission Date: <strong>{formatKarachiDate(getKarachiTodayString())}</strong>
            </span>
            <span className="text-slate-400 font-mono">Roll: {student.roll_no}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? 'Transmitting Deliverable...' : 'Submit to Faculty Queue'}
          </button>
        </form>
      </div>
    </div>
  );
};
