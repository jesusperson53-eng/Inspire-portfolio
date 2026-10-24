import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Code2,
  FileCheck,
} from 'lucide-react';

interface HeroSectionProps {
  onExplorePortfolio: () => void;
  onVerifyCertificate: () => void;
  onStudentLogin: () => void;
  stats: {
    studentsCount: number;
    approvedPortfoliosCount: number;
    coursesCount: number;
    certificatesCount: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePortfolio,
  onVerifyCertificate,
  onStudentLogin,
  stats,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-12 pb-16 sm:pt-16 sm:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-200 text-xs font-semibold backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Accredited Technical & Business Excellence</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Where Practical Tech Mastery Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
              Real-World Portfolios
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Inspire Business Academy delivers professional skill development and hands-on career training across 10 specialized programs with verifiable student projects and transparent progress tracking.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onExplorePortfolio}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <span>Explore Student Showcase</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onVerifyCertificate}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verify Credential</span>
            </button>

            <button
              onClick={onStudentLogin}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-800/80 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Student Portal</span>
            </button>

            <a
              href="#/workspace/home"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Student Workspace</span>
            </a>
          </div>
        </div>

        {/* Stats Grid Banner */}
        <div className="mt-14 sm:mt-18 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.studentsCount}</div>
                <div className="text-[11px] font-semibold text-slate-400">Enrolled Students</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.approvedPortfoliosCount}</div>
                <div className="text-[11px] font-semibold text-slate-400">Verified Projects</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.coursesCount}</div>
                <div className="text-[11px] font-semibold text-slate-400">Active Programs</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.certificatesCount}</div>
                <div className="text-[11px] font-semibold text-slate-400">Issued Certificates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
