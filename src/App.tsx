import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/public/HeroSection';
import { PublicPortfolio } from './components/public/PublicPortfolio';
import { CertificateVerification } from './components/public/CertificateVerification';
import { CourseCatalog } from './components/public/CourseCatalog';
import { StudentHub } from './components/student/StudentHub';
import { StudentNotifications } from './components/student/StudentNotifications';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminGuard } from './components/admin/AdminGuard';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { AiAcademicAdvisor } from './components/ai/AiAcademicAdvisor';
import { ProductivityHub } from './components/productivity/ProductivityHub';
import { WorkspaceApp } from './workspace/WorkspaceApp';
import { academyStore } from './services/academyStore';
import { AdminEntryIcon } from './components/common/AdminEntryIcon';
import { ADMIN_ENTRY_ICON_VISIBILITY } from './config/adminConfig';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [user, setUser] = useState(academyStore.getCurrentUser());

  // Listen to academyStore user session changes
  useEffect(() => {
    const unsub = academyStore.subscribe(() => {
      setUser(academyStore.getCurrentUser());
    });
    return unsub;
  }, []);

  // Sync with HashRouter routes (/#/admin/*, /#/public-portfolio, /#/verify, /#/workspace/*, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('admin')) {
        setActiveTab('admin');
      } else if (hash.startsWith('workspace')) {
        setActiveTab('workspace');
      } else if (hash === 'verify-certificate' || hash === 'verify') {
        setActiveTab('verify');
      } else if (hash === 'courses') {
        setActiveTab('courses');
      } else if (hash === 'academy' || hash === 'student') {
        setActiveTab('student-hub');
      } else if (hash === 'ai-advisor') {
        setActiveTab('ai-advisor');
      } else if (hash === 'productivity') {
        setActiveTab('productivity');
      } else if (hash === 'public-portfolio' || hash === '') {
        setActiveTab('portfolio');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeTab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'portfolio') window.location.hash = '#/public-portfolio';
    else if (tab === 'courses') window.location.hash = '#/courses';
    else if (tab === 'verify') window.location.hash = '#/verify-certificate';
    else if (tab === 'student-hub') window.location.hash = '#/academy';
    else if (tab === 'ai-advisor') window.location.hash = '#/ai-advisor';
    else if (tab === 'productivity') window.location.hash = '#/productivity';
    else if (tab === 'workspace') window.location.hash = '#/workspace/home';
    else if (tab === 'admin') window.location.hash = '#/admin/dashboard';
  };

  const handleStudentAuthSuccess = () => {
    setActiveTab('student-hub');
    window.location.hash = '#/academy';
  };

  // Stats calculation for hero banner
  const stats = {
    studentsCount: academyStore.getAllStudents().length,
    approvedPortfoliosCount: academyStore.getPublicPortfolios().length,
    coursesCount: academyStore.getCourses().length,
    certificatesCount: academyStore.getCertificates().length,
  };

  // If viewing the Admin Console (wrapped in AdminGuard)
  if (activeTab === 'admin') {
    return (
      <AdminGuard onExitToPublic={() => handleTabChange('portfolio')}>
        <AdminLayout
          onExitToPublic={() => {
            handleTabChange('portfolio');
          }}
        />
      </AdminGuard>
    );
  }

  // If viewing the Student Learning Workspace
  if (activeTab === 'workspace') {
    return (
      <WorkspaceApp
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
      />
    );
  }

  // Admin entry icon visibility check
  const shouldShowAdminIcon =
    ADMIN_ENTRY_ICON_VISIBILITY === 'always' ||
    (ADMIN_ENTRY_ICON_VISIBILITY === 'signed-out' && !user);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white">
      {/* Discreet Institutional Admin Access Icon (plain link to #/admin/login) */}
      {shouldShowAdminIcon && <AdminEntryIcon />}

      {/* Primary Global Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'portfolio' && (
          <div>
            <HeroSection
              onExplorePortfolio={() => {
                const el = document.getElementById('portfolio-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onVerifyCertificate={() => handleTabChange('verify')}
              onStudentLogin={() => {
                if (user?.role === 'student') {
                  handleTabChange('student-hub');
                } else {
                  setIsStudentLoginOpen(true);
                }
              }}
              stats={stats}
            />

            <div id="portfolio-grid">
              <PublicPortfolio />
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <CourseCatalog
            onStudentRegister={() => setIsStudentLoginOpen(true)}
          />
        )}

        {activeTab === 'verify' && <CertificateVerification />}

        {activeTab === 'ai-advisor' && <AiAcademicAdvisor />}

        {activeTab === 'student-hub' && (
          <StudentHub onOpenAiAdvisor={() => handleTabChange('ai-advisor')} />
        )}

        {activeTab === 'student-notifications' && user && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <StudentNotifications student={user} />
          </div>
        )}

        {activeTab === 'productivity' && <ProductivityHub />}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
      />

      {/* Student Authentication Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        onSuccess={handleStudentAuthSuccess}
      />
    </div>
  );
}
