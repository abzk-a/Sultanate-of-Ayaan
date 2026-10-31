import React from 'react';
import { KingdomStats, Building, TaxRate, RationingLevel } from '../types/game';
import { BUILDINGS_LIST } from '../game/simulation';
import { sound } from '../audio/soundSystem';

interface KingdomManagementModalProps {
  stats: KingdomStats;
  builtBuildingIds: string[];
  simulationLogs: string[];
  onClose: () => void;
  onUpdateTaxRate: (rate: TaxRate) => void;
  onUpdateRationing: (level: RationingLevel) => void;
  onConstructBuilding: (building: Building) => void;
  onAdvanceDay: () => void;
}

export const KingdomManagementModal: React.FC<KingdomManagementModalProps> = ({
  stats,
  builtBuildingIds,
  simulationLogs,
  onClose,
  onUpdateTaxRate,
  onUpdateRationing,
  onConstructBuilding,
  onAdvanceDay,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/75 select-none pointer-events-auto">
      <div className="bg-[#1b1510] border-2 border-[#d4af37] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-[#f4eedb] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#d4af37]/50 bg-gradient-to-r from-[#14532d]/80 via-[#1b1510] to-[#14532d]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#14532d] border border-[#d4af37] flex items-center justify-center text-[#fef08a] font-serif font-bold">
              👑
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fde047] tracking-wider">
                Royal Divan & Kingdom Ledger
              </h2>
              <p className="text-xs text-stone-300 font-mono">
                Day {stats.day} of the Reign of Sultan Ayaan Ahmed
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

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            <div className="bg-[#241a12] p-2.5 rounded-lg border border-amber-600/50">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold block">
                Treasury
              </span>
              <span className="text-lg font-bold font-mono text-[#fef08a] tabular-nums">
                {stats.treasury.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Dinars</span>
            </div>

            <div className="bg-[#241a12] p-2.5 rounded-lg border border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                Population
              </span>
              <span className="text-lg font-bold font-mono text-stone-200 tabular-nums">
                {stats.population.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Citizens</span>
            </div>

            <div className="bg-[#241a12] p-2.5 rounded-lg border border-amber-700/50">
              <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block">
                Food Reserves
              </span>
              <span className="text-lg font-bold font-mono text-amber-200 tabular-nums">
                {stats.food.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Bushels</span>
            </div>

            <div className="bg-[#241a12] p-2.5 rounded-lg border border-emerald-600/50">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">
                Happiness
              </span>
              <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
                {stats.happiness}%
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Approval</span>
            </div>

            <div className="bg-[#241a12] p-2.5 rounded-lg border border-blue-600/50">
              <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold block">
                Stability
              </span>
              <span className="text-lg font-bold font-mono text-blue-300 tabular-nums">
                {stats.stability}%
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Order</span>
            </div>

            <div className="bg-[#241a12] p-2.5 rounded-lg border border-red-700/50">
              <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold block">
                Military
              </span>
              <span className="text-lg font-bold font-mono text-red-300 tabular-nums">
                {stats.military.toLocaleString()}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">Soldiers</span>
            </div>
          </div>

          {/* Royal Policies: Taxation & Food Rationing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taxation Policy */}
            <div className="bg-[#241a12] p-4 rounded-lg border border-[#d4af37]/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-[#fde047] text-sm sm:text-base">
                  Taxation Policy
                </h3>
                <span className="text-xs font-mono text-amber-400 capitalize">
                  Current: {stats.taxRate}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Adjust the royal tithes collected from bazaars and estates. Higher taxes yield gold but harm public contentment.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['low', 'moderate', 'high'] as TaxRate[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      sound.playClick();
                      onUpdateTaxRate(rate);
                    }}
                    className={`py-2 px-1 text-xs font-serif rounded border text-center transition-all cursor-pointer ${
                      stats.taxRate === rate
                        ? 'bg-[#14532d] border-[#d4af37] text-[#fef9c3] font-bold shadow'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="capitalize">{rate}</div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {rate === 'low' ? '5% · +Happy' : rate === 'moderate' ? '12% · Balanced' : '25% · -Happy'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Supplies & Rationing */}
            <div className="bg-[#241a12] p-4 rounded-lg border border-[#d4af37]/40 space-y-2.5">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-[#fde047] text-sm sm:text-base">
                  Food Distribution
                </h3>
                <span className="text-xs font-mono text-amber-400 capitalize">
                  Current: {stats.rationing}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Manage grain distribution from state granaries. Generous rations promote population growth and happiness.
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['austere', 'normal', 'generous'] as RationingLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      sound.playClick();
                      onUpdateRationing(level);
                    }}
                    className={`py-2 px-1 text-xs font-serif rounded border text-center transition-all cursor-pointer ${
                      stats.rationing === level
                        ? 'bg-[#14532d] border-[#d4af37] text-[#fef9c3] font-bold shadow'
                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="capitalize">{level}</div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {level === 'austere' ? 'Saves food' : level === 'normal' ? 'Standard' : 'Boosts growth'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure & Capital Construction */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-[#fde047] text-base sm:text-lg">
                Royal Infrastructure Projects
              </h3>
              <span className="text-xs font-mono text-stone-400">
                {builtBuildingIds.length} of {BUILDINGS_LIST.length} Commissioned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {BUILDINGS_LIST.map((building) => {
                const isBuilt = builtBuildingIds.includes(building.id);
                const affordable = stats.treasury >= building.cost;

                return (
                  <div
                    key={building.id}
                    className={`p-3.5 rounded-lg border flex flex-col justify-between gap-2.5 transition-all ${
                      isBuilt
                        ? 'bg-[#123821]/60 border-emerald-500/70'
                        : 'bg-[#241a12] border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-stone-100 text-sm">
                          {building.name}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${
                            isBuilt
                              ? 'bg-emerald-800 text-emerald-200'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {isBuilt ? 'Constructed' : `${building.cost} Dinars`}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1">{building.description}</p>
                      <div className="text-[11px] text-emerald-400 font-mono mt-1.5">
                        {building.effectsDescription}
                      </div>
                    </div>

                    {!isBuilt && (
                      <button
                        disabled={!affordable}
                        onClick={() => {
                          sound.playCoin();
                          onConstructBuilding(building);
                        }}
                        className={`w-full py-1.5 rounded text-xs font-serif font-semibold transition-all cursor-pointer ${
                          affordable
                            ? 'bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] border border-[#d4af37]'
                            : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                        }`}
                      >
                        {affordable ? `Commission Construction (${building.cost} Dinars)` : 'Insufficient Treasury'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Chronicles / Turn Logs */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-[#fde047] text-sm">
              Sultanate Chronicles & Turn Records
            </h3>
            <div className="bg-stone-950 p-3 rounded border border-stone-800 max-h-32 overflow-y-auto space-y-1 font-mono text-xs text-stone-300">
              {simulationLogs.length === 0 ? (
                <div className="text-stone-500 italic">No turns advanced yet.</div>
              ) : (
                simulationLogs.map((log, i) => <div key={i}>• {log}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#d4af37]/40 bg-[#14100c] flex justify-between items-center">
          <button
            onClick={() => {
              sound.playCoin();
              onAdvanceDay();
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-serif font-semibold text-xs rounded border border-amber-400 shadow cursor-pointer"
          >
            Advance Simulation by 1 Day ➔
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] font-serif font-semibold text-xs rounded border border-[#d4af37] cursor-pointer"
          >
            Return to Capital
          </button>
        </div>
      </div>
    </div>
  );
};
