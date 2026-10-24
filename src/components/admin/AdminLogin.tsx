import React, { useState } from 'react';
import { Lock, AlertTriangle, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { InspireLogo } from '../common/InspireLogo';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured. Admin authentication cannot proceed without live database credentials.');
        setLoading(false);
        return;
      }

      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authErr) {
        setError(authErr.message || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      if (!authData.session) {
        setError('Failed to establish session. Please try again.');
        setLoading(false);
        return;
      }

      // 2. Strict Database Verification via public.is_admin()
      const { data: isAdmin, error: adminErr } = await supabase.rpc('is_admin');
      if (adminErr || !isAdmin) {
        // Sign out immediately to avoid unauthorized session
        await supabase.auth.signOut();
        setError('Access Denied: This account is registered but does not possess verified administrator credentials in public.admins.');
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during administrative authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-white selection:bg-blue-900">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 text-center">
          <div className="flex justify-center mb-4">
            <InspireLogo size="lg" variant="light" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Gateway</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Administrator Portal</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Authorized administrative access only. Grounded directly in PostgreSQL database role validation.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@inspireacademy.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Security Password / Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating with Database...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Admin privileges are assigned strictly via database <code className="text-slate-300 font-mono">public.admins</code> table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
