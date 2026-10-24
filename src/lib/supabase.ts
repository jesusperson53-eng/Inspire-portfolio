import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  return '';
};

export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
export const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Checks if current authenticated session is an admin via RPC public.is_admin()
 * Security Rule: Admin identity is decided ONLY by the database.
 * If check fails, errors out, or times out, access is strictly denied (false).
 */
export async function verifyDatabaseIsAdmin(): Promise<{
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role?: 'super_admin' | 'admin';
  email?: string;
  userId?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { isAdmin: false, isSuperAdmin: false };
  }

  try {
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes?.user) {
      return { isAdmin: false, isSuperAdmin: false };
    }

    const user = userRes.user;

    // Call trusted is_admin() database function
    const { data: isAdmin, error: rpcErr } = await supabase.rpc('is_admin');
    if (rpcErr || !isAdmin) {
      return { isAdmin: false, isSuperAdmin: false };
    }

    // Call trusted is_super_admin()
    const { data: isSuperAdmin } = await supabase.rpc('is_super_admin');

    return {
      isAdmin: true,
      isSuperAdmin: Boolean(isSuperAdmin),
      role: isSuperAdmin ? 'super_admin' : 'admin',
      email: user.email,
      userId: user.id,
    };
  } catch (err) {
    console.error('Error verifying admin authorization with database:', err);
    // Security Rule 3: Denied on error or timeout
    return { isAdmin: false, isSuperAdmin: false };
  }
}
