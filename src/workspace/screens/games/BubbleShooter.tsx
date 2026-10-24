import { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useSafeBack } from '../../lib/utils';
import { quizQuestions } from '../../data/gamesContent';
import { useGamesViewModel } from '../../store/useGamesViewModel';
import { ArrowLeft, CircleDashed, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BubbleItem {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
  color: string;
}

export function BubbleShooter() {
  const goBack = useSafeBack('/workspace/games');
  const { addXP, updateHighScore } = useGamesViewModel();

  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [message, setMessage] = useState('');

  const question = quizQuestions[qIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        handlePop(question.options[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => {
    if (gameOver) return;

    const newBubbles = question.options.map((opt, i) => ({
      id: i,
      text: opt,
      x: Math.random() * 60 + 20, // 20% to 80%
      y: Math.random() * 40 + 20, // 20% to 60%
      delay: i * 0.2,
      color: ['bg-cyan-400', 'bg-blue-400', 'bg-indigo-400', 'bg-purple-400'][i % 4]
    }));

    setBubbles(newBubbles);
  }, [qIndex, gameOver, question]);

  const handlePop = (ans: string) => {
    if (gameOver) return;

    if (ans === question.a) {
      const points = 10 * (combo + 1);
      setScore(s => s + points);
      setCombo(c => c + 1);
      setMessage(`POP! +${points}`);

      setTimeout(() => {
        setQIndex(prev => (prev + 1) % quizQuestions.length);
        setMessage('');
      }, 500);
    } else {
      setCombo(0);
      setMessage('Wrong Bubble!');
      setTimeout(() => setMessage(''), 1000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    addXP(score);
    updateHighScore('bubble', score);
  };

  return (
    <ScreenWrapper className="bg-cyan-950 text-white pb-24 flex flex-col">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/10 z-20 relative">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 text-yellow-400 font-bold">
          <Star size={16} className="fill-current" /> Combo x{combo}
        </div>
        <div className="font-bold text-cyan-300">Score: {score}</div>
      </div>

      {!gameOver ? (
        <div className="flex-1 relative flex flex-col">
          <div className="p-6 text-center z-20 relative">
            <h2 className="text-xl font-bold text-white/90 drop-shadow-md">{question.q}</h2>
          </div>

          <div className="flex-1 relative">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-white z-30 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
              >
                {message}
              </motion.div>
            )}

            <AnimatePresence>
              {bubbles.map((b) => (
                <motion.button
                  key={b.id}
                  initial={{ opacity: 0, scale: 0, y: 100 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    left: `${b.x}%`,
                    top: `${b.y}%`
                  }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 50,
                    delay: b.delay,
                    y: {
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }
                  }}
                  onClick={() => handlePop(b.text)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full ${b.color} bg-opacity-30 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center p-3 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] active:scale-90 transition-transform`}
                >
                  <div className="absolute top-2 right-4 w-4 h-4 bg-white/40 rounded-full blur-[1px]" />
                  <span className="font-bold text-sm text-center drop-shadow-md leading-tight">{b.text}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 z-20 relative">
            <button
              onClick={endGame}
              className="w-full bg-red-500/20 text-red-300 border border-red-500/50 py-3 rounded-xl font-bold hover:bg-red-500/30 transition-colors"
            >
              End Game
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center z-20 relative">
          <CircleDashed size={64} className="text-cyan-400 mb-6 animate-spin" />
          <h1 className="text-5xl font-black text-white mb-2 tracking-widest">GAME OVER</h1>
          <p className="text-2xl mb-8 text-cyan-200">
            Final Score: <span className="text-white font-bold">{score}</span>
          </p>
          <button
            onClick={goBack}
            className="bg-cyan-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-500 transition-colors shadow-[0_0_20px_rgba(8,145,178,0.5)]"
          >
            Back to Games
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
