import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { InspireLogo } from '../../components/common/InspireLogo';
import { useSkillsViewModel } from '../store/useSkillsViewModel';

export function Splash() {
  const navigate = useNavigate();
  const { skills, isLoaded } = useSkillsViewModel();

  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      if (skills.length === 0) {
        navigate('/workspace/skills', { replace: true });
      } else {
        navigate('/workspace/home', { replace: true });
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, isLoaded, skills.length]);

  const handleSkip = () => {
    if (skills.length === 0) {
      navigate('/workspace/skills', { replace: true });
    } else {
      navigate('/workspace/home', { replace: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex-1 flex flex-col items-center justify-center bg-blue-900 text-white relative overflow-hidden p-6"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[50%] rounded-full bg-blue-800/50 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[40%] rounded-full bg-yellow-500/20 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="z-10 flex flex-col items-center max-w-sm text-center"
      >
        <motion.div
          initial={{ rotate: -8 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-28 h-28 bg-white rounded-3xl p-2 shadow-2xl mb-6 flex items-center justify-center overflow-hidden border-4 border-yellow-400/80"
        >
          <InspireLogo size="lg" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-wider text-center px-4 leading-tight"
        >
          THE INSPIRE
          <br />
          <span className="text-yellow-400">BUSINESS ACADEMY</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 text-blue-200 text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold"
        >
          Learn &bull; Earn &bull; Grow
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-12 z-10 flex flex-col items-center gap-3"
      >
        <div className="w-7 h-7 border-3 border-blue-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
        <button
          onClick={handleSkip}
          className="text-xs text-blue-200 hover:text-white uppercase tracking-widest font-bold underline cursor-pointer mt-1"
        >
          Skip to Workspace →
        </button>
      </motion.div>
    </motion.div>
  );
}
