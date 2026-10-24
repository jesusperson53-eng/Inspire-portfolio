import { useNavigate } from 'react-router-dom';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useSkillsViewModel } from '../store/useSkillsViewModel';
import { Check, Sparkles } from 'lucide-react';

import { COURSE_TITLES } from '../../config/courseCatalog';

const AVAILABLE_SKILLS = COURSE_TITLES;

export function Skills() {
  const navigate = useNavigate();
  const { skills, toggleSkill } = useSkillsViewModel();

  const handleContinue = () => {
    if (skills.length > 0) {
      navigate('/workspace/home', { replace: true });
    }
  };

  return (
    <ScreenWrapper className="bg-white flex flex-col justify-between min-h-screen">
      <div className="max-w-xl w-full mx-auto px-6 pt-10 pb-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-blue-700" />
            <span>Learning Track Selection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Select Your Skills</h1>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed">
            Choose the technical and commercial skills you want to practice, track targets for, and build a local portfolio with.
          </p>

          <div className="space-y-3 mt-6">
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = skills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/70 shadow-xs'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`font-bold text-sm ${isSelected ? 'text-blue-950' : 'text-slate-700'}`}>
                    {skill}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-blue-900 border-blue-900' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-6 mt-6 border-t border-slate-100">
          <button
            onClick={handleContinue}
            disabled={skills.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
              skills.length > 0
                ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Save & Continue to Workspace
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
}
