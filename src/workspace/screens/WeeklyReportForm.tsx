import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useReportsViewModel } from '../store/useReportsViewModel';
import { useTargetsViewModel } from '../store/useTargetsViewModel';
import { useSkillsViewModel } from '../store/useSkillsViewModel';
import { ArrowLeft, Save } from 'lucide-react';

export function WeeklyReportForm() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { saveWeeklyReport } = useReportsViewModel();
  const { weeklyStats } = useTargetsViewModel();
  const { skills } = useSkillsViewModel();

  const getWeekNumber = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const startDate = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return `${d.getFullYear()}-W${Math.ceil(days / 7)}`;
  };

  const weekId = getWeekNumber();

  const [formData, setFormData] = useState({
    id: weekId,
    weekNumber: weekId,
    totalMessages: weeklyStats.messagesSent || 0,
    totalClients: weeklyStats.clientsObtained || 0,
    totalOrders: weeklyStats.ordersCompleted || 0,
    totalEarnings: weeklyStats.earnings || 0,
    bestService: skills[0] || 'Other',
    weakPoint: '',
    nextWeekGoal: ''
  });

  const isValid = formData.weakPoint.trim() !== '' && formData.nextWeekGoal.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    saveWeeklyReport(formData);
    navigate('/workspace/reports');
  };

  const StatBox = ({ label, value }: { label: string; value: number }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-blue-900">{value}</p>
    </div>
  );

  return (
    <ScreenWrapper className="bg-gray-50">
      <div className="bg-indigo-900 text-white pt-12 pb-6 px-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Weekly Report</h1>
          <p className="text-indigo-200 text-xs mt-0.5">{weekId}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Auto-Calculated Totals</h3>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Total Messages" value={formData.totalMessages} />
            <StatBox label="Total Orders" value={formData.totalOrders} />
            <StatBox label="Total Clients" value={formData.totalClients} />
            <StatBox label="Total Earnings" value={formData.totalEarnings} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Review</h3>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Best Working Service</label>
            <select
              value={formData.bestService}
              onChange={e => setFormData({ ...formData, bestService: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white"
            >
              {skills.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weak Point <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.weakPoint}
              onChange={e => setFormData({ ...formData, weakPoint: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 min-h-[80px]"
              placeholder="What didn't work well this week?"
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Week Goal <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.nextWeekGoal}
              onChange={e => setFormData({ ...formData, nextWeekGoal: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 min-h-[80px]"
              placeholder="Set a clear goal for next week."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
            isValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} /> Save Weekly Report
        </button>
      </div>
    </ScreenWrapper>
  );
}
