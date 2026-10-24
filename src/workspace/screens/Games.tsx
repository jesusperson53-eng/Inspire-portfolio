import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSafeBack } from '../lib/utils';
import { useGamesViewModel } from '../store/useGamesViewModel';
import { ArrowLeft, Gamepad2, Brain, Target, Crosshair, CircleDashed, Trophy, Star } from 'lucide-react';
import { motion } from 'motion/react';

const gamesList = [
  { id: 'quiz', title: 'Quiz Battle', desc: 'Defeat enemies with knowledge', icon: Target, color: 'bg-red-500', path: '/workspace/games/quiz' },
  { id: 'puzzle', title: 'Puzzle Challenge', desc: 'Arrange workflows correctly', icon: Brain, color: 'bg-blue-500', path: '/workspace/games/puzzle' },
  { id: 'memory', title: 'Memory Brain Test', desc: 'Match concepts and definitions', icon: Gamepad2, color: 'bg-purple-500', path: '/workspace/games/memory' },
  { id: 'shooter', title: 'Enemy Shooter', desc: 'Shoot targets with correct answers', icon: Crosshair, color: 'bg-orange-500', path: '/workspace/games/shooter' },
  { id: 'bubble', title: 'Bubble Shooter', desc: 'Pop the correct answer bubbles', icon: CircleDashed, color: 'bg-cyan-500', path: '/workspace/games/bubble' },
];

export function Games() {
  const navigate = useNavigate();
  const goBack = useSafeBack();
  const { progress } = useGamesViewModel();

  return (
    <ScreenWrapper className="bg-gray-50 pb-24">
      <div className="bg-indigo-900 text-white pt-12 pb-6 px-6 rounded-b-[2rem] shadow-md z-10 relative">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Learning Games</h1>
            <p className="text-indigo-200 text-sm mt-1">Play and learn offline</p>
          </div>
        </div>

        <div className="mt-6 bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-indigo-900 shadow-inner">
              <Trophy size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Player Level</p>
              <p className="text-2xl font-black">{progress.level}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-400 justify-end mb-1">
              <Star size={14} className="fill-current" />
              <span className="font-bold text-sm">{progress.xp} XP</span>
            </div>
            <div className="w-24 h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${progress.xp % 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {gamesList.map((game, index) => {
          const Icon = game.icon;
          const highScore = progress.highScores[game.id] || 0;

          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={game.id}
              onClick={() => navigate(game.path)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all active:scale-95"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${game.color} shadow-inner`}>
                <Icon size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-lg truncate">{game.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{game.desc}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                    High Score: {highScore}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScreenWrapper>
  );
}
