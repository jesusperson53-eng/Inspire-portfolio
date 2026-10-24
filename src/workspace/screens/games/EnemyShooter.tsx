import { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useSafeBack } from '../../lib/utils';
import { quizQuestions } from '../../data/gamesContent';
import { useGamesViewModel } from '../../store/useGamesViewModel';
import { ArrowLeft, Crosshair, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function EnemyShooter() {
  const goBack = useSafeBack('/workspace/games');
  const { addXP, updateHighScore } = useGamesViewModel();

  const [qIndex, setQIndex] = useState(0);
  const [hp, setHp] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [enemyPos, setEnemyPos] = useState({ x: 50, y: 20 });
  const [message, setMessage] = useState('');

  const question = quizQuestions[qIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        handleShoot(question.options[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setEnemyPos({
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 10
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const endGame = () => {
    setGameOver(true);
    addXP(score);
    updateHighScore('shooter', score);
  };

  const handleShoot = (ans: string) => {
    if (gameOver) return;

    if (ans === question.a) {
      setScore(s => s + 100);
      setMessage('BOOM! +100');
      setEnemyPos({ x: 50, y: -20 }); // Fly off screen
      setTimeout(() => {
        setQIndex(prev => (prev + 1) % quizQuestions.length);
        setMessage('');
      }, 500);
    } else {
      setHp(prev => prev - 1);
      setMessage('MISS! -1 HP');
      if (hp <= 1) {
        endGame();
      }
      setTimeout(() => setMessage(''), 1000);
    }
  };

  return (
    <ScreenWrapper className="bg-gray-900 text-white pb-24 flex flex-col">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/10 z-20 relative">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-1 text-red-500">
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={20} className={i < hp ? 'fill-current' : 'opacity-30'} />
          ))}
        </div>
        <div className="font-bold text-yellow-400">Score: {score}</div>
      </div>

      {!gameOver ? (
        <div className="flex-1 relative">
          {/* Game Area */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-gray-900">
            <AnimatePresence>
              <motion.div
                key={qIndex}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, left: `${enemyPos.x}%`, top: `${enemyPos.y}%` }}
                exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-red-500/20 rounded-full animate-ping absolute inset-0" />
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-4 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.6)] relative z-10">
                    <Crosshair size={40} className="text-white/80 animate-spin" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/80 text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap border border-white/20 backdrop-blur-sm">
                    {question.q}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-yellow-400 z-30 drop-shadow-lg"
              >
                {message}
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleShoot(opt)}
                  className="bg-orange-600/80 hover:bg-orange-500 border border-orange-400/50 p-4 rounded-xl text-center font-bold text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(234,88,12,0.3)] backdrop-blur-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center z-20 relative">
          <h1 className="text-5xl font-black text-red-500 mb-2 tracking-widest">GAME OVER</h1>
          <p className="text-2xl mb-8 text-white/80">
            Final Score: <span className="text-yellow-400 font-bold">{score}</span>
          </p>
          <button
            onClick={goBack}
            className="bg-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-colors shadow-lg"
          >
            Back to Games
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
