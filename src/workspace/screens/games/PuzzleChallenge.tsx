import { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useSafeBack } from '../../lib/utils';
import { puzzleWorkflows } from '../../data/gamesContent';
import { useGamesViewModel } from '../../store/useGamesViewModel';
import { ArrowLeft, GripVertical, CheckCircle2, Trophy } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

export function PuzzleChallenge() {
  const goBack = useSafeBack('/workspace/games');
  const { addXP, updateHighScore } = useGamesViewModel();

  const [level, setLevel] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [score, setScore] = useState(0);
  const [completedAll, setCompletedAll] = useState(false);

  const currentPuzzle = puzzleWorkflows[level];

  useEffect(() => {
    if (currentPuzzle) {
      const shuffled = [...currentPuzzle.steps].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setIsCorrect(false);
      setWrongAttempt(false);
    }
  }, [level, currentPuzzle]);

  const endGame = (finalScore: number) => {
    addXP(finalScore);
    updateHighScore('puzzle', finalScore);
    setCompletedAll(true);
  };

  const checkOrder = () => {
    const correct = items.every((item, index) => item === currentPuzzle.steps[index]);
    setIsCorrect(correct);
    setWrongAttempt(!correct);

    if (correct) {
      const nextScore = score + 100;
      setScore(nextScore);
      setTimeout(() => {
        if (level < puzzleWorkflows.length - 1) {
          setLevel(l => l + 1);
        } else {
          endGame(nextScore);
        }
      }, 1200);
    }
  };

  if (completedAll) {
    return (
      <ScreenWrapper className="bg-blue-50 pb-24 flex flex-col">
        <div className="bg-blue-600 text-white pt-12 pb-4 px-6 flex items-center justify-between shadow-md z-10">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="font-bold">Completed</div>
          <div className="font-bold text-yellow-300">Score: {score}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Trophy size={64} className="text-yellow-500 mb-4" />
          <h1 className="text-3xl font-black text-blue-900 mb-2">All Puzzles Completed!</h1>
          <p className="text-lg text-blue-700 font-semibold mb-8">Final Score: {score}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
          >
            Back to Games
          </button>
        </div>
      </ScreenWrapper>
    );
  }

  if (!currentPuzzle) return null;

  return (
    <ScreenWrapper className="bg-blue-50 pb-24 flex flex-col">
      <div className="bg-blue-600 text-white pt-12 pb-4 px-6 flex items-center justify-between shadow-md z-10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="font-bold">Level {level + 1}</div>
        <div className="font-bold text-yellow-300">Score: {score}</div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-blue-900 mb-2">{currentPuzzle.title}</h2>
          <p className="text-blue-600 font-medium">Drag and drop to arrange the steps in the correct order.</p>
          {wrongAttempt && (
            <p className="text-red-500 text-xs font-bold mt-2">Not quite right yet — keep rearranging the steps!</p>
          )}
        </div>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3 flex-1">
          {items.map((item) => (
            <Reorder.Item
              key={item}
              value={item}
              className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center gap-4 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="text-blue-300" />
              <span className="font-semibold text-gray-700">{item}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="mt-8">
          {isCorrect ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-500 text-white p-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 size={24} /> Perfect Order!
            </motion.div>
          ) : (
            <button
              onClick={checkOrder}
              className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors active:scale-95"
            >
              Check Answer
            </button>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
}
