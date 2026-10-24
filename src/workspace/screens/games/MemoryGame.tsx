import { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useSafeBack } from '../../lib/utils';
import { memoryCardsData } from '../../data/gamesContent';
import { useGamesViewModel } from '../../store/useGamesViewModel';
import { ArrowLeft, BrainCircuit, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MemoryGame() {
  const goBack = useSafeBack('/workspace/games');
  const { addXP, updateHighScore } = useGamesViewModel();

  const [cards] = useState(() => [...memoryCardsData].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);

      if (card1 && card2 && card1.pairId === card2.pairId) {
        setMatched(prev => [...prev, card1.pairId]);
        setScore(s => s + 50);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === memoryCardsData.length / 2 && !gameWon) {
      const timer = setTimeout(() => {
        const finalScore = score + 100;
        addXP(finalScore);
        updateHighScore('memory', finalScore);
        setScore(finalScore);
        setGameWon(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [matched, score, gameWon, addXP, updateHighScore]);

  const handleFlip = (id: number) => {
    if (
      flipped.length < 2 &&
      !flipped.includes(id) &&
      !matched.includes(cards.find(c => c.id === id)?.pairId || '')
    ) {
      setFlipped(prev => [...prev, id]);
    }
  };

  return (
    <ScreenWrapper className="bg-purple-50 pb-24 flex flex-col">
      <div className="bg-purple-600 text-white pt-12 pb-4 px-6 flex items-center justify-between shadow-md z-10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="font-bold">Moves: {moves}</div>
        <div className="font-bold text-yellow-300">Score: {score}</div>
      </div>

      {gameWon ? (
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          <Trophy size={64} className="text-purple-600 mb-4" />
          <h2 className="text-3xl font-black text-purple-900 mb-2">You Won in {moves} Moves!</h2>
          <p className="text-lg text-purple-700 font-bold mb-8">Final Score: {score}</p>
          <button
            onClick={goBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-md"
          >
            Back to Games
          </button>
        </div>
      ) : (
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <BrainCircuit size={48} className="text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-purple-900 mb-2">Memory Match</h2>
            <p className="text-purple-600 font-medium">Find the matching concepts</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.pairId);
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleFlip(card.id)}
                  className={`aspect-square rounded-2xl flex items-center justify-center p-4 text-center cursor-pointer shadow-sm border transition-all duration-300 ${
                    isFlipped ? 'bg-white border-purple-200' : 'bg-purple-500 border-purple-600 hover:bg-purple-400'
                  }`}
                  style={{ perspective: 1000 }}
                >
                  <AnimatePresence>
                    {isFlipped && (
                      <motion.div
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="font-bold text-purple-900 text-sm"
                      >
                        {card.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </ScreenWrapper>
  );
}
