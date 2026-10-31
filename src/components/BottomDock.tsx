import React, { useState } from 'react';
import { sound } from '../audio/soundSystem';
import { GraphicsQuality } from '../types/game';

interface BottomDockProps {
  onOpenLedger: () => void;
  onOpenCourt: () => void;
  onOpenMissions: () => void;
  onAdvanceDay: () => void;
  cameraMode: 'follow' | 'panoramic' | 'tactical';
  onChangeCameraMode: (mode: 'follow' | 'panoramic' | 'tactical') => void;
  graphicsQuality: GraphicsQuality;
  onChangeGraphicsQuality: (q: GraphicsQuality) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  onOpenLedger,
  onOpenCourt,
  onOpenMissions,
  onAdvanceDay,
  cameraMode,
  onChangeCameraMode,
  graphicsQuality,
  onChangeGraphicsQuality,
}) => {
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto max-w-[min(940px,96vw)] w-full px-2 select-none">
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => {
          sound.playClick();
          setCollapsed(!collapsed);
        }}
        className="px-3 py-0.5 bg-[#1b1510]/90 hover:bg-[#2b1f15] border border-[#d4af37]/60 border-b-0 rounded-t text-[#d4af37] text-[11px] font-mono tracking-wider flex items-center gap-1 shadow cursor-pointer transition-colors"
        title="Toggle HUD Dock"
      >
        <span>{collapsed ? '▴ Show Royal Dock' : '▾ Hide Dock'}</span>
      </button>

      {/* Dock Container */}
      {!collapsed && (
        <div className="w-full bg-[#1b1510]/95 border border-[#d4af37]/80 rounded-lg p-2 sm:p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-2 text-[#f4eedb]">
          {/* Left: Royal Governance Modals */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenLedger();
              }}
              className="px-2.5 py-1.5 bg-[#14532d]/90 hover:bg-[#166534] border border-[#d4af37] rounded text-xs font-serif font-semibold text-[#fef9c3] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Kingdom Ledger</span>
              <span className="text-[10px] text-stone-300 font-mono">[K]</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenCourt();
              }}
              className="px-2.5 py-1.5 bg-[#282119] hover:bg-[#3d3124] border border-stone-600 rounded text-xs font-serif font-semibold text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Royal Court</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenMissions();
              }}
              className="px-2.5 py-1.5 bg-[#282119] hover:bg-[#3d3124] border border-stone-600 rounded text-xs font-serif font-semibold text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Missions</span>
            </button>

            <button
              onClick={() => {
                sound.playCoin();
                onAdvanceDay();
              }}
              className="px-2.5 py-1.5 bg-[#78350f]/80 hover:bg-[#92400e] border border-amber-500 rounded text-xs font-serif font-semibold text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
              title="Progress kingdom simulation by 1 day"
            >
              <span>Next Day ➔</span>
            </button>
          </div>

          {/* Right: Camera Perspectives & Graphics Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Camera View Switcher */}
            <div className="flex items-center bg-stone-900/90 rounded border border-stone-700 p-0.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onChangeCameraMode('follow');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  cameraMode === 'follow' ? 'bg-[#14532d] text-[#fef08a] font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Follow
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onChangeCameraMode('panoramic');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  cameraMode === 'panoramic' ? 'bg-[#14532d] text-[#fef08a] font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Panorama
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onChangeCameraMode('tactical');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  cameraMode === 'tactical' ? 'bg-[#14532d] text-[#fef08a] font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Tactical
              </button>
            </div>

            {/* Graphics Preset */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-stone-400">
              <span>GFX:</span>
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    sound.playClick();
                    onChangeGraphicsQuality(q);
                  }}
                  className={`px-1.5 py-0.5 uppercase rounded text-[10px] ${
                    graphicsQuality === q ? 'bg-[#d4af37] text-stone-950 font-bold' : 'hover:text-stone-200'
                  }`}
                >
                  {q[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
