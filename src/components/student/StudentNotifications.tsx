import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Award,
  Megaphone,
  Check,
  Clock,
} from 'lucide-react';
import { academyStore } from '../../services/academyStore';
import { UserProfile } from '../../types/academy';
import { formatKarachiDateTime } from '../../utils/dateUtils';

interface StudentNotificationsProps {
  student: UserProfile;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({ student }) => {
  const notifications = academyStore.getNotifications(student.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grade':
      case 'review':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'revision':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'deletion':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Notifications & Alerts</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time notifications regarding reviews, grades, and academy announcements.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {notifications.filter((n) => !n.is_read).length} Unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs text-slate-500 text-xs">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p>No notifications yet. New grades and announcements will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.is_read
                  ? 'bg-white border-slate-200/80 text-slate-600'
                  : 'bg-blue-50/50 border-blue-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/60 shrink-0">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatKarachiDateTime(notif.created_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                {!notif.is_read && (
                  <div className="mt-3">
                    <button
                      onClick={() => academyStore.markNotificationAsRead(notif.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:text-blue-900 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Mark as Read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
