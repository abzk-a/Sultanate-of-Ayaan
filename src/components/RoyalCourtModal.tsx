import React, { useState } from 'react';
import { KingdomStats, Decision } from '../types/game';
import { ADVISORS_LIST } from '../game/simulation';
import { sound } from '../audio/soundSystem';

interface RoyalCourtModalProps {
  stats: KingdomStats;
  decisionsMadeIds: string[];
  onEnactDecision: (decision: Decision) => void;
  onClose: () => void;
}

export const RoyalCourtModal: React.FC<RoyalCourtModalProps> = ({
  stats,
  decisionsMadeIds,
  onEnactDecision,
  onClose,
}) => {
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string>(ADVISORS_LIST[0].id);

  const currentAdvisor = ADVISORS_LIST.find((a) => a.id === selectedAdvisorId) || ADVISORS_LIST[0];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/75 select-none pointer-events-auto">
      <div className="bg-[#1b1510] border-2 border-[#d4af37] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-[#f4eedb] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#d4af37]/50 bg-gradient-to-r from-[#14532d]/90 via-[#1b1510] to-[#14532d]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#14532d] border border-[#d4af37] flex items-center justify-center text-[#fef08a] font-serif font-bold">
              🏛️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fde047] tracking-wider">
                Royal Court of Madinat al-Ayaan
              </h2>
              <p className="text-xs text-stone-300 font-mono">
                Audience with the Imperial Advisors of Sultan Ayaan
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

        {/* Advisor Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-stone-800 bg-[#14100c]">
          {ADVISORS_LIST.map((advisor) => (
            <button
              key={advisor.id}
              onClick={() => {
                sound.playClick();
                setSelectedAdvisorId(advisor.id);
              }}
              className={`p-3 text-left transition-all border-b-2 cursor-pointer flex flex-col ${
                selectedAdvisorId === advisor.id
                  ? 'bg-[#241a12] border-[#d4af37] text-[#fef08a]'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <span className="font-serif font-bold text-xs sm:text-sm">{advisor.name}</span>
              <span className="text-[10px] text-stone-400 font-mono">{advisor.title}</span>
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Advisor Dialogue Banner */}
          <div className="bg-[#241a12] border border-[#d4af37]/40 rounded-lg p-4 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-lg bg-[#14532d] border border-[#d4af37] flex items-center justify-center text-xl shrink-0">
              {currentAdvisor.id === 'vizier' ? '📜' : currentAdvisor.id === 'general' ? '⚔️' : '💰'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-[#fde047] text-sm sm:text-base">
                  {currentAdvisor.name}
                </span>
                <span className="text-xs text-stone-400 font-mono">({currentAdvisor.title})</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 italic mt-1 leading-relaxed">
                "{currentAdvisor.greeting}"
              </p>
            </div>
          </div>

          {/* Advisor Petitions List */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-[#fde047] text-sm uppercase tracking-wider">
              Petitions & Royal Decrees
            </h3>

            <div className="space-y-3">
              {currentAdvisor.decisions.map((decision) => {
                const isEnacted = decisionsMadeIds.includes(decision.id);
                const canAffordTreasury = stats.treasury >= decision.costTreasury;
                const canAffordFood = stats.food >= decision.costFood;
                const canEnact = !isEnacted && canAffordTreasury && canAffordFood;

                return (
                  <div
                    key={decision.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isEnacted
                        ? 'bg-[#123821]/50 border-emerald-500/70'
                        : 'bg-[#241a12] border-stone-700 hover:border-[#d4af37]/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base">
                          {decision.title}
                        </h4>
                        <p className="text-xs text-stone-300 mt-1 max-w-xl">
                          {decision.description}
                        </p>
                      </div>

                      {/* Enact Status / Action */}
                      <div className="shrink-0">
                        {isEnacted ? (
                          <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-mono font-semibold rounded border border-emerald-600 block text-center">
                            Decree Enacted
                          </span>
                        ) : (
                          <button
                            disabled={!canEnact}
                            onClick={() => {
                              sound.playOudChord();
                              onEnactDecision(decision);
                            }}
                            className={`px-4 py-2 rounded text-xs font-serif font-semibold tracking-wide transition-all cursor-pointer ${
                              canEnact
                                ? 'bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] border border-[#d4af37] shadow'
                                : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                            }`}
                          >
                            Enact Royal Decree
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Cost & Consequence details */}
                    <div className="mt-3 pt-3 border-t border-stone-800 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
                      <div className="text-stone-400">
                        Cost:{' '}
                        <span className="text-[#fef08a] font-bold">
                          {decision.costTreasury} Dinars
                        </span>
                        {decision.costFood > 0 && (
                          <span className="text-amber-300 ml-1">· {decision.costFood} Food</span>
                        )}
                      </div>

                      <div className="text-emerald-400">
                        Consequences:{' '}
                        {decision.rewardHappiness !== 0 && `+${decision.rewardHappiness}% Happiness `}
                        {decision.rewardStability !== 0 && `+${decision.rewardStability}% Stability `}
                        {decision.rewardMilitary !== 0 && `+${decision.rewardMilitary} Military `}
                        {decision.rewardTreasuryDaily && `+${decision.rewardTreasuryDaily} Dinars/day`}
                      </div>
                    </div>

                    {isEnacted && (
                      <div className="mt-2 text-xs italic text-emerald-300/90 font-serif">
                        "{decision.consequences}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
            Leave Royal Court
          </button>
        </div>
      </div>
    </div>
  );
};
