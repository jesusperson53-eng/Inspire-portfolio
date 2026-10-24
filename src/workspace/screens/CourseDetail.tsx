import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { coursesContent } from '../data/coursesContent';
import { useCoursesViewModel } from '../store/useCoursesViewModel';
import { useTasksViewModel } from '../store/useTasksViewModel';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CourseDetail() {
  const { id } = useParams();
  const goBack = useSafeBack('/workspace/courses');
  const { progress, markTopicComplete } = useCoursesViewModel();
  const { todayTask, updateTodayTask } = useTasksViewModel();

  const course = coursesContent.find(c => c.id === id);
  const courseProgress = progress[id || '']?.completedTopics || [];

  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  if (!course) {
    return (
      <ScreenWrapper className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-700 font-bold">Course not found</p>
        <button onClick={goBack} className="mt-4 text-blue-600 font-semibold">
          Go Back
        </button>
      </ScreenWrapper>
    );
  }

  const totalTopics = course.chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0);

  const handleComplete = (topicId: string) => {
    markTopicComplete(course.id, topicId);
    updateTodayTask({ topicsRead: (todayTask.topicsRead || 0) + 1 });

    // Find next topic to auto-expand
    let foundCurrent = false;
    let nextTopicId: string | null = null;
    let nextChapterId: string | null = null;

    for (const chapter of course.chapters) {
      for (const topic of chapter.topics) {
        if (foundCurrent) {
          nextTopicId = topic.id;
          nextChapterId = chapter.id;
          break;
        }
        if (topic.id === topicId) {
          foundCurrent = true;
        }
      }
      if (nextTopicId) break;
    }

    if (nextTopicId && nextChapterId) {
      setActiveChapter(nextChapterId);
      setActiveTopic(nextTopicId);
    } else {
      setActiveTopic(null);
    }
  };

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className={`${course.color} text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative`}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-white/80 text-sm mt-1">
              {courseProgress.length} of {totalTopics} topics completed
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {course.chapters.map((chapter, index) => {
          const isChapterActive = activeChapter === chapter.id;
          const chapterCompletedTopics = chapter.topics.filter(t => courseProgress.includes(t.id)).length;
          const isChapterCompleted = chapterCompletedTopics === chapter.topics.length;

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                onClick={() => setActiveChapter(isChapterActive ? null : chapter.id)}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="shrink-0">
                  {isChapterCompleted ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <Circle size={24} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-base ${isChapterCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {chapterCompletedTopics} / {chapter.topics.length} Topics
                  </p>
                </div>
                {isChapterActive ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </div>

              <AnimatePresence>
                {isChapterActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 bg-gray-50/30"
                  >
                    <div className="p-2 space-y-2">
                      {chapter.topics.map((topic, tIndex) => {
                        const isTopicCompleted = courseProgress.includes(topic.id);
                        const isTopicActive = activeTopic === topic.id;

                        return (
                          <div key={topic.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div
                              onClick={() => setActiveTopic(isTopicActive ? null : topic.id)}
                              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <div className="shrink-0">
                                {isTopicCompleted ? (
                                  <CheckCircle size={18} className="text-green-500" />
                                ) : (
                                  <Circle size={18} className="text-gray-300" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4
                                  className={`font-semibold text-sm ${
                                    isTopicCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
                                  }`}
                                >
                                  {tIndex + 1}. {topic.title}
                                </h4>
                              </div>
                              <PlayCircle
                                size={16}
                                className={`text-gray-400 transition-transform ${isTopicActive ? 'rotate-90' : ''}`}
                              />
                            </div>

                            <AnimatePresence>
                              {isTopicActive && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden border-t border-gray-50"
                                >
                                  <div className="p-4 bg-gray-50/80">
                                    <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                                      {topic.content}
                                    </p>

                                    {!isTopicCompleted ? (
                                      <button
                                        onClick={() => handleComplete(topic.id)}
                                        className={`w-full py-2.5 rounded-lg font-bold text-white shadow-sm transition-transform active:scale-95 text-sm ${course.color}`}
                                      >
                                        Mark as Read
                                      </button>
                                    ) : (
                                      <div className="w-full py-2.5 rounded-lg font-bold text-green-600 bg-green-50 text-center border border-green-100 flex items-center justify-center gap-2 text-sm">
                                        <CheckCircle size={16} /> Read
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </ScreenWrapper>
  );
}
