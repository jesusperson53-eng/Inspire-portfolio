import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useReportsViewModel } from '../store/useReportsViewModel';
import { useTargetsViewModel } from '../store/useTargetsViewModel';
import { ArrowLeft, Save } from 'lucide-react';

export function MonthlyReportForm() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { saveMonthlyReport } = useReportsViewModel();
  const { monthlyStats } = useTargetsViewModel();

  const getMonthId = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().substring(0, 7); // YYYY-MM
  };

  const monthId = getMonthId();

  const [formData, setFormData] = useState({
    id: monthId,
    month: monthId,
    totalEarnings: monthlyStats.earnings || 0,
    totalClients: monthlyStats.clientsObtained || 0,
    totalOrders: monthlyStats.ordersCompleted || 0,
    topServices: '',
    biggestAchievement: '',
    biggestMistake: '',
    nextMonthTarget: ''
  });

  const isValid = formData.biggestAchievement.trim() !== '' && formData.nextMonthTarget.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    saveMonthlyReport(formData);
    navigate('/workspace/reports');
  };

  const StatBox = ({ label, value }: { label: string; value: number }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-purple-900">{value}</p>
    </div>
  );

  return (
    <ScreenWrapper className="bg-gray-50">
      <div className="bg-purple-900 text-white pt-12 pb-6 px-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Monthly Report</h1>
          <p className="text-purple-200 text-xs mt-0.5">{monthId}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Monthly Totals</h3>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Earnings" value={formData.totalEarnings} />
            <StatBox label="Orders" value={formData.totalOrders} />
            <StatBox label="Clients" value={formData.totalClients} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Review & Planning</h3>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Top 3 Services</label>
            <input
              type="text"
              value={formData.topServices}
              onChange={e => setFormData({ ...formData, topServices: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500"
              placeholder="e.g. Graphic Design (Photoshop), CapCut Video Editing"
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biggest Achievement <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.biggestAchievement}
              onChange={e => setFormData({ ...formData, biggestAchievement: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 min-h-[80px]"
              placeholder="What are you most proud of this month?"
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Biggest Mistake</label>
            <textarea
              value={formData.biggestMistake}
              onChange={e => setFormData({ ...formData, biggestMistake: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 min-h-[80px]"
              placeholder="What did you learn the hard way?"
            />
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Month Target <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.nextMonthTarget}
              onChange={e => setFormData({ ...formData, nextMonthTarget: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 min-h-[80px]"
              placeholder="Set your primary goal for next month."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
            isValid
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} /> Save Monthly Report
        </button>
      </div>
    </ScreenWrapper>
  );
}
