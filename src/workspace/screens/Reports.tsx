import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useReportsViewModel } from '../store/useReportsViewModel';
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  Activity,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  History,
} from 'lucide-react';
import { motion } from 'motion/react';

export function Reports() {
  const navigate = useNavigate();
  const { getPerformanceScore, getInsights, getWeeklySummary } = useReportsViewModel();
  const score = getPerformanceScore();
  const insights = getInsights();
  const summary = getWeeklySummary();

  const reportTypes = [
    {
      title: 'Daily Report',
      desc: "Log today's outreach, orders, problems & tomorrow's plan",
      icon: Calendar,
      color: 'text-blue-700',
      bg: 'bg-blue-100',
      path: '/workspace/reports/daily',
    },
    {
      title: 'Weekly Report',
      desc: 'Summarize week totals, best service, and goals',
      icon: CalendarDays,
      color: 'text-indigo-700',
      bg: 'bg-indigo-100',
      path: '/workspace/reports/weekly',
    },
    {
      title: 'Monthly Report',
      desc: 'Review monthly milestones and biggest lessons',
      icon: CalendarRange,
      color: 'text-purple-700',
      bg: 'bg-purple-100',
      path: '/workspace/reports/monthly',
    },
  ];

  return (
    <ScreenWrapper className="bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-8 pb-6 px-6 sm:px-8 rounded-b-3xl sm:rounded-b-[2.5rem] shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Reports & Analytics</h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1">
              Performance telemetry and business analytics engine.
            </p>
          </div>
          <button
            onClick={() => navigate('/workspace/reports/history')}
            aria-label="Report History"
            className="bg-white/10 hover:bg-white/20 p-2.5 rounded-2xl transition-colors cursor-pointer border border-white/20"
            title="View History"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Analytics Engine: Performance Score Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${score}, 100` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={
                  score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'
                }
                strokeWidth="3.2"
                strokeDasharray={`${score}, 100`}
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">{score}</span>
              <span className="text-[9px] font-bold uppercase text-slate-400">/ 100</span>
            </div>
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity size={18} className="text-blue-900" />
              <span>Algorithmic Performance Index</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Calculated dynamically: Messages Sent (40%) + Orders Completed (40%) + Consistency Streak (20%).
            </p>
          </div>
        </div>

        {/* Insights System */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Algorithmic Smart Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((insight, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={idx}
                className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  insight.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                {insight.type === 'warning' ? (
                  <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                ) : (
                  <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                )}
                <p
                  className={`text-xs font-semibold leading-relaxed ${
                    insight.type === 'warning' ? 'text-amber-900' : 'text-emerald-900'
                  }`}
                >
                  {insight.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Summary Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" />
              <span>Weekly Rolling Revenue & Growth</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Top Output Day</p>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">{summary.bestDay}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Growth vs Last Week</p>
              <p
                className={`font-black text-sm mt-0.5 ${
                  summary.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {summary.growth >= 0 ? '+' : ''}
                {summary.growth}%
              </p>
            </div>
          </div>

          {/* Simple Offline Chart */}
          <div className="h-28 flex items-end justify-between gap-2 pt-4 border-t border-slate-100">
            {summary.chartData.map((data, idx) => {
              const maxEarnings = Math.max(...summary.chartData.map((d) => d.earnings), 1);
              const height = `${(data.earnings / maxEarnings) * 100}%`;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-full">
                  <div className="w-full bg-blue-50 rounded-t-lg relative group h-20 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="w-full bg-blue-900 rounded-t-lg"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{data.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Reports Action Buttons */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Submit New Periodic Report
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {reportTypes.map((report, index) => {
              const Icon = report.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(report.path)}
                  className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/90 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${report.bg} ${report.color} w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{report.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{report.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-xs font-bold text-blue-900">
                    <ChevronRight size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
