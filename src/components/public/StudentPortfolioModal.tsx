import React from 'react';
import {
  X,
  Award,
  ExternalLink,
  Code2,
  Calendar,
  CheckCircle2,
  Share2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { UserProfile, PublicPortfolioItem, Certificate } from '../../types/academy';
import { StarRating } from '../common/StarRating';
import { formatKarachiDate } from '../../utils/dateUtils';

interface StudentPortfolioModalProps {
  student: UserProfile | null;
  items: PublicPortfolioItem[];
  certificates: Certificate[];
  onClose: () => void;
}

export const StudentPortfolioModal: React.FC<StudentPortfolioModalProps> = ({
  student,
  items,
  certificates,
  onClose,
}) => {
  if (!student) return null;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Public portfolio link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Profile Cover */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 px-6 sm:px-8 pt-8 pb-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 ring-4 ring-white/20 overflow-hidden shrink-0 flex items-center justify-center text-2xl font-black text-amber-300">
              {student.avatar_url ? (
                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
              ) : (
                student.full_name.charAt(0)
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{student.full_name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-700/80 text-[11px] font-bold tracking-wide">
                  {student.roll_no}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Scholar
                </span>
              </div>

              <p className="text-xs text-blue-200 mt-1 font-medium">{student.course_title}</p>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 max-w-xl">
                {student.bio || 'Dedicated graduate focused on real-world engineering standards.'}
              </p>

              {/* Skills tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-3">
                {student.skills_list.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/10 text-blue-100 border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Approved Portfolio Works */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-700" />
                Approved Academy Projects ({items.length})
              </h4>
              <button
                onClick={copyProfileLink}
                className="text-xs font-semibold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Profile
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                No public projects approved for showcase yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
                          {item.course_title}
                        </span>
                        <StarRating rating={item.rating} size="sm" />
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">
                        Approved: {formatKarachiDate(item.approved_at)}
                      </span>
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          <span>Repository / Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Certificates */}
          {certificates.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-500" />
                Verified Credentials ({certificates.length})
              </h4>

              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{cert.course_title}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 rounded-md">
                          {cert.certificate_code}
                        </span>
                      </div>
                      <div className="text-xs text-amber-900/80 mt-1">{cert.grade_text}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Issued on: {formatKarachiDate(cert.issued_date)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 flex items-center gap-1 text-[11px] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Authentic</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
