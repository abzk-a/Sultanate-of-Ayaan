import React from 'react';
import { KingdomStats, Mission } from '../types/game';
import { MISSIONS_LIST } from '../game/simulation';
import { sound } from '../audio/soundSystem';

interface MissionsModalProps {
  stats: KingdomStats;
  builtBuildingIds: string[];
  decisionsMadeIds: string[];
  completedMissionIds: string[];
  onClaimMissionReward: (mission: Mission) => void;
  onClose: () => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  stats,
  builtBuildingIds,
  decisionsMadeIds,
  completedMissionIds,
  onClaimMissionReward,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/75 select-none pointer-events-auto">
      <div className="bg-[#1b1510] border-2 border-[#d4af37] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-[#f4eedb] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#d4af37]/50 bg-gradient-to-r from-[#14532d]/90 via-[#1b1510] to-[#14532d]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#14532d] border border-[#d4af37] flex items-center justify-center text-[#fef08a] font-serif font-bold">
              📜
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fde047] tracking-wider">
                Royal Quests & Imperial Decrees
              </h2>
              <p className="text-xs text-stone-300 font-mono">
                Sacred Obligations of Sultan Ayaan Ahmed
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center font-bold text-lg border border-stone-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {MISSIONS_LIST.map((mission) => {
            const isCompleted = completedMissionIds.includes(mission.id);
            const canClaim = !isCompleted && mission.isComplete(stats, builtBuildingIds, decisionsMadeIds);

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-[#123821]/50 border-emerald-500/70'
                    : canClaim
                    ? 'bg-[#2a2215] border-[#d4af37] shadow-lg'
                    : 'bg-[#241a12] border-stone-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-serif font-bold text-[#fde047]">
                        {mission.title}
                      </span>
                      <span className="text-xs text-stone-400 font-mono italic">
                        — {mission.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {mission.description}
                    </p>
                    <div className="text-xs text-amber-300 font-mono mt-1">
                      Objective: <span className="text-stone-200">{mission.objectiveText}</span>
                    </div>
                  </div>

                  {/* Status / Claim Button */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-mono font-semibold rounded border border-emerald-600 block text-center">
                        ✓ Completed
                      </span>
                    ) : canClaim ? (
                      <button
                        onClick={() => {
                          sound.playFanfare();
                          onClaimMissionReward(mission);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-serif font-bold text-xs rounded border border-[#d4af37] shadow cursor-pointer animate-bounce"
                      >
                        Claim Royal Reward!
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-stone-800 text-stone-400 text-xs font-mono rounded border border-stone-700 block text-center">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Rewards Bar */}
                <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-stone-400">
                  <span>
                    Reward: <span className="text-[#fef08a] font-bold">+{mission.rewardTreasury} Dinars</span>
                  </span>
                  <span>
                    Happiness: <span className="text-emerald-400 font-bold">+{mission.rewardHappiness}%</span>
                  </span>
                  <span>
                    Title: <span className="text-amber-300 italic font-serif">"{mission.rewardHonorTitle}"</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#d4af37]/40 bg-[#14100c] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] font-serif font-semibold text-xs rounded border border-[#d4af37] cursor-pointer"
          >
            Close Missions
          </button>
        </div>
      </div>
    </div>
  );
};
