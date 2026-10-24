import { useState, useEffect } from 'react';

// ViewModel equivalent for Skills
export function useSkillsViewModel() {
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inspire_skills');
    if (saved) {
      try {
        setSkills(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse inspire_skills', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleSkill = (skill: string) => {
    setSkills(prev => {
      const newSkills = prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill];
      localStorage.setItem('inspire_skills', JSON.stringify(newSkills));
      return newSkills;
    });
  };

  const saveSkills = (newSkills: string[]) => {
    setSkills(newSkills);
    localStorage.setItem('inspire_skills', JSON.stringify(newSkills));
  };

  return { skills, isLoaded, toggleSkill, saveSkills };
}
