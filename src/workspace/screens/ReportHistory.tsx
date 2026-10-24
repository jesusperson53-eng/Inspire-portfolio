import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useReportsViewModel } from '../store/useReportsViewModel';
import { ArrowLeft, Trash2, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { useState } from 'react';
import { DailyReportEntity, WeeklyReportEntity, MonthlyReportEntity } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';

export function ReportHistory() {
  const goBack = useSafeBack('/workspace/reports');
  const { dailyReports, weeklyReports, monthlyReports, deleteReport } = useReportsViewModel();
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [reportToDelete, setReportToDelete] = useState<{ type: 'daily' | 'weekly' | 'monthly'; id: string; title: string } | null>(null);

  const allReports = [
    ...Object.values(dailyReports).map((r: DailyReportEntity) => ({
      ...r,
      type: 'daily' as const,
      title: `Daily: ${r.date}`,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    })),
    ...Object.values(weeklyReports).map((r: WeeklyReportEntity) => ({
      ...r,
      type: 'weekly' as const,
      title: `Weekly: ${r.weekNumber}`,
      icon: CalendarDays,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100'
    })),
    ...Object.values(monthlyReports).map((r: MonthlyReportEntity) => ({
      ...r,
      type: 'monthly' as const,
      title: `Monthly: ${r.month}`,
      icon: CalendarRange,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }))
  ].sort((a, b) => b.id.localeCompare(a.id));

  const filteredReports = filter === 'all' ? allReports : allReports.filter(r => r.type === filter);

  return (
    <ScreenWrapper className="bg-gray-50">
      <div className="bg-gray-900 text-white pt-12 pb-6 px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Report History</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'daily', 'weekly', 'monthly'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No reports found.</div>
        ) : (
          filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={`${report.type}-${report.id}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`${report.bg} ${report.color} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{report.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.type === 'daily' && `Earnings: Rs ${(report as any).earnings}`}
                      {report.type === 'weekly' && `Earnings: Rs ${(report as any).totalEarnings}`}
                      {report.type === 'monthly' && `Earnings: Rs ${(report as any).totalEarnings}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReportToDelete({ type: report.type, id: report.id, title: report.title })}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  aria-label={`Delete ${report.title}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(reportToDelete)}
        title="Delete Report?"
        message={`Are you sure you want to delete "${reportToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (reportToDelete) {
            deleteReport(reportToDelete.type, reportToDelete.id);
          }
        }}
        onCancel={() => setReportToDelete(null)}
      />
    </ScreenWrapper>
  );
}
