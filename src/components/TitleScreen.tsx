import React, { useEffect } from 'react';
import { sound } from '../audio/soundSystem';

interface TitleScreenProps {
  onStart: () => void;
  hasSavedGame: boolean;
  onContinue: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, hasSavedGame, onContinue }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playOudChord();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 pointer-events-none z-30 select-none bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/70">
      {/* Top Header / Royal Islamic Crest Lockup */}
      <div className="flex flex-col items-center text-center mt-4 sm:mt-8">
        {/* Bespoke Islamic Star & Crescent Emblem */}
        <div className="mb-3 text-[#d4af37] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="none">
            {/* Outer Decorative Ring */}
            <circle cx="50" cy="50" r="46" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="41" stroke="#108044" strokeWidth="1.5" />
            {/* 8-Pointed Star (Rub el Hizb) */}
            <rect x="25" y="25" width="50" height="50" fill="#14532d" stroke="#d4af37" strokeWidth="2" />
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              transform="rotate(45 50 50)"
              fill="#14532d"
              stroke="#d4af37"
              strokeWidth="2"
            />
            {/* Inner Crescent & Star */}
            <path
              d="M54 36 A15 15 0 1 0 54 64 A12 12 0 1 1 54 36 Z"
              fill="#d4af37"
            />
            <polygon
              points="57,47 59,51 63,51 60,54 61,58 57,55 53,58 54,54 51,51 55,51"
              fill="#fef08a"
            />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif tracking-widest text-[#f5ebd7] uppercase font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          The Sultanate of Ayaan
        </h1>
        <div className="h-0.5 w-36 sm:w-56 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-2" />
        <p className="text-sm sm:text-base text-[#e5d5b7] max-w-md tracking-wide font-medium drop-shadow">
          Historical Islamic Open-World Adventure & Kingdom Simulation
        </p>
      </div>

      {/* Center Call to Action */}
      <div className="flex flex-col items-center justify-center gap-3 my-auto pointer-events-auto">
        <button
          data-start="true"
          onClick={() => {
            sound.playOudChord();
            onStart();
          }}
          className="group relative px-8 py-3.5 bg-gradient-to-r from-[#14532d] via-[#166534] to-[#14532d] hover:from-[#15803d] hover:to-[#166534] text-[#fef9c3] font-serif text-lg tracking-wider rounded-lg border-2 border-[#d4af37] shadow-[0_6px_20px_rgba(0,0,0,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span className="flex items-center gap-2 font-semibold">
            <span>Ascend the Throne</span>
            <span className="text-xs text-[#fde047] font-mono opacity-80">(Space / Enter)</span>
          </span>
        </button>

        {hasSavedGame && (
          <button
            onClick={() => {
              sound.playClick();
              onContinue();
            }}
            className="px-6 py-2 bg-stone-900/80 hover:bg-stone-800 text-[#e2d5bd] text-sm font-serif tracking-wide rounded border border-[#d4af37]/60 shadow transition-colors cursor-pointer"
          >
            Resume Saved Reign
          </button>
        )}
      </div>

      {/* Flat Bottom Control Hint Line (Per game craft guidelines) */}
      <div className="text-center text-xs sm:text-sm text-[#f5ecd5]/80 font-mono tracking-wider pb-2 drop-shadow">
        WASD Move · Shift Run · E Interact · K Royal Ledger · Esc Pause
      </div>
    </div>
  );
};
