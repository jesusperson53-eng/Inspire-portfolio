import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  BarChart2,
  Briefcase,
  Bot,
  BookOpen,
  Gamepad2,
  Settings,
  MoreHorizontal,
  X,
  ArrowLeft,
  ExternalLink,
  Flame,
  Search,
} from 'lucide-react';
import { InspireLogo } from '../../components/common/InspireLogo';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { streak, streakReward } = useTasksViewModel();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const pathname = location.pathname;

  // 9 canonical items matching the reference app:
  const navItems = [
    { path: '/workspace/home', icon: Home, label: 'Home' },
    { path: '/workspace/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/workspace/reports', icon: BarChart2, label: 'Reports' },
    { path: '/workspace/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/workspace/chatbot', icon: Bot, label: 'Chatbot' },
    { path: '/workspace/learning', icon: BookOpen, label: 'PDFs' },
    { path: '/workspace/courses', icon: BookOpen, label: 'Courses' },
    { path: '/workspace/games', icon: Gamepad2, label: 'Games' },
    { path: '/workspace/settings', icon: Settings, label: 'Settings' },
  ];

  // Mobile bottom bar displays the top 4 primary items + "More" button
  const primaryMobileItems = navItems.slice(0, 4);
  const secondaryMobileItems = navItems.slice(4);

  const isHideNav =
    pathname === '/workspace' ||
    pathname === '/workspace/' ||
    pathname === '/workspace/splash' ||
    pathname === '/workspace/skills';

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-blue-900 selection:text-white">
      {/* Desktop Left Sidebar (>= 1024px) */}
      {!isHideNav && (
        <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-white border-r border-slate-900 shrink-0 sticky top-0 h-screen overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-between">
            <div
              onClick={() => navigate('/workspace/home')}
              className="cursor-pointer"
            >
              <InspireLogo size="md" variant="light" />
              <div className="mt-2.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-extrabold uppercase tracking-widest text-blue-300">
                Student Learning Workspace
              </div>
            </div>
          </div>

          {/* Streak Indicator Widget */}
          <div className="px-4 py-3 mx-4 my-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame size={16} />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">{streak} Days Streak</div>
                <div className="text-[10px] text-amber-300">{streakReward}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    isActive
                      ? 'bg-blue-900 text-white shadow-md shadow-blue-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
                  )}
                >
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-amber-400' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Return to Public Website (No Admin links per Hard Rule 8) */}
          <div className="p-4 border-t border-slate-900 space-y-2">
            <a
              href="#/public-portfolio"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ExternalLink size={13} />
              <span>Main Academy Website</span>
            </a>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Top subtle bar for mobile/tablet with website link */}
        {!isHideNav && (
          <header className="lg:hidden bg-blue-950 text-white px-4 py-3 flex items-center justify-between border-b border-blue-900 shrink-0">
            <div
              onClick={() => navigate('/workspace/home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <InspireLogo size="sm" variant="light" />
              <span className="text-xs font-extrabold tracking-wide uppercase text-amber-400">
                Workspace
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-amber-300">
                <Flame size={14} />
                <span>{streak}d</span>
              </div>
              <a
                href="#/public-portfolio"
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/10 hover:bg-white/20 text-blue-100"
              >
                Website
              </a>
            </div>
          </header>
        )}

        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
          {children}
        </main>

        {/* Mobile Bottom Navigation (< 1024px) */}
        {!isHideNav && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
          >
            {primaryMobileItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
                    isActive ? 'text-blue-900 font-extrabold' : 'text-slate-500 font-medium'
                  )}
                >
                  <div
                    className={cn(
                      'p-1.5 rounded-xl transition-all',
                      isActive ? 'bg-blue-50 text-blue-900' : 'bg-transparent'
                    )}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </button>
              );
            })}

            {/* "More" Drawer Button to ensure it never overflows on small mobile screens */}
            <button
              onClick={() => setMobileMoreOpen(true)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 transition-colors',
                secondaryMobileItems.some((s) => pathname.startsWith(s.path))
                  ? 'text-blue-900 font-extrabold'
                  : 'text-slate-500 font-medium'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-xl transition-all',
                  secondaryMobileItems.some((s) => pathname.startsWith(s.path))
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-transparent'
                )}
              >
                <MoreHorizontal size={18} />
              </div>
              <span className="text-[10px] mt-0.5">More</span>
            </button>
          </nav>
        )}

        {/* Mobile "More" Sheet Modal */}
        <AnimatePresence>
          {mobileMoreOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMoreOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative bg-white rounded-t-3xl p-6 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Workspace Modules
                  </h3>
                  <button
                    onClick={() => setMobileMoreOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {secondaryMobileItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.path);

                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          setMobileMoreOpen(false);
                          navigate(item.path);
                        }}
                        className={cn(
                          'flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all',
                          isActive
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 font-semibold'
                        )}
                      >
                        <Icon size={18} className={isActive ? 'text-blue-900' : 'text-slate-500'} />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <a
                    href="#/public-portfolio"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    <ExternalLink size={14} />
                    <span>Go to Main Academy Website</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
