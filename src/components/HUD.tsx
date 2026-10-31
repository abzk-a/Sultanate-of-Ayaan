import React from 'react';
import { KingdomStats, Mission } from '../types/game';
import { InteractableZone } from '../graphics/collision';
import { sound } from '../audio/soundSystem';

interface HUDProps {
  stats: KingdomStats;
  stamina: number;
  activeMission: Mission | null;
  interactable: InteractableZone | null;
  onOpenInteractable: (zone: InteractableZone) => void;
  onOpenLedger: () => void;
  onOpenCourt: () => void;
  onOpenPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  stamina,
  activeMission,
  interactable,
  onOpenInteractable,
  onOpenLedger,
  onOpenCourt,
  onOpenPause,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* TOP ROW: Sultan Identity & Treasury & Utility Bar */}
      <div className="flex justify-between items-start gap-3">
        {/* Top-Left: Sultan Status & Health/Stamina */}
        <div className="flex flex-col gap-1.5 pointer-events-auto bg-[#1b1510]/85 border border-[#d4af37]/60 rounded-lg p-2.5 sm:p-3 text-[#f4eedb] shadow-lg max-w-[280px]">
          <div className="flex items-center gap-2">
            {/* Emerald Jewel Crest Icon */}
            <div className="w-6 h-6 rounded-full bg-[#14532d] border border-[#d4af37] flex items-center justify-center text-[#fef08a] text-xs font-bold font-serif">
              A
            </div>
            <div>
              <div className="text-xs sm:text-sm font-serif font-bold text-[#fde047] tracking-wider leading-none">
                Sultan Ayaan Ahmed
              </div>
              <div className="text-[10px] text-stone-300 font-mono">
                Day {stats.day} · Sultanate of Ayaan
              </div>
            </div>
          </div>

          {/* Health Bar (Sovereign Radiance) */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-[#d4af37] uppercase w-6">HP</span>
            <div className="flex-1 h-2 bg-stone-900 rounded overflow-hidden border border-stone-700">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-full" />
            </div>
            <span className="text-[10px] font-mono text-emerald-400 tabular-nums">100</span>
          </div>

          {/* Stamina Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase w-6">STM</span>
            <div className="flex-1 h-2 bg-stone-900 rounded overflow-hidden border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75"
                style={{ width: `${Math.round(stamina)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-amber-400 tabular-nums">{Math.round(stamina)}</span>
          </div>

          {/* Active Mission Pill (Tucked in top-left) */}
          {activeMission && (
            <div className="border-t border-stone-800 pt-1.5 mt-0.5">
              <div className="flex items-center gap-1 text-[11px] font-serif font-bold text-[#fde047] uppercase tracking-wider">
                <span className="text-amber-400">📜</span>
                <span className="truncate">{activeMission.title}</span>
              </div>
              <div className="text-[10px] text-stone-300 line-clamp-2 mt-0.5 leading-tight">
                {activeMission.objectiveText}
              </div>
            </div>
          )}
        </div>

        {/* Top-Center: Royal Treasury & Key Kingdom Metrics */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-[#1b1510]/85 border border-[#d4af37]/60 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-[#f4eedb] shadow-lg">
          {/* Gold Dinars */}
          <div className="flex items-center gap-1.5" title="Royal Treasury (Dinars)">
            <svg className="w-4 h-4 text-[#fbbf24]" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="#d97706" strokeWidth="2" />
              <text x="12" y="16" fontSize="11" textAnchor="middle" fill="#78350f" fontWeight="bold">
                D
              </text>
            </svg>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold font-mono text-[#fef08a] tabular-nums leading-tight">
                {stats.treasury.toLocaleString()}
              </span>
              <span className="text-[9px] text-[#d4af37] tracking-wider uppercase font-semibold">Dinars</span>
            </div>
          </div>

          <div className="h-6 w-px bg-stone-700" />

          {/* Population */}
          <div className="hidden sm:flex flex-col" title="Population">
            <span className="text-sm font-bold font-mono text-stone-200 tabular-nums leading-tight">
              {stats.population.toLocaleString()}
            </span>
            <span className="text-[9px] text-stone-400 uppercase tracking-wider">Citizens</span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-700" />

          {/* Food */}
          <div className="hidden sm:flex flex-col" title="Food Reserves">
            <span className="text-sm font-bold font-mono text-amber-200 tabular-nums leading-tight">
              {stats.food}
            </span>
            <span className="text-[9px] text-amber-400/90 uppercase tracking-wider">Food</span>
          </div>

          <div className="hidden md:block h-6 w-px bg-stone-700" />

          {/* Happiness */}
          <div className="flex flex-col" title="Public Happiness">
            <span className="text-sm font-bold font-mono text-emerald-300 tabular-nums leading-tight">
              {stats.happiness}%
            </span>
            <span className="text-[9px] text-emerald-400/90 uppercase tracking-wider">Happiness</span>
          </div>
        </div>

        {/* Top-Right: Quick Utilities */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2">
          {/* Royal Ledger Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLedger();
            }}
            className="px-2.5 py-1.5 bg-[#1b1510]/85 hover:bg-[#2b1f15] border border-[#d4af37]/60 rounded text-[#fde047] text-xs font-serif font-semibold tracking-wide flex items-center gap-1 shadow cursor-pointer"
            title="Open Kingdom Management Ledger [K]"
          >
            <span>Ledger</span>
            <span className="text-[10px] text-stone-400 font-mono">[K]</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 bg-[#1b1510]/85 hover:bg-[#2b1f15] border border-stone-600 rounded text-stone-300 hover:text-white shadow cursor-pointer"
            title="Toggle Sound [M]"
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Pause Menu */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPause();
            }}
            className="p-1.5 bg-[#1b1510]/85 hover:bg-[#2b1f15] border border-stone-600 rounded text-stone-300 hover:text-white shadow cursor-pointer"
            title="Pause [Esc]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* MIDDLE: Contextual In-World Interaction Toast */}
      {interactable && (
        <div className="self-center pointer-events-auto transition-transform transform translate-y-0">
          <button
            onClick={() => {
              sound.playClick();
              onOpenInteractable(interactable);
            }}
            className="flex items-center gap-3 px-4 py-2.5 bg-[#14532d]/95 hover:bg-[#166534] border-2 border-[#d4af37] rounded-lg text-[#fef9c3] shadow-[0_4px_16px_rgba(0,0,0,0.8)] cursor-pointer group"
          >
            <span className="w-7 h-7 bg-[#d4af37] text-stone-900 font-mono font-bold text-sm flex items-center justify-center rounded">
              E
            </span>
            <div className="text-left">
              <div className="text-xs font-serif text-[#fde047] uppercase tracking-wider font-semibold">
                {interactable.name}
              </div>
              <div className="text-sm font-medium tracking-wide">
                {interactable.prompt}
              </div>
            </div>
          </button>
        </div>
      )}

    </div>
  );
};

