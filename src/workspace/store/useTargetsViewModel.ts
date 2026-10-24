import { useTasksViewModel, getTodayStr } from './useTasksViewModel';
import { DailyTaskEntity } from '../types';

export function useTargetsViewModel() {
  const { tasks, isLoaded } = useTasksViewModel();

  // Helper to get dates for current week (Monday to Sunday)
  const getWeekDates = () => {
    const curr = new Date();
    curr.setMinutes(curr.getMinutes() - curr.getTimezoneOffset());
    const first = curr.getDate() - curr.getDay() + 1; // Monday
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr);
      d.setDate(first + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Helper to get dates for current month
  const getMonthPrefix = () => {
    return getTodayStr().substring(0, 7); // YYYY-MM
  };

  const weeklyTasks = getWeekDates().map(date => tasks[date]).filter(Boolean) as DailyTaskEntity[];
  const monthlyTasks = Object.values(tasks).filter((t: DailyTaskEntity) => t.date && t.date.startsWith(getMonthPrefix())) as DailyTaskEntity[];

  const aggregate = (taskList: DailyTaskEntity[]) => {
    return taskList.reduce(
      (acc, task) => ({
        messagesSent: acc.messagesSent + (task.messagesSent || 0),
        ordersCompleted: acc.ordersCompleted + (task.ordersCompleted || 0),
        clientsObtained: acc.clientsObtained + (task.clientsObtained || 0),
        earnings: acc.earnings + (task.earnings || 0)
      }),
      { messagesSent: 0, ordersCompleted: 0, clientsObtained: 0, earnings: 0 }
    );
  };

  const weeklyStats = aggregate(weeklyTasks);
  const monthlyStats = aggregate(monthlyTasks);

  return { weeklyStats, monthlyStats, isLoaded };
}
