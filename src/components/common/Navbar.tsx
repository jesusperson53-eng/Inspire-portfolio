import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Layers,
  BookOpen,
  LogIn,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { InspireLogo } from './InspireLogo';
import { academyStore } from '../../services/academyStore';
import { UserProfile } from '../../types/academy';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenStudentLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenStudentLogin,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(academyStore.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = academyStore.subscribe(() => {
      const user = academyStore.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const unread = academyStore.getNotifications(user.id).filter((n) => !n.is_read).length;
        setNotificationsCount(unread);
      } else {
        setNotificationsCount(0);
      }
    });
    return unsubscribe;
  }, []);

  const isStudent = currentUser?.role === 'student';

  const handleLogout = () => {
    academyStore.logout();
    setActiveTab('portfolio');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('portfolio')}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <InspireLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-blue-50 text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-700" />
              Public Showcase
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-blue-50 text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              Academic Programs
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'verify'
                  ? 'bg-blue-50 text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              Verify Certificate
            </button>

            <button
              onClick={() => setActiveTab('ai-advisor')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'ai-advisor'
                  ? 'bg-purple-50 text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Academic Advisor
            </button>

            {/* Student Learning Workspace (Reference App Port) */}
            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-amber-100 text-amber-950 font-extrabold shadow-xs ring-1 ring-amber-300'
                  : 'text-slate-700 hover:text-amber-900 hover:bg-amber-50/70'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              Student Workspace
            </button>
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {isStudent && (
                  <>
                    <button
                      onClick={() => setActiveTab('student-hub')}
                      className={`relative flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'student-hub'
                          ? 'bg-blue-900 text-white shadow-md'
                          : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Student Portal ({currentUser.roll_no})
                    </button>

                    <button
                      onClick={() => setActiveTab('student-notifications')}
                      className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {notificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                          {notificationsCount}
                        </span>
                      )}
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenStudentLogin}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-900/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Student Login
              </button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && isStudent && (
              <button
                onClick={() => setActiveTab('student-notifications')}
                className="relative p-2 rounded-xl text-slate-700 bg-slate-100"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                    {notificationsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => {
              setActiveTab('portfolio');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl text-left"
          >
            <Layers className="w-5 h-5 text-blue-700" />
            Public Showcase
          </button>
          <button
            onClick={() => {
              setActiveTab('courses');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl text-left"
          >
            <BookOpen className="w-5 h-5 text-indigo-700" />
            Academic Programs
          </button>
          <button
            onClick={() => {
              setActiveTab('verify');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-xl text-left"
          >
            <Award className="w-5 h-5 text-amber-600" />
            Verify Certificate
          </button>
          <button
            onClick={() => {
              setActiveTab('ai-advisor');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-sm font-bold text-purple-900 hover:bg-purple-50 rounded-xl text-left"
          >
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Academic Advisor
          </button>
          <button
            onClick={() => {
              setActiveTab('workspace');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 p-3 text-sm font-bold text-amber-900 bg-amber-50/80 rounded-xl text-left"
          >
            <Briefcase className="w-4 h-4 text-amber-600" />
            Student Workspace
          </button>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {currentUser ? (
              <>
                {isStudent && (
                  <button
                    onClick={() => {
                      setActiveTab('student-hub');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-900 text-white font-bold text-xs uppercase tracking-wider"
                  >
                    <User className="w-4 h-4" />
                    My Student Portal ({currentUser.roll_no})
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenStudentLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-900 text-white font-bold text-xs uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                Student Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
