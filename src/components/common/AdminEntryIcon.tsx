import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

/**
 * AdminEntryIcon
 * Discreet, single-entry institutional access point to the admin login portal.
 * - Positioned at the left edge of the viewport, vertically centered.
 * - Low opacity by default (60%), transitioning to full opacity on hover/focus.
 * - Plain anchor tag referencing '#/admin/login'.
 * - Pure navigation link: makes NO authorization decisions and reads no user/role state.
 * - Automatically unmounts/hides on any route starting with /admin.
 */
export const AdminEntryIcon: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash.startsWith('admin');
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      setIsAdminRoute(hash.startsWith('admin'));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdminRoute) {
    return null;
  }

  return (
    <a
      href="#/admin/login"
      aria-label="Admin login"
      title="Admin login"
      className="fixed left-[max(0.375rem,env(safe-area-inset-left))] sm:left-2.5 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white shadow-sm backdrop-blur-xs border border-slate-700/50 opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer select-none"
    >
      <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" aria-hidden="true" />
    </a>
  );
};
