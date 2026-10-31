import React, { useState } from 'react';
import { KingdomStats, GraphicsQuality } from '../types/game';
import { sound } from '../audio/soundSystem';

interface PauseModalProps {
  stats: KingdomStats;
  graphicsQuality: GraphicsQuality;
  isMuted: boolean;
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onToggleMute: () => void;
  onChangeQuality: (q: GraphicsQuality) => void;
  onReturnToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  stats,
  graphicsQuality,
  isMuted,
  onResume,
  onSave,
  onLoad,
  onToggleMute,
  onChangeQuality,
  onReturnToTitle,
}) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = () => {
    sound.playClick();
    onSave();
    setSaveStatus('Kingdom state saved to browser storage.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 select-none pointer-events-auto">
      <div className="bg-[#1b1510] border-2 border-[#d4af37] rounded-xl max-w-md w-full shadow-[0_12px_40px_rgba(0,0,0,0.95)] text-[#f4eedb] p-6 space-y-5">
        {/* Title */}
        <div className="text-center space-y-1 border-b border-[#d4af37]/40 pb-4">
          <h2 className="text-2xl font-serif font-bold text-[#fde047] tracking-wider uppercase">
            Sultanate Paused
          </h2>
          <p className="text-xs text-stone-400 font-mono">
            Day {stats.day} · {stats.treasury.toLocaleString()} Dinars · {stats.population.toLocaleString()} Citizens
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-2.5 bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] font-serif font-bold text-sm rounded border border-[#d4af37] shadow cursor-pointer transition-all"
          >
            Resume Reign (Esc / P)
          </button>

          <button
            onClick={handleSave}
            className="w-full py-2 bg-[#282119] hover:bg-[#3d3124] text-[#fde047] font-serif font-semibold text-xs rounded border border-[#d4af37]/60 cursor-pointer transition-all"
          >
            Save Kingdom to Browser Storage
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onLoad();
              setSaveStatus('Loaded saved kingdom reign.');
              setTimeout(() => setSaveStatus(null), 3000);
            }}
            className="w-full py-2 bg-[#282119] hover:bg-[#3d3124] text-stone-200 font-serif font-semibold text-xs rounded border border-stone-700 cursor-pointer transition-all"
          >
            Load Saved Reign
          </button>

          {saveStatus && (
            <div className="text-center text-xs font-mono text-emerald-400 py-1 bg-emerald-950/60 rounded border border-emerald-800">
              {saveStatus}
            </div>
          )}
        </div>

        {/* Settings & Quality Section */}
        <div className="border-t border-stone-800 pt-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300 font-mono">Audio Effects & Music:</span>
            <button
              onClick={onToggleMute}
              className={`px-3 py-1 rounded font-mono text-xs cursor-pointer border ${
                isMuted
                  ? 'bg-red-950/80 text-red-300 border-red-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
              }`}
            >
              {isMuted ? 'Muted' : 'Sound Active'}
            </button>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-300 font-mono">Graphics Quality:</span>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    sound.playClick();
                    onChangeQuality(q);
                  }}
                  className={`px-2 py-1 uppercase rounded text-[10px] font-mono cursor-pointer border ${
                    graphicsQuality === q
                      ? 'bg-[#d4af37] text-stone-950 font-bold border-[#d4af37]'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return to Title */}
        <div className="border-t border-stone-800 pt-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToTitle();
            }}
            className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-serif rounded border border-stone-800 cursor-pointer"
          >
            Abandon Reign to Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};
