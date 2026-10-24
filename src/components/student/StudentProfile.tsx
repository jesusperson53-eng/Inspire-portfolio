import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile } from '../../types/academy';

interface StudentProfileProps {
  student: UserProfile;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  const [fullName, setFullName] = useState(student.full_name);
  const [phone, setPhone] = useState(student.phone);
  const [city, setCity] = useState(student.city);
  const [bio, setBio] = useState(student.bio || '');
  const [skillsStr, setSkillsStr] = useState(student.skills_list.join(', '));
  const [avatarUrl, setAvatarUrl] = useState(student.avatar_url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    academyStore.updateStudentProfile(student.id, {
      full_name: fullName,
      phone,
      city,
      bio,
      skills_list: skills,
      avatar_url: avatarUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-slate-900">Student Profile & Credentials</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your public portfolio persona. Institutional identity fields are locked by faculty administration.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Institutional Non-Editable Fields Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Institutional Record (Immutable by Student)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Official Roll No:</span>
              <span className="font-mono font-bold text-slate-900">{student.roll_no}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Academic Specialization:</span>
              <span className="font-bold text-slate-900">{student.course_title}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Batch Enrolled:</span>
              <span className="font-semibold text-slate-900">{student.batch}</span>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Login)</label>
              <input
                type="email"
                disabled
                value={student.email}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
            <input
              type="url"
              placeholder="https://your-domain.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Career Goal</label>
            <textarea
              rows={3}
              placeholder="Share your engineering focus, past achievements, or career aspiration..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Skills Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="React 19, TypeScript, PostgreSQL, Figma, Docker..."
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-900/20 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Settings</span>
        </button>
      </form>
    </div>
  );
};
