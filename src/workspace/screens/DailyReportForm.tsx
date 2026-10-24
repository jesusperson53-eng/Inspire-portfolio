import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useReportsViewModel } from '../store/useReportsViewModel';
import { useTasksViewModel, getTodayStr } from '../store/useTasksViewModel';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

export function DailyReportForm() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { saveDailyReport, getYesterdayMistake } = useReportsViewModel();
  const { todayTask } = useTasksViewModel();

  const today = getTodayStr();
  const yesterdayMistake = getYesterdayMistake();

  const [formData, setFormData] = useState({
    id: today,
    date: today,
    messagesSent: todayTask.messagesSent || 0,
    repliesReceived: 0,
    ordersTaken: 0,
    ordersCompleted: todayTask.ordersCompleted || 0,
    earnings: todayTask.earnings || 0,
    newAccounts: todayTask.assetsCreated || 0,
    newClients: todayTask.clientsObtained || 0,
    problemsFaced: '',
    nextDayPlan: ''
  });

  const isValid = formData.problemsFaced.trim() !== '' && formData.nextDayPlan.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    saveDailyReport(formData);
    navigate('/workspace/reports');
  };

  const InputRow = ({ label, field, type = 'number' }: any) => (
    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={(formData as any)[field]}
        onChange={e =>
          setFormData({
            ...formData,
            [field]: type === 'number' ? Math.max(0, Number(e.target.value)) : e.target.value
          })
        }
        className="w-20 text-center border border-gray-200 rounded-lg p-1.5 text-sm font-bold focus:outline-none focus:border-blue-500"
      />
    </div>
  );

  return (
    <ScreenWrapper className="bg-gray-50">
      <div className="bg-blue-900 text-white pt-12 pb-6 px-6 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Daily Report</h1>
          <p className="text-blue-200 text-xs mt-0.5">{today}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {yesterdayMistake && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-yellow-800 font-bold text-sm">Yesterday's Problem</h4>
              <p className="text-yellow-700 text-xs mt-0.5 italic">"{yesterdayMistake}"</p>
              <p className="text-yellow-800 text-xs mt-1 font-medium">Did you improve on this today?</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Metrics</h3>
          <InputRow label="Messages Sent" field="messagesSent" />
          <InputRow label="Replies Received" field="repliesReceived" />
          <InputRow label="Orders Taken" field="ordersTaken" />
          <InputRow label="Orders Completed" field="ordersCompleted" />
          <InputRow label="Earnings (Rs)" field="earnings" />
          <InputRow label="New Accounts" field="newAccounts" />
          <InputRow label="New Clients" field="newClients" />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Reflection</h3>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problems Faced Today <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.problemsFaced}
              onChange={e => setFormData({ ...formData, problemsFaced: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
              placeholder="What challenges did you encounter?"
            />
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Day Plan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.nextDayPlan}
              onChange={e => setFormData({ ...formData, nextDayPlan: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
              placeholder="What is your focus for tomorrow?"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} /> Save Report
        </button>
      </div>
    </ScreenWrapper>
  );
}
