import React, { useState, useEffect } from 'react';
import { ShieldAlert, LogOut, ArrowLeft, Loader2, Database, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured, verifyDatabaseIsAdmin } from '../../lib/supabase';
import { AdminLogin } from './AdminLogin';

interface AdminGuardProps {
  children: React.ReactNode;
  onExitToPublic: () => void;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, onExitToPublic }) => {
  const [checking, setChecking] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    userEmail?: string;
  }>({
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
  });

  const checkAuthorization = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setChecking(false);
      return;
    }

    setChecking(true);
    try {
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr || !sessionData?.session) {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isSuperAdmin: false,
        });
        setChecking(false);
        return;
      }

      // Check database via trusted public.is_admin() RPC
      const adminStatus = await verifyDatabaseIsAdmin();
      setAuthState({
        isAuthenticated: true,
        isAdmin: adminStatus.isAdmin,
        isSuperAdmin: adminStatus.isSuperAdmin,
        userEmail: adminStatus.email,
      });
    } catch (err) {
      console.error('Admin authorization verification failed:', err);
      // Security Rule: Denied on error or timeout
      setAuthState({
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setChecking(false);
      return;
    }

    checkAuthorization();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isSuperAdmin: false,
        });
      } else {
        checkAuthorization();
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
    });
  };

  // State 0: Supabase is NOT configured (Missing environment variables)
  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-white selection:bg-amber-900">
        <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-amber-500/30 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Database className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Database Connection Required</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Supabase is Not Configured</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              The Administrator Panel operates exclusively on live PostgreSQL Row Level Security (RLS)
              and <code className="text-amber-300 font-mono">SECURITY DEFINER</code> database RPCs.
              In accordance with strict security architecture, mock or local-storage fallbacks are disabled in the admin portal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs font-mono space-y-2">
            <p className="text-slate-400 font-sans font-semibold">Required Environment Variables:</p>
            <div className="flex items-center justify-between text-slate-300 bg-slate-900/80 px-3 py-2 rounded-xl">
              <span>VITE_SUPABASE_URL</span>
              <span className="text-rose-400 font-bold">MISSING</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 bg-slate-900/80 px-3 py-2 rounded-xl">
              <span>VITE_SUPABASE_ANON_KEY</span>
              <span className="text-rose-400 font-bold">MISSING</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onExitToPublic}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700 hover:border-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 1: Loading verification
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-bold">Verifying Administrator Authorization...</h3>
        <p className="text-xs text-slate-400 mt-1">Executing public.is_admin() database validation</p>
      </div>
    );
  }

  // State 2: Not signed in → show dedicated AdminLogin screen (no redirect loop)
  if (!authState.isAuthenticated) {
    return <AdminLogin onSuccess={checkAuthorization} />;
  }

  // State 3: Signed in, but NOT an admin (e.g. student account or hr498412@gmail.com)
  if (!authState.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-white selection:bg-rose-900">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-rose-900/50 p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Access Denied</h2>
            <p className="text-xs text-slate-400">
              Your account (<span className="text-slate-200 font-medium">{authState.userEmail}</span>)
              does not hold verified administrator credentials in the institutional database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 text-left space-y-2">
            <p className="font-semibold text-slate-300">Security Rule Enforced:</p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Only accounts explicitly provisioned inside <code className="text-blue-400 font-mono">public.admins</code> table
              can access the Executive Control Console.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSignOut}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onExitToPublic}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Verified Administrator
  return <>{children}</>;
};
