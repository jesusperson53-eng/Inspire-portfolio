import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminRecord } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';

export const AdminAdmins: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'admin'>('admin');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Remove confirmation modal state
  const [adminToRemove, setAdminToRemove] = useState<AdminRecord | null>(null);

  const refreshList = async () => {
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (err: any) {
      console.error('Failed to fetch admins:', err);
      setActionError(err.message || 'Failed to fetch administrator records.');
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const authInfo = await adminService.verifyAdmin();
        if (mounted) {
          setIsSuperAdmin(Boolean(authInfo.isSuperAdmin));
          setCurrentAdminId(authInfo.userId || null);
          if (authInfo.isSuperAdmin) {
            const list = await adminService.getAdmins();
            if (mounted) setAdmins(list);
          }
        }
      } catch (err: any) {
        console.error('Failed to verify admin status:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (msg: string, isErr: boolean = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 5000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setSubmitting(true);

    const res = await adminService.addAdmin(newEmail, newRole);
    setSubmitting(false);

    if (res.success) {
      setIsAddModalOpen(false);
      setNewEmail('');
      setNewRole('admin');
      await refreshList();
      showToast(`Administrator privileges successfully granted to ${newEmail}`);
    } else {
      setActionError(res.error || 'Failed to add administrator.');
    }
  };

  const handleChangeRole = async (targetAdmin: AdminRecord, nextRole: 'super_admin' | 'admin') => {
    if (targetAdmin.role === nextRole) return;
    const res = await adminService.updateAdminRole(targetAdmin.email, nextRole);
    if (res.success) {
      await refreshList();
      showToast(`Role updated for ${targetAdmin.email} to ${nextRole}`);
    } else {
      showToast(res.error || 'Failed to update administrator role.', true);
    }
  };

  const handleConfirmRemove = async () => {
    if (!adminToRemove) return;
    setSubmitting(true);
    const res = await adminService.removeAdmin(adminToRemove.uid);
    setSubmitting(false);

    if (res.success) {
      const email = adminToRemove.email;
      setAdminToRemove(null);
      await refreshList();
      showToast(`Administrator privileges removed for ${email}. Account reverted to student.`);
    } else {
      showToast(res.error || 'Failed to remove administrator.', true);
      setAdminToRemove(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Verifying super administrative clearance...</p>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-extrabold text-slate-900">Restricted to Super Administrators</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Only institutional Super Administrators have clearance to view and manage executive administrative privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-900" />
            <span>Administrator Credentials Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage institutional governance, assign executive clearance, and audit privileged accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setActionError(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Verified Administrators ({admins.length})
          </span>
          <span className="text-[11px] text-slate-400">Strictly synced with public.admins</span>
        </div>

        {/* Mobile View: Cards */}
        <div className="sm:hidden divide-y divide-slate-100">
          {admins.map((admin) => (
            <div key={admin.uid} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{admin.full_name}</div>
                  <div className="text-xs text-slate-500 font-mono break-all">{admin.email}</div>
                </div>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    admin.role === 'super_admin'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Added: {formatKarachiDateTime(admin.created_at)}
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    handleChangeRole(admin, admin.role === 'super_admin' ? 'admin' : 'super_admin')
                  }
                  disabled={admin.uid === currentAdminId}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-30"
                >
                  Switch Role
                </button>
                <button
                  onClick={() => setAdminToRemove(admin)}
                  disabled={admin.uid === currentAdminId}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Administrator Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Administrative Role</th>
                <th className="py-3.5 px-6">Clearance Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((admin) => {
                const isSelf = admin.uid === currentAdminId;
                return (
                  <tr key={admin.uid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {admin.full_name.charAt(0) || 'A'}
                        </div>
                        <div>
                          <span>{admin.full_name}</span>
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-emerald-600 font-bold uppercase">
                              (Current User)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">{admin.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                          admin.role === 'super_admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-sans">
                      {formatKarachiDateTime(admin.created_at)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleChangeRole(admin, admin.role === 'super_admin' ? 'admin' : 'super_admin')
                          }
                          disabled={isSelf}
                          title={isSelf ? 'Cannot modify your own role' : 'Toggle role'}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {admin.role === 'super_admin' ? 'Demote to Admin' : 'Promote to Super Admin'}
                        </button>

                        <button
                          onClick={() => setAdminToRemove(admin)}
                          disabled={isSelf}
                          title={isSelf ? 'Cannot remove yourself' : 'Revoke administrative credentials'}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold">Grant Administrator Privileges</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              {/* Mandatory Warning Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Warning:</strong> Granting administrator access grants full control over academy data, student records, courses, grading, and settings. Only grant this clearance to authorized institutional faculty.
                </p>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {actionError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Existing Account Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="faculty@inspireacademy.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The user must already have an account in the system.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Privilege Clearance Level
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'super_admin' | 'admin')}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
                >
                  <option value="admin">Administrator (Review, Students, Courses)</option>
                  <option value="super_admin">Super Administrator (Full System Control + Admin Management)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {submitting ? 'Granting...' : 'Grant Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {adminToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Revoke Administrator Privileges?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove administrator access for{' '}
                <strong className="text-slate-800 font-mono">{adminToRemove.email}</strong>?
                This user will immediately lose access to the Admin Panel and will be reverted to a student role.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdminToRemove(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
              >
                {submitting ? 'Revoking...' : 'Yes, Revoke Access'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
