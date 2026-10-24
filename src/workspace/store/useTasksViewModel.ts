import { useState, useEffect } from 'react';
import { DailyTaskEntity } from '../types';

export const getTodayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const defaultTask: DailyTaskEntity = {
  date: getTodayStr(),
  messagesSent: 0,
  ordersCompleted: 0,
  assetsCreated: 0,
  portfolioImproved: false,
  learningMinutes: 0,
  clientsObtained: 0,
  earnings: 0,
  skillTasksCompleted: {}
};

export function useTasksViewModel() {
  const [tasks, setTasks] = useState<Record<string, DailyTaskEntity>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inspire_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse inspire_tasks', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const todayStr = getTodayStr();
  const todayTask = tasks[todayStr] || { ...defaultTask, date: todayStr };

  const updateTodayTask = (updates: Partial<DailyTaskEntity>) => {
    setTasks(prev => {
      const current = prev[todayStr] || { ...defaultTask, date: todayStr };
      const updated = { ...prev, [todayStr]: { ...current, ...updates } };
      localStorage.setItem('inspire_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const calculateStreak = () => {
    let streak = 0;
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

    const tStr = d.toISOString().split('T')[0];
    const todayT = tasks[tStr];

    const isActive = (t: DailyTaskEntity | undefined) => {
      return Boolean(
        t &&
          (t.messagesSent >= 10 ||
            t.ordersCompleted >= 1 ||
            t.portfolioImproved ||
            (t.topicsRead && t.topicsRead > 0))
      );
    };

    if (isActive(todayT)) {
      streak++;
    }

    d.setDate(d.getDate() - 1);
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      const t = tasks[dateStr];
      if (isActive(t)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  const getStreakReward = () => {
    if (streak >= 30) return 'Pro Level';
    if (streak >= 7) return 'Good Consistency';
    if (streak >= 3) return 'On Fire';
    return 'Keep Going';
  };

  return { tasks, todayTask, updateTodayTask, streak, streakReward: getStreakReward(), isLoaded };
}
