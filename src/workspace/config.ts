/**
 * Inspire Business Academy — Workspace Configuration
 * Centralized settings for the local-first student workspace.
 */

export const WORKSPACE_REQUIRES_LOGIN = false;

export const ACADEMY_INFO = {
  name: 'THE INSPIRE BUSINESS ACADEMY',
  owner: 'Adeel Bhatti',
  phone: '03093534289',
  phoneFormatted: '+92 309 3534289',
  whatsAppNumber: '923093534289',
  whatsAppLink: 'https://wa.me/923093534289',
  address: 'Near Shimla Point, Beside NGS School Mehrabad, Sadiqabad',
  city: 'Sadiqabad',
  tagline: 'Learn • Earn • Grow'
} as const;

export const WORKSPACE_STORAGE_KEYS = {
  skills: 'inspire_skills',
  tasks: 'inspire_tasks',
  dailyReports: 'inspire_daily_reports',
  weeklyReports: 'inspire_weekly_reports',
  monthlyReports: 'inspire_monthly_reports',
  streak: 'inspire_streak',
  targets: 'inspire_targets',
  learningProgress: 'inspire_learning_progress',
  courseProgress: 'inspire_course_progress',
  gameProgress: 'inspire_game_progress',
  profile: 'inspire_profile',
  lastBackup: 'inspire_last_backup',
  autoBackupData: 'inspire_auto_backup_data',
  lastAutoBackupDate: 'inspire_last_auto_backup_date'
} as const;
