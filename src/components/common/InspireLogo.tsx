import React from 'react';

interface InspireLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const InspireLogo: React.FC<InspireLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Academy Crest Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 text-white shadow-md shadow-blue-900/20 ring-1 ring-white/20`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/6 h-5/6 text-amber-400 p-0.5"
        >
          {/* Graduation Cap / Academy Torch Motif */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white"></div>
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={`font-extrabold tracking-tight ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-slate-900'
          }`}
        >
          INSPIRE <span className="text-blue-700 font-black">ACADEMY</span>
        </span>
        <span
          className={`font-semibold uppercase tracking-wider ${subSizes[size]} ${
            isLight ? 'text-blue-200' : 'text-slate-500'
          }`}
        >
          Business & Tech Excellence
        </span>
      </div>
    </div>
  );
};
