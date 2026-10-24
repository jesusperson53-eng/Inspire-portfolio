import { useState, useEffect } from 'react';
import { DailyReportEntity, WeeklyReportEntity, MonthlyReportEntity } from '../types';
import { useTasksViewModel, getTodayStr } from './useTasksViewModel';

export function useReportsViewModel() {
  const [dailyReports, setDailyReports] = useState<Record<string, DailyReportEntity>>({});
  const [weeklyReports, setWeeklyReports] = useState<Record<string, WeeklyReportEntity>>({});
  const [monthlyReports, setMonthlyReports] = useState<Record<string, MonthlyReportEntity>>({});
  const { tasks, streak } = useTasksViewModel();

  useEffect(() => {
    try {
      const d = localStorage.getItem('inspire_daily_reports');
      const w = localStorage.getItem('inspire_weekly_reports');
      const m = localStorage.getItem('inspire_monthly_reports');
      if (d) setDailyReports(JSON.parse(d));
      if (w) setWeeklyReports(JSON.parse(w));
      if (m) setMonthlyReports(JSON.parse(m));
    } catch (e) {
      console.error('Failed to parse reports from localStorage', e);
    }
  }, []);

  const saveDailyReport = (report: DailyReportEntity) => {
    const updated = { ...dailyReports, [report.id]: report };
    setDailyReports(updated);
    localStorage.setItem('inspire_daily_reports', JSON.stringify(updated));
  };

  const saveWeeklyReport = (report: WeeklyReportEntity) => {
    const updated = { ...weeklyReports, [report.id]: report };
    setWeeklyReports(updated);
    localStorage.setItem('inspire_weekly_reports', JSON.stringify(updated));
  };

  const saveMonthlyReport = (report: MonthlyReportEntity) => {
    const updated = { ...monthlyReports, [report.id]: report };
    setMonthlyReports(updated);
    localStorage.setItem('inspire_monthly_reports', JSON.stringify(updated));
  };

  const deleteReport = (type: 'daily' | 'weekly' | 'monthly', id: string) => {
    if (type === 'daily') {
      const updated = { ...dailyReports };
      delete updated[id];
      setDailyReports(updated);
      localStorage.setItem('inspire_daily_reports', JSON.stringify(updated));
    } else if (type === 'weekly') {
      const updated = { ...weeklyReports };
      delete updated[id];
      setWeeklyReports(updated);
      localStorage.setItem('inspire_weekly_reports', JSON.stringify(updated));
    } else {
      const updated = { ...monthlyReports };
      delete updated[id];
      setMonthlyReports(updated);
      localStorage.setItem('inspire_monthly_reports', JSON.stringify(updated));
    }
  };

  // Analytics Engine
  const getPerformanceScore = () => {
    const today = getTodayStr();
    const task = tasks[today] || { messagesSent: 0, ordersCompleted: 0 };
    const msgScore = Math.min(1, (task.messagesSent || 0) / 30) * 40;
    const ordScore = Math.min(1, (task.ordersCompleted || 0) / 2) * 40;
    const consScore = Math.min(1, streak / 7) * 20;
    return Math.round(msgScore + ordScore + consScore);
  };

  const getInsights = () => {
    const today = getTodayStr();
    const task = tasks[today] || { messagesSent: 0, ordersCompleted: 0, earnings: 0 };
    const report = dailyReports[today];
    const insights: Array<{ type: 'warning' | 'success'; text: string }> = [];

    if ((task.messagesSent || 0) < 30) {
      insights.push({ type: 'warning', text: 'Increase outreach. Messages are below the 30/day target.' });
    }
    if (report && report.repliesReceived < (task.messagesSent || 0) * 0.1) {
      insights.push({ type: 'warning', text: 'Improve message quality. Reply rate is below 10%.' });
    }
    if ((task.ordersCompleted || 0) === 0) {
      insights.push({ type: 'warning', text: 'Focus on closing deals. No orders completed today.' });
    }

    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterdayStr = d.toISOString().split('T')[0];
    const yesterdayTask = tasks[yesterdayStr];

    if (yesterdayTask && (task.earnings || 0) > (yesterdayTask.earnings || 0)) {
      insights.push({ type: 'success', text: 'Good progress! Earnings are higher than yesterday.' });
    }

    if (insights.length === 0) {
      insights.push({ type: 'success', text: 'You are on track! Keep up the good work.' });
    }

    return insights;
  };

  const getWeeklySummary = () => {
    const d = new Date();
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(d);
      date.setDate(d.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    let bestDay = { date: '-', score: -1 };
    let worstDay = { date: '-', score: 999999 };
    let currentWeekEarnings = 0;
    let lastWeekEarnings = 0;

    last7Days.forEach(date => {
      const task = tasks[date];
      if (task) {
        const score = (task.ordersCompleted || 0) * 10 + (task.messagesSent || 0);
        if (score > bestDay.score) bestDay = { date, score };
        if (score < worstDay.score) worstDay = { date, score };
        currentWeekEarnings += task.earnings || 0;
      } else {
        if (0 < worstDay.score) worstDay = { date, score: 0 };
      }
    });

    for (let i = 7; i < 14; i++) {
      const date = new Date(d);
      date.setDate(d.getDate() - i);
      const task = tasks[date.toISOString().split('T')[0]];
      if (task) lastWeekEarnings += task.earnings || 0;
    }

    const growth =
      lastWeekEarnings === 0
        ? currentWeekEarnings > 0
          ? 100
          : 0
        : Math.round(((currentWeekEarnings - lastWeekEarnings) / lastWeekEarnings) * 100);

    return {
      bestDay: bestDay.date,
      worstDay: worstDay.date,
      growth,
      chartData: last7Days.reverse().map(date => ({
        date: date.substring(5), // MM-DD
        earnings: tasks[date]?.earnings || 0
      }))
    };
  };

  const getYesterdayMistake = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterdayStr = d.toISOString().split('T')[0];
    return dailyReports[yesterdayStr]?.problemsFaced || null;
  };

  return {
    dailyReports,
    weeklyReports,
    monthlyReports,
    saveDailyReport,
    saveWeeklyReport,
    saveMonthlyReport,
    deleteReport,
    getPerformanceScore,
    getInsights,
    getWeeklySummary,
    getYesterdayMistake
  };
}
