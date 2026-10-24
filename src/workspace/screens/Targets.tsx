import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { useTargetsViewModel } from '../store/useTargetsViewModel';
import {
  Target as TargetIcon,
  TrendingUp,
  Award,
  MessageSquare,
  ShoppingBag,
  Users,
  DollarSign,
} from 'lucide-react';
import { motion } from 'motion/react';

export function Targets() {
  const { todayTask } = useTasksViewModel();
  const { weeklyStats, monthlyStats } = useTargetsViewModel();

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-emerald-500';
    if (percent >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const TargetCard = ({ title, current, target, icon: Icon, colorTheme, prefix = '' }: any) => {
    const progress = Math.min(100, (current / target) * 100);
    const barColor = getProgressColor(progress);

    return (
      <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${colorTheme}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
            </div>
            <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${colorTheme}`}>
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full rounded-full ${barColor}`}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 text-right font-semibold mt-1">
          {prefix}{current} of {prefix}{target}
        </p>
      </div>
    );
  };

  return (
    <ScreenWrapper className="bg-slate-50 pb-28">
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-8 pb-6 px-6 sm:px-8 rounded-b-3xl sm:rounded-b-[2.5rem] shadow-md">
        <h1 className="text-2xl font-extrabold tracking-tight">Milestone Targets</h1>
        <p className="text-blue-200 text-xs sm:text-sm mt-1">
          Monitor your daily, weekly, and monthly commercial achievements.
        </p>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-8">
        {/* Daily Targets */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TargetIcon size={16} /> Daily Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TargetCard
              title="Daily Messages Sent"
              current={todayTask.messagesSent}
              target={30}
              icon={MessageSquare}
              colorTheme="bg-blue-50 text-blue-900"
            />
            <TargetCard
              title="Daily Orders Completed"
              current={todayTask.ordersCompleted}
              target={2}
              icon={ShoppingBag}
              colorTheme="bg-blue-50 text-blue-900"
            />
          </div>
        </section>

        {/* Weekly Targets */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> Weekly Summary (Monday - Sunday)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TargetCard
              title="Weekly Messages"
              current={weeklyStats.messagesSent}
              target={200}
              icon={MessageSquare}
              colorTheme="bg-indigo-50 text-indigo-900"
            />
            <TargetCard
              title="Weekly Orders"
              current={weeklyStats.ordersCompleted}
              target={10}
              icon={ShoppingBag}
              colorTheme="bg-indigo-50 text-indigo-900"
            />
            <TargetCard
              title="Weekly Clients"
              current={weeklyStats.clientsObtained}
              target={20}
              icon={Users}
              colorTheme="bg-indigo-50 text-indigo-900"
            />
          </div>
        </section>

        {/* Monthly Targets */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award size={16} /> Monthly Benchmarks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TargetCard
              title="Monthly Messages"
              current={monthlyStats.messagesSent}
              target={800}
              icon={MessageSquare}
              colorTheme="bg-purple-50 text-purple-900"
            />
            <TargetCard
              title="Monthly Orders"
              current={monthlyStats.ordersCompleted}
              target={40}
              icon={ShoppingBag}
              colorTheme="bg-purple-50 text-purple-900"
            />
            <TargetCard
              title="Monthly Earnings"
              current={monthlyStats.earnings}
              target={30000}
              icon={DollarSign}
              colorTheme="bg-purple-50 text-purple-900"
              prefix="Rs "
            />
          </div>
        </section>
      </div>
    </ScreenWrapper>
  );
}
