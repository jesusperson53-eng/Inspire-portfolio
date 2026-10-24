import { useState, useEffect } from 'react';
import { UserLearningProgressEntity } from '../types';
import { learningContent } from '../data/learningContent';

export function useLearningViewModel() {
  const [progress, setProgress] = useState<Record<string, UserLearningProgressEntity>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('inspire_learning_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to parse inspire_learning_progress', e);
      }
    }
    const initial: Record<string, UserLearningProgressEntity> = {};
    learningContent.forEach(sec => {
      initial[sec.id] = { sectionId: sec.id, isRead: false, isBookmarked: false };
    });
    setProgress(initial);
    localStorage.setItem('inspire_learning_progress', JSON.stringify(initial));
  }, []);

  const toggleRead = (sectionId: string) => {
    const updated = {
      ...progress,
      [sectionId]: {
        sectionId,
        isBookmarked: Boolean(progress[sectionId]?.isBookmarked),
        isRead: !progress[sectionId]?.isRead
      }
    };
    setProgress(updated);
    localStorage.setItem('inspire_learning_progress', JSON.stringify(updated));
  };

  const toggleBookmark = (sectionId: string) => {
    const updated = {
      ...progress,
      [sectionId]: {
        sectionId,
        isRead: Boolean(progress[sectionId]?.isRead),
        isBookmarked: !progress[sectionId]?.isBookmarked
      }
    };
    setProgress(updated);
    localStorage.setItem('inspire_learning_progress', JSON.stringify(updated));
  };

  const getProgressPercentage = () => {
    const total = learningContent.length;
    if (total === 0) return 0;
    const readCount = Object.values(progress).filter((p: UserLearningProgressEntity) => p.isRead).length;
    return Math.round((readCount / total) * 100);
  };

  const filteredContent = learningContent.filter(sec => {
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.some(
        sub =>
          sub.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  return {
    progress,
    searchQuery,
    setSearchQuery,
    toggleRead,
    toggleBookmark,
    getProgressPercentage,
    filteredContent
  };
}
