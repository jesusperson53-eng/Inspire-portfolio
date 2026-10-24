import { useState, useEffect } from 'react';
import { GameProgress } from '../types/learning';

export function useGamesViewModel() {
  const [progress, setProgress] = useState<GameProgress>({
    xp: 0,
    level: 1,
    highScores: {}
  });

  useEffect(() => {
    const stored = localStorage.getItem('inspire_game_progress');
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse inspire_game_progress', e);
      }
    }
  }, []);

  const addXP = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const updated = { ...prev, xp: newXp, level: newLevel };
      localStorage.setItem('inspire_game_progress', JSON.stringify(updated));
      return updated;
    });
  };

  const updateHighScore = (gameId: string, score: number) => {
    setProgress(prev => {
      const currentHigh = prev.highScores[gameId] || 0;
      if (score > currentHigh) {
        const updated = {
          ...prev,
          highScores: { ...prev.highScores, [gameId]: score }
        };
        localStorage.setItem('inspire_game_progress', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  return {
    progress,
    addXP,
    updateHighScore
  };
}
