import React from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Shield,
  Award,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { InspireLogo } from './InspireLogo';
import { academyStore } from '../../services/academyStore';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenStudentLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenStudentLogin,
}) => {
  const settings = academyStore.getSettings();
  const whatsappDigits = (settings.whatsapp_number || settings.official_whatsapp || '+92 321 0000000').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Academy Bio */}
          <div className="lg:col-span-2 space-y-4">
            <InspireLogo size="md" variant="light" />
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {settings.footer_text ||
                'Inspire Business Academy is a specialized institute for next-generation technology, digital commerce, software engineering, and industry-accredited practical education.'}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Official Verification
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-400">
                <Award className="w-4 h-4" /> ISO Standards
              </span>
            </div>
          </div>

          {/* Academic Offerings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Featured Programs
            </h4>
            <ul className="space-y-2 text-xs">
              {academyStore.getActiveCourses().slice(0, 5).map((course) => (
                <li key={course.id}>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {course.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Student & Public
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Approved Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('verify')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ai-advisor')}
                  className="hover:text-blue-400 transition-colors"
                >
                  AI Academic Mentor
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenStudentLogin}
                  className="hover:text-blue-400 transition-colors"
                >
                  Student Hub Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="hover:text-amber-400 font-semibold transition-colors text-amber-200/90"
                >
                  Student Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Campus Liaison
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>{settings.address || settings.location || 'Karachi, Sindh, Pakistan'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a
                  href={`mailto:${settings.contact_email || settings.official_email}`}
                  className="truncate hover:text-white transition-colors"
                >
                  {settings.contact_email || settings.official_email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {settings.whatsapp_number || settings.official_whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.academy_name || 'Inspire Business Academy'}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">Karachi Standard Time (PKT, UTC+5)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
