import { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useSafeBack } from '../../lib/utils';
import { quizQuestions } from '../../data/gamesContent';
import { useGamesViewModel } from '../../store/useGamesViewModel';
import { ArrowLeft, Heart, ShieldAlert, Swords } from 'lucide-react';

export function QuizBattle() {
  const goBack = useSafeBack('/workspace/games');
  const { addXP, updateHighScore } = useGamesViewModel();

  const [qIndex, setQIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const question = quizQuestions[qIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= question.options.length) {
        handleAnswer(question.options[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const endGame = (finalScore: number) => {
    setGameOver(true);
    addXP(finalScore);
    updateHighScore('quiz', finalScore);
  };

  const handleAnswer = (ans: string) => {
    if (gameOver) return;

    let nextScore = score;
    if (ans === question.a) {
      setEnemyHP(prev => Math.max(0, prev - 25));
      nextScore = score + 10;
      setScore(nextScore);
      setMessage('Direct Hit! -25 Enemy HP');
    } else {
      setPlayerHP(prev => Math.max(0, prev - 20));
      setMessage('Wrong! You took 20 damage.');
    }

    setTimeout(() => {
      setMessage('');
      if (enemyHP <= 25 && ans === question.a) {
        // Enemy defeated
        setEnemyHP(100);
        setQIndex(prev => (prev + 1) % quizQuestions.length);
        setScore(s => s + 50);
        setMessage('Enemy Defeated! +50 Bonus');
      } else if (playerHP <= 20 && ans !== question.a) {
        // Player defeated
        endGame(nextScore);
      } else {
        setQIndex(prev => (prev + 1) % quizQuestions.length);
      }
    }, 1000);
  };

  return (
    <ScreenWrapper className="bg-gray-900 text-white pb-24 flex flex-col">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/10">
        <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="font-bold text-lg">Score: {score}</div>
      </div>

      {!gameOver ? (
        <div className="flex-1 flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-blue-300">
                <ShieldAlert size={32} />
              </div>
              <div className="text-xs font-bold text-blue-300">PLAYER</div>
              <div className="flex items-center gap-1 text-red-400 justify-center mt-1">
                <Heart size={14} className="fill-current" /> {playerHP}
              </div>
            </div>

            <Swords size={32} className="text-yellow-500 animate-pulse" />

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-red-400">
                <ShieldAlert size={32} />
              </div>
              <div className="text-xs font-bold text-red-300">ENEMY</div>
              <div className="flex items-center gap-1 text-red-400 justify-center mt-1">
                <Heart size={14} className="fill-current" /> {enemyHP}
              </div>
            </div>
          </div>

          <div className="h-8 text-center text-yellow-400 font-bold mb-4">{message}</div>

          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-center leading-relaxed">{question.q}</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-auto">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-white/5 hover:bg-white/20 border border-white/10 p-4 rounded-xl text-left font-medium transition-colors active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
          <h1 className="text-4xl font-black text-red-500 mb-2">GAME OVER</h1>
          <p className="text-xl mb-8">Final Score: {score}</p>
          <button
            onClick={goBack}
            className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Games
          </button>
        </div>
      )}
    </ScreenWrapper>
  );
}
