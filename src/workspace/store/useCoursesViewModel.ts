import { useState, useEffect } from 'react';
import { UserCourseProgress } from '../types/learning';

export function useCoursesViewModel() {
  const [progress, setProgress] = useState<Record<string, UserCourseProgress>>({});

  useEffect(() => {
    const stored = localStorage.getItem('inspire_course_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse inspire_course_progress', e);
      }
    }
  }, []);

  const markTopicComplete = (courseId: string, topicId: string) => {
    const courseProgress = progress[courseId] || { courseId, completedTopics: [] };
    if (!courseProgress.completedTopics) {
      courseProgress.completedTopics = [];
    }

    if (!courseProgress.completedTopics.includes(topicId)) {
      const updated = {
        ...progress,
        [courseId]: {
          ...courseProgress,
          completedTopics: [...courseProgress.completedTopics, topicId]
        }
      };
      setProgress(updated);
      localStorage.setItem('inspire_course_progress', JSON.stringify(updated));
    }
  };

  const getCourseProgress = (courseId: string, totalTopics: number) => {
    if (totalTopics === 0) return 0;
    const completed = progress[courseId]?.completedTopics?.length || 0;
    return Math.round((completed / totalTopics) * 100);
  };

  return {
    progress,
    markTopicComplete,
    getCourseProgress
  };
}
