import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { coursesContent } from '../data/coursesContent';
import { shortcutsData } from '../data/shortcutsData';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { usePortfolioViewModel } from '../store/usePortfolioViewModel';
import { ArrowLeft, Search as SearchIcon, BookOpen, Keyboard, CheckSquare, ChevronRight, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyTaskEntity, PortfolioEntity } from '../types';

export function Search() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { tasks } = useTasksViewModel();
  const { files } = usePortfolioViewModel();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return null;

    const q = query.toLowerCase();

    // 1. Search Courses
    const courseResults = coursesContent.filter(
      c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    // 2. Search Topics
    const topicResults = coursesContent.flatMap(c =>
      c.chapters.flatMap(ch =>
        ch.topics
          .filter(t => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q))
          .map(t => ({ ...t, courseId: c.id, courseTitle: c.title, chapterTitle: ch.title }))
      )
    );

    // 3. Search Shortcuts
    const shortcutResults = shortcutsData.filter(
      s => s.keys.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );

    // 4. Search Tasks
    const taskResults = Object.values(tasks).filter((t: DailyTaskEntity) => t.date.includes(q));

    // 5. Search Portfolio
    const portfolioResults = files.filter(
      (f: PortfolioEntity) =>
        f.fileName.toLowerCase().includes(q) ||
        (f.tag || '').toLowerCase().includes(q) ||
        f.skillCategory.toLowerCase().includes(q)
    );

    return {
      courses: courseResults,
      topics: topicResults,
      shortcuts: shortcutResults,
      tasks: taskResults,
      portfolio: portfolioResults
    };
  }, [query, tasks, files]);

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm z-20 sticky top-0 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, topics, shortcuts..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-gray-100 border-none text-gray-800 placeholder:text-gray-400 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {!query.trim() ? (
          <div className="text-center py-20 text-gray-400">
            <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>Start typing to search across the entire app.</p>
          </div>
        ) : results ? (
          <>
            {/* Courses Results */}
            {results.courses.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen size={16} /> Courses ({results.courses.length})
                </h3>
                <div className="space-y-2">
                  {results.courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-bold text-gray-800">{course.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{course.description}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Topics Results */}
            {results.topics.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen size={16} /> Topics ({results.topics.length})
                </h3>
                <div className="space-y-2">
                  {results.topics.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => navigate(`/courses/${topic.courseId}`)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">
                          {topic.courseTitle} &bull; {topic.chapterTitle}
                        </p>
                        <h4 className="font-bold text-gray-800 text-sm truncate">{topic.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{topic.content}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Shortcuts Results */}
            {results.shortcuts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Keyboard size={16} /> Shortcuts ({results.shortcuts.length})
                </h3>
                <div className="space-y-2">
                  {results.shortcuts.map(shortcut => (
                    <div
                      key={shortcut.id}
                      onClick={() => navigate('/shortcuts')}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">
                          {shortcut.category}
                        </p>
                        <h4 className="font-bold text-gray-800 text-sm">{shortcut.description}</h4>
                      </div>
                      <div className="shrink-0 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        <span className="font-mono font-bold text-gray-700 text-xs">{shortcut.keys}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tasks Results */}
            {results.tasks.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckSquare size={16} /> Tasks ({results.tasks.length})
                </h3>
                <div className="space-y-2">
                  {results.tasks.map(task => (
                    <div
                      key={task.date}
                      onClick={() => navigate('/reports/history')}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Report: {task.date}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Messages: {task.messagesSent} | Orders: {task.ordersCompleted}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Portfolio Results */}
            {results.portfolio.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FolderOpen size={16} /> Portfolio ({results.portfolio.length})
                </h3>
                <div className="space-y-2">
                  {results.portfolio.map(file => (
                    <div
                      key={file.id}
                      onClick={() => navigate('/portfolio')}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">
                          {file.portfolioType === 'showcase' ? 'Client Showcase' : 'Practice Lab'} &bull;{' '}
                          {file.skillCategory}
                        </p>
                        <h4 className="font-bold text-gray-800 text-sm truncate">{file.fileName}</h4>
                        {file.tag && <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{file.tag}</p>}
                      </div>
                      <ChevronRight size={20} className="text-gray-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {results.courses.length === 0 &&
              results.topics.length === 0 &&
              results.shortcuts.length === 0 &&
              results.tasks.length === 0 &&
              results.portfolio.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <p>No results found for "{query}"</p>
                </div>
              )}
          </>
        ) : null}
      </div>
    </ScreenWrapper>
  );
}
