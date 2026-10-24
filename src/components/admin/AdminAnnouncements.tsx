import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Trash2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { Announcement, TargetAudience, AnnouncementPriority } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';
import { DEFAULT_COURSE_ID } from '../../config/courseCatalog';

export const AdminAnnouncements: React.FC = () => {
  const announcements = academyStore.getAnnouncements();
  const courses = academyStore.getCourses();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('all');
  const [targetCourse, setTargetCourse] = useState(DEFAULT_COURSE_ID);
  const [priority, setPriority] = useState<AnnouncementPriority>('normal');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    academyStore.createAnnouncement({
      title,
      message,
      target_audience: targetAudience,
      target_course: targetAudience === 'course' ? targetCourse : undefined,
      priority,
    });

    setIsCreating(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Institutional Announcements</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast targeted notices to all students or specific course cohorts.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Announcement</span>
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-900">Compose Notice</h4>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule for Final Capstone Live Presentations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="all">All Enrolled Academy Students</option>
                <option value="course">Specific Course Cohort</option>
              </select>
            </div>

            {targetAudience === 'course' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Program</label>
                <select
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority Classification</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="normal">Standard Notice</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Immediate Action</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Content *</label>
            <textarea
              required
              rows={3}
              placeholder="Full details of the announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : ann.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-50 text-blue-800'
                  }`}
                >
                  {ann.priority}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{ann.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{ann.message}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Audience: <strong>{ann.target_audience.toUpperCase()}</strong> • Posted by {ann.created_by} on{' '}
                {formatKarachiDateTime(ann.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
