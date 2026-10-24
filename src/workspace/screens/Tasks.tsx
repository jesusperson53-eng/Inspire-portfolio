import { ScreenWrapper } from '../components/ScreenWrapper';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { useSkillsViewModel } from '../store/useSkillsViewModel';
import {
  MessageSquare,
  ShoppingBag,
  Image as ImageIcon,
  BookOpen,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Users,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SKILL_TASKS: Record<string, string> = {
  'Computer Course': 'Practice 1 typing / OS module',
  'MS Office Course': 'Complete 1 Excel / Word sheet',
  'Graphic Design (Photoshop)': 'Create 1 design asset',
  'CapCut Video Editing': 'Edit 1 short video clip',
  'AI Tools Mastery': 'Generate 1 AI workflow prompt',
  'YouTube Automation': 'Research 1 video topic / script',
  'App Dev (Gemini 3.1 Pro)': 'Code 1 app feature / API call',
  'Facebook Mastery': 'Optimize 1 Facebook campaign / post',
  'Local Dropshipping': 'Find 1 local supplier / product',
  'Organic Digital Marketing': 'Execute 1 organic outreach campaign',
};

export function Tasks() {
  const { todayTask, updateTodayTask } = useTasksViewModel();
  const { skills } = useSkillsViewModel();

  // Smart Logic Calculations
  const isMessagesLow = todayTask.messagesSent < 30;
  const isOrdersZero = todayTask.ordersCompleted === 0;
  const isAllCompleted =
    todayTask.messagesSent >= 30 &&
    todayTask.ordersCompleted >= 2 &&
    todayTask.assetsCreated >= 5 &&
    todayTask.portfolioImproved;

  const getProgressColor = (current: number, target: number) => {
    const percent = (current / target) * 100;
    if (percent >= 100) return 'bg-emerald-500';
    if (percent >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const NumberInput = ({ label, value, target, field, icon: Icon }: any) => {
    const progress = Math.min(100, (value / target) * 100);
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-900">
              <Icon size={18} />
            </div>
            <span className="font-bold text-slate-800 text-xs sm:text-sm">{label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              value={value || ''}
              onChange={(e) => updateTodayTask({ [field]: Math.max(0, Number(e.target.value)) })}
              className="w-16 text-center border border-slate-200 rounded-xl p-1.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="0"
            />
            <span className="text-xs text-slate-400 font-semibold">/ {target}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full rounded-full ${getProgressColor(value, target)}`}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  const ToggleTask = ({ label, completed, onToggle }: any) => (
    <div
      onClick={onToggle}
      className={`bg-white p-4 rounded-2xl shadow-xs border flex items-center justify-between cursor-pointer transition-all ${
        completed ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className={`font-semibold text-xs sm:text-sm ${completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
        {label}
      </span>
      <button type="button" className="text-slate-400 transition-colors">
        {completed ? <CheckCircle2 className="text-emerald-600" size={22} /> : <Circle size={22} />}
      </button>
    </div>
  );

  return (
    <ScreenWrapper className="bg-slate-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white pt-8 pb-6 px-6 sm:px-8 rounded-b-3xl sm:rounded-b-[2.5rem] shadow-md">
        <h1 className="text-2xl font-extrabold tracking-tight">Daily Productivity Tasks</h1>
        <p className="text-blue-200 text-xs sm:text-sm mt-1">
          Record outreach, closed orders, practice assets, and learning minutes.
        </p>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Smart Logic Banners */}
        <AnimatePresence>
          {isAllCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs"
            >
              <Trophy className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-emerald-900 font-extrabold text-sm">Amazing work today!</h4>
                <p className="text-emerald-700 text-xs mt-0.5">
                  You have fulfilled all core daily targets. Maintain your streak!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {isMessagesLow && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs"
                >
                  <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-rose-900 font-extrabold text-xs sm:text-sm">Increase Outreach</h4>
                    <p className="text-rose-700 text-xs mt-0.5">
                      You are below the 30 messages/day target. Keep prospecting clients on FB/WhatsApp!
                    </p>
                  </div>
                </motion.div>
              )}
              {isOrdersZero && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs"
                >
                  <Lightbulb className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-amber-900 font-extrabold text-xs sm:text-sm">Focus on Conversion</h4>
                    <p className="text-amber-700 text-xs mt-0.5">
                      Follow up with previous hot leads to secure at least 1 order today.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Core Numeric Targets */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Core Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberInput label="Send Messages" value={todayTask.messagesSent} target={30} field="messagesSent" icon={MessageSquare} />
            <NumberInput label="Complete Orders" value={todayTask.ordersCompleted} target={2} field="ordersCompleted" icon={ShoppingBag} />
            <NumberInput label="Create Assets" value={todayTask.assetsCreated} target={5} field="assetsCreated" icon={ImageIcon} />
            <NumberInput label="Learning (Mins)" value={todayTask.learningMinutes} target={60} field="learningMinutes" icon={BookOpen} />
          </div>
        </div>

        {/* Business Growth Targets */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Business Growth Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberInput label="New Clients" value={todayTask.clientsObtained} target={1} field="clientsObtained" icon={Users} />
            <NumberInput label="Earnings ($ / Rs)" value={todayTask.earnings} target={50} field="earnings" icon={DollarSign} />
          </div>
        </div>

        {/* Action Items */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Practical Checkpoints
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleTask
              label="Improve Portfolio (Add 1 new sample)"
              completed={todayTask.portfolioImproved}
              onToggle={() => updateTodayTask({ portfolioImproved: !todayTask.portfolioImproved })}
            />
            {skills.map((skill) => {
              const taskDesc = SKILL_TASKS[skill];
              if (!taskDesc) return null;
              const isCompleted = todayTask.skillTasksCompleted[skill] || false;
              return (
                <ToggleTask
                  key={skill}
                  label={`[${skill}] ${taskDesc}`}
                  completed={isCompleted}
                  onToggle={() => {
                    updateTodayTask({
                      skillTasksCompleted: {
                        ...todayTask.skillTasksCompleted,
                        [skill]: !isCompleted,
                      },
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
