import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { InspireLogo } from '../../components/common/InspireLogo';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { ACADEMY_INFO } from '../config';
import {
  CheckSquare,
  BarChart2,
  Briefcase,
  Target,
  Phone,
  MapPin,
  User,
  Flame,
  Bell,
  BookOpen,
  Search,
  Command,
  GraduationCap,
  Award,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Home() {
  const navigate = useNavigate();
  const { streak, streakReward, todayTask } = useTasksViewModel();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show offline notification if tasks are incomplete
    if (todayTask.messagesSent < 30 || todayTask.ordersCompleted === 0) {
      const timer = setTimeout(() => setShowNotification(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [todayTask]);

  const menuItems = [
    { title: 'Daily Tasks', desc: 'Outreach & orders', icon: CheckSquare, color: 'bg-blue-600', path: '/workspace/tasks' },
    { title: 'Reports', desc: 'Daily, weekly & monthly', icon: BarChart2, color: 'bg-indigo-600', path: '/workspace/reports' },
    { title: 'Local Portfolio', desc: 'IndexedDB assets', icon: Briefcase, color: 'bg-purple-600', path: '/workspace/portfolio' },
    { title: 'Targets', desc: 'Milestone tracking', icon: Target, color: 'bg-amber-600', path: '/workspace/targets' },
    { title: 'PDF Learning', desc: 'Roman-Urdu guides', icon: BookOpen, color: 'bg-emerald-600', path: '/workspace/learning' },
    { title: 'Courses', desc: '10 Full Courses', icon: BookOpen, color: 'bg-teal-600', path: '/workspace/courses' },
    { title: 'Learning Games', desc: '5 Interactive games', icon: Target, color: 'bg-orange-600', path: '/workspace/games' },
    { title: 'Shortcuts', desc: '100 Hotkeys vault', icon: Command, color: 'bg-pink-600', path: '/workspace/shortcuts' },
  ];

  return (
    <ScreenWrapper className="bg-slate-50 relative pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-b-3xl sm:rounded-b-[2.5rem] pt-8 pb-8 px-6 sm:px-8 shadow-lg relative overflow-hidden shrink-0">
        <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 z-0"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-lg border-2 border-yellow-400/80 shrink-0 flex items-center justify-center overflow-hidden">
              <InspireLogo size="md" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[11px] text-blue-200 font-bold uppercase tracking-wider">
                Student Learning Workspace
              </h2>
              <h1 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight mt-0.5">
                {ACADEMY_INFO.name}
              </h1>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 shadow-xs self-start sm:self-center">
            <Flame size={20} className={streak > 0 ? 'text-amber-400' : 'text-slate-400'} />
            <div>
              <div className="font-extrabold text-sm text-white leading-none">{streak} Days Streak</div>
              <div className="text-[10px] text-amber-300 font-medium uppercase tracking-wider mt-0.5">
                {streakReward}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Profile Bar */}
        <div className="flex items-center gap-3 mt-6 relative z-10">
          <button
            onClick={() => navigate('/workspace/search')}
            aria-label="Search"
            className="flex-1 min-w-0 h-11 bg-white/10 rounded-xl px-4 flex items-center gap-2.5 text-blue-100 text-xs backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <Search size={16} className="text-white shrink-0" />
            <span className="truncate">Search courses, topics, tasks, shortcuts...</span>
          </button>
          <button
            onClick={() => navigate('/workspace/profile')}
            aria-label="Profile"
            className="h-11 px-4 bg-white/10 rounded-xl flex items-center gap-2 text-white text-xs font-bold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
          >
            <User size={16} className="text-white shrink-0" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Offline Notification Banner */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 sm:mx-6 mt-4 bg-white rounded-2xl shadow-sm border border-blue-100 p-4 flex items-start gap-3 shrink-0"
          >
            <div className="bg-blue-100 text-blue-900 p-2 rounded-xl shrink-0">
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Daily Goal Reminder</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                30 messages bheje? Aaj ka daily report fill karo aur targets track karo!
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 cursor-pointer"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Responsive 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="px-4 sm:px-6 py-6 space-y-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Productivity & Learning Tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/90 flex flex-col items-start gap-3 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-left"
                >
                  <div
                    className={`${item.color} w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs`}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Website Cloud Portals Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            Academy Cloud Portals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="#/academy"
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Online Student Portal</h4>
                  <p className="text-[11px] text-slate-500">Assignment submissions, attendance & grades</p>
                </div>
              </div>
              <ExternalLink size={15} className="text-slate-400" />
            </a>

            <a
              href="#/public-portfolio"
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Public Showcase & Verification</h4>
                  <p className="text-[11px] text-slate-500">Official student work and verified credentials</p>
                </div>
              </div>
              <ExternalLink size={15} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* Academy Information Card (Centralized via ACADEMY_INFO) */}
        <div>
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Institutional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-900 mt-0.5">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Academy Director</p>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-900">{ACADEMY_INFO.owner}</p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Direct & WhatsApp</p>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{ACADEMY_INFO.phone}</p>
                  </div>
                </div>
                <a
                  href={ACADEMY_INFO.whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors self-center"
                >
                  WhatsApp
                </a>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-900 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Campus Address</p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {ACADEMY_INFO.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
