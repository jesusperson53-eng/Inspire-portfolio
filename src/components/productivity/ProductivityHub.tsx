import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Target,
  Key,
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate: string;
}

interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export const ProductivityHub: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'tasks' | 'goals' | 'shortcuts' | 'radar'>('tasks');

  // Tasks state with localStorage persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('inspire_productivity_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', title: 'Complete React 19 forwardRef and Actions module', priority: 'high', completed: true, dueDate: '2026-10-20' },
      { id: '2', title: 'Debug MongoDB aggregation pipeline for e-commerce search', priority: 'high', completed: false, dueDate: '2026-10-21' },
      { id: '3', title: 'Read WCAG 2.1 AA accessibility contrast rules', priority: 'medium', completed: false, dueDate: '2026-10-22' },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    localStorage.setItem('inspire_productivity_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Shortcut Vault list
  const shortcuts = [
    { category: 'VS Code', key: 'Ctrl + Shift + P / Cmd + Shift + P', desc: 'Command Palette' },
    { category: 'VS Code', key: 'Alt + Up / Down', desc: 'Move Line Up or Down' },
    { category: 'VS Code', key: 'Ctrl + D / Cmd + D', desc: 'Select Next Occurrence' },
    { category: 'Git', key: 'git checkout -b <branch>', desc: 'Create & Switch to New Branch' },
    { category: 'Git', key: 'git stash save && git stash pop', desc: 'Temporarily Stash Uncommitted Code' },
    { category: 'Git', key: 'git log --oneline --graph', desc: 'Compact Git Visual History' },
    { category: 'Figma', key: 'Alt + Drag', desc: 'Duplicate Component Instance' },
    { category: 'Figma', key: 'Shift + A', desc: 'Apply Auto Layout Frame' },
    { category: 'Linux Terminal', key: 'Ctrl + R', desc: 'Reverse History Search' },
    { category: 'Linux Terminal', key: 'tail -f logs.txt', desc: 'Follow Live Log Streams' },
  ];

  // Self assessment radar skills
  const skillsChecklist = [
    { title: 'Semantic HTML5 & Accessibility Tree', level: 95 },
    { title: 'Modern CSS3 & Tailwind Grid Systems', level: 90 },
    { title: 'TypeScript Strict Typing & Generics', level: 85 },
    { title: 'React 19 Hooks & Server Actions', level: 88 },
    { title: 'RESTful API & Middleware Architecture', level: 82 },
    { title: 'Database Indexing & Query Profiling', level: 80 },
    { title: 'Git Branching & Pull Request Workflows', level: 92 },
    { title: 'Cloud Containerization with Docker', level: 75 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5 text-blue-800" />
          <span>Student Productivity Suite</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Personal Productivity & Development Toolkit
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Self-contained study planner, developer hotkey vault, and personal skill tracking. Operates 100% offline via local storage.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTool('tasks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'tasks' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Daily Learning Tasks ({tasks.filter((t) => !t.completed).length})</span>
        </button>

        <button
          onClick={() => setActiveTool('shortcuts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'shortcuts' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Command className="w-4 h-4" />
          <span>Developer Shortcut Vault</span>
        </button>

        <button
          onClick={() => setActiveTool('radar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'radar' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Skills Self-Assessment</span>
        </button>
      </div>

      {/* Tool 1: Tasks */}
      {activeTool === 'tasks' && (
        <div className="space-y-6">
          {/* Add task bar */}
          <form onSubmit={addTask} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              required
              placeholder="Add study objective, coding milestone, or bug to fix..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="w-full sm:w-36 px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
            >
              Add Objective
            </button>
          </form>

          {/* Tasks List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">All objectives completed! Add a new task above.</div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900 cursor-pointer"
                    />
                    <div>
                      <span
                        className={`text-xs sm:text-sm font-semibold block ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tool 2: Shortcut Vault */}
      {activeTool === 'shortcuts' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              High-Velocity Engineering Shortcuts
            </span>
            <span className="text-[11px] text-slate-400">Industry Standards</span>
          </div>

          <div className="divide-y divide-slate-100">
            {shortcuts.map((sc, idx) => (
              <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-bold text-[10px] uppercase tracking-wider">
                    {sc.category}
                  </span>
                  <span className="font-semibold text-slate-800">{sc.desc}</span>
                </div>
                <kbd className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800 font-mono text-[11px] font-bold shadow-2xs self-start sm:self-auto">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool 3: Skills Radar Checklist */}
      {activeTool === 'radar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h4 className="text-base font-extrabold text-slate-900">Curriculum Proficiency Checklist</h4>
            <p className="text-xs text-slate-500 mt-1">
              Self-assessment tracking across essential full-stack and systems competencies.
            </p>
          </div>

          <div className="space-y-4">
            {skillsChecklist.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.title}</span>
                  <span className="font-mono text-slate-500 font-semibold">{item.level}% Target</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-900 to-indigo-600 transition-all duration-500"
                    style={{ width: `${item.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
