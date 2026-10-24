import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WORKSPACE_REQUIRES_LOGIN } from './config';
import { academyStore } from '../services/academyStore';
import { WorkspaceLayout } from './components/WorkspaceLayout';

// Screens
import { Splash } from './screens/Splash';
import { Skills } from './screens/Skills';
import { Home } from './screens/Home';
import { Tasks } from './screens/Tasks';
import { Reports } from './screens/Reports';
import { DailyReportForm } from './screens/DailyReportForm';
import { WeeklyReportForm } from './screens/WeeklyReportForm';
import { MonthlyReportForm } from './screens/MonthlyReportForm';
import { ReportHistory } from './screens/ReportHistory';
import { Portfolio } from './screens/Portfolio';
import { Chatbot } from './screens/Chatbot';
import { Learning } from './screens/Learning';
import { Courses } from './screens/Courses';
import { CourseDetail } from './screens/CourseDetail';
import { Games } from './screens/Games';
import { QuizBattle } from './screens/games/QuizBattle';
import { PuzzleChallenge } from './screens/games/PuzzleChallenge';
import { MemoryGame } from './screens/games/MemoryGame';
import { EnemyShooter } from './screens/games/EnemyShooter';
import { BubbleShooter } from './screens/games/BubbleShooter';
import { Settings } from './screens/Settings';
import { Targets } from './screens/Targets';
import { ShortcutVault } from './screens/ShortcutVault';
import { Search } from './screens/Search';
import { Profile } from './screens/Profile';
import { InspireLogo } from '../components/common/InspireLogo';
import { Lock, LogIn, ExternalLink } from 'lucide-react';

interface WorkspaceAppProps {
  onOpenStudentLogin?: () => void;
}

export function WorkspaceApp({ onOpenStudentLogin }: WorkspaceAppProps) {
  const [user, setUser] = useState(academyStore.getCurrentUser());

  useEffect(() => {
    const unsub = academyStore.subscribe(() => {
      setUser(academyStore.getCurrentUser());
    });
    return unsub;
  }, []);

  // When WORKSPACE_REQUIRES_LOGIN is true, enforce existing student login
  if (WORKSPACE_REQUIRES_LOGIN && !user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center selection:bg-blue-900">
        <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-2xl mb-6 flex items-center justify-center border-2 border-yellow-400">
          <InspireLogo size="md" />
        </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Lock size={14} />
          Student Workspace Authentication Required
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold max-w-md">
          Please Log In to Access the Student Productivity Workspace
        </h1>
        <p className="text-slate-400 text-sm max-w-md mt-3">
          This workspace is linked to your institutional student profile. Please sign in with your student credentials or return to the main website.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
          {onOpenStudentLogin && (
            <button
              onClick={onOpenStudentLogin}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <LogIn size={18} />
              Sign In to Student Account
            </button>
          )}
          <a
            href="#/public-portfolio"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-sm"
          >
            <ExternalLink size={16} />
            Back to Public Website
          </a>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <WorkspaceLayout>
        <Routes>
          <Route path="/workspace/splash" element={<Splash />} />
          <Route path="/workspace/skills" element={<Skills />} />
          <Route path="/workspace/home" element={<Home />} />
          <Route path="/workspace/tasks" element={<Tasks />} />
          <Route path="/workspace/reports" element={<Reports />} />
          <Route path="/workspace/reports/daily" element={<DailyReportForm />} />
          <Route path="/workspace/reports/weekly" element={<WeeklyReportForm />} />
          <Route path="/workspace/reports/monthly" element={<MonthlyReportForm />} />
          <Route path="/workspace/reports/history" element={<ReportHistory />} />
          <Route path="/workspace/portfolio" element={<Portfolio />} />
          <Route path="/workspace/chatbot" element={<Chatbot />} />
          <Route path="/workspace/learning" element={<Learning />} />
          <Route path="/workspace/courses" element={<Courses />} />
          <Route path="/workspace/courses/:id" element={<CourseDetail />} />
          <Route path="/workspace/games" element={<Games />} />
          <Route path="/workspace/games/quiz" element={<QuizBattle />} />
          <Route path="/workspace/games/puzzle" element={<PuzzleChallenge />} />
          <Route path="/workspace/games/memory" element={<MemoryGame />} />
          <Route path="/workspace/games/shooter" element={<EnemyShooter />} />
          <Route path="/workspace/games/bubble" element={<BubbleShooter />} />
          <Route path="/workspace/settings" element={<Settings />} />
          <Route path="/workspace/targets" element={<Targets />} />
          <Route path="/workspace/shortcuts" element={<ShortcutVault />} />
          <Route path="/workspace/search" element={<Search />} />
          <Route path="/workspace/profile" element={<Profile />} />

          {/* Fallback routes */}
          <Route path="/workspace" element={<Navigate to="/workspace/home" replace />} />
          <Route path="*" element={<Navigate to="/workspace/home" replace />} />
        </Routes>
      </WorkspaceLayout>
    </HashRouter>
  );
}
export default WorkspaceApp;
