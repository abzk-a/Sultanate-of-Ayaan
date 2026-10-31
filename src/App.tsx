import React, { useState, useEffect, useRef } from 'react';
import {
  KingdomStats,
  Building,
  Decision,
  Mission,
  GraphicsQuality,
  TaxRate,
  RationingLevel,
  SaveData,
} from './types/game';
import {
  INITIAL_STATS,
  simulateDay,
  enactDecision,
  constructBuilding,
  saveGame,
  loadGame,
  MISSIONS_LIST,
} from './game/simulation';
import { sound } from './audio/soundSystem';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { BottomDock } from './components/BottomDock';
import { KingdomManagementModal } from './components/KingdomManagementModal';
import { RoyalCourtModal } from './components/RoyalCourtModal';
import { MissionsModal } from './components/MissionsModal';
import { PauseModal } from './components/PauseModal';
import { MobileControls } from './components/MobileControls';
import { InteractableZone } from './graphics/collision';

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover'>('title');
  const [stats, setStats] = useState<KingdomStats>(INITIAL_STATS);
  const [builtBuildingIds, setBuiltBuildingIds] = useState<string[]>([]);
  const [decisionsMadeIds, setDecisionsMadeIds] = useState<string[]>([]);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  // UI modal toggles
  const [activeModal, setActiveModal] = useState<'none' | 'ledger' | 'court' | 'missions'>('none');
  const [cameraMode, setCameraMode] = useState<'follow' | 'panoramic' | 'tactical'>('follow');
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>('medium');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [stamina, setStamina] = useState<number>(100);
  const [currentInteractable, setCurrentInteractable] = useState<InteractableZone | null>(null);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [victoryToast, setVictoryToast] = useState<string | null>(null);

  // Mobile controller refs
  const joystickVectorRef = useRef({ x: 0, y: 0 });
  const isSprintingRef = useRef(false);

  // Sync state machine to body dataset
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Initial Check for Save and Autostart
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setHasSavedGame(true);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
    }
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Ignore if user is inside an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState === 'playing') {
          if (activeModal !== 'none') {
            setActiveModal('none');
          } else {
            setGameState('paused');
          }
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      } else if (e.code === 'KeyK' && gameState === 'playing') {
        setActiveModal((prev) => (prev === 'ledger' ? 'none' : 'ledger'));
      } else if (e.code === 'KeyC' && gameState === 'playing') {
        setActiveModal((prev) => (prev === 'court' ? 'none' : 'court'));
      } else if (e.code === 'KeyM' && !e.ctrlKey && gameState === 'playing') {
        // Mute toggle on M
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [gameState, activeModal, isMuted]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleStartGame = () => {
    setGameState('playing');
    setActiveModal('none');
  };

  const handleContinueGame = () => {
    const saved = loadGame();
    if (saved) {
      setStats(saved.stats);
      setBuiltBuildingIds(saved.builtBuildingIds);
      setDecisionsMadeIds(saved.decisionsMadeIds);
      setCompletedMissionIds(saved.completedMissionIds);
      setGraphicsQuality(saved.quality);
      setIsMuted(saved.soundMuted);
      sound.setMuted(saved.soundMuted);
    }
    setGameState('playing');
    setActiveModal('none');
  };

  const handleSaveCurrentGame = () => {
    const data: SaveData = {
      version: 1,
      playerPos: [0, 0, 10],
      playerRot: Math.PI,
      stats,
      builtBuildingIds,
      completedMissionIds,
      decisionsMadeIds,
      quality: graphicsQuality,
      soundMuted: isMuted,
      timestamp: Date.now(),
    };
    saveGame(data);
    setHasSavedGame(true);
  };

  const handleAdvanceDay = () => {
    const { nextStats, log } = simulateDay(stats, builtBuildingIds, decisionsMadeIds);
    setStats(nextStats);
    setSimulationLogs((prev) => [log, ...prev].slice(0, 12));
    sound.playCoin();
  };

  const handleUpdateTaxRate = (taxRate: TaxRate) => {
    setStats((prev) => ({ ...prev, taxRate }));
  };

  const handleUpdateRationing = (rationing: RationingLevel) => {
    setStats((prev) => ({ ...prev, rationing }));
  };

  const handleConstructBuilding = (building: Building) => {
    const { nextStats, nextBuilt } = constructBuilding(stats, builtBuildingIds, building);
    setStats(nextStats);
    setBuiltBuildingIds(nextBuilt);
  };

  const handleEnactDecision = (decision: Decision) => {
    const { nextStats, nextDecisions } = enactDecision(stats, decisionsMadeIds, decision);
    setStats(nextStats);
    setDecisionsMadeIds(nextDecisions);
  };

  const handleClaimMissionReward = (mission: Mission) => {
    if (completedMissionIds.includes(mission.id)) return;

    setStats((prev) => ({
      ...prev,
      treasury: prev.treasury + mission.rewardTreasury,
      happiness: Math.min(100, prev.happiness + mission.rewardHappiness),
      stability: Math.min(100, prev.stability + mission.rewardStability),
    }));

    const nextCompleted = [...completedMissionIds, mission.id];
    setCompletedMissionIds(nextCompleted);

    setVictoryToast(`Decree Fulfilled! ${mission.title}: Granted "${mission.rewardHonorTitle}"`);
    setTimeout(() => setVictoryToast(null), 5000);

    // Check for overall campaign victory if all 3 missions done
    if (nextCompleted.length >= MISSIONS_LIST.length) {
      setGameState('gameover');
    }
  };

  const handleOpenInteractable = (zone: InteractableZone) => {
    if (zone.actionType === 'court') {
      setActiveModal('court');
    } else if (zone.actionType === 'management') {
      setActiveModal('ledger');
    } else if (zone.actionType === 'souk') {
      setActiveModal('ledger');
    } else if (zone.actionType === 'missions') {
      setActiveModal('missions');
    } else if (zone.actionType === 'fountain') {
      sound.playOudChord();
      setStats((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 2),
      }));
      setVictoryToast('Reflected at the Royal Fountain. Serenity blesses Sultan Ayaan (+2% Happiness).');
      setTimeout(() => setVictoryToast(null), 4000);
    }
  };

  // Find active mission to display on HUD
  const activeMission =
    MISSIONS_LIST.find((m) => !completedMissionIds.includes(m.id)) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans">
      {/* 3D WebGL Viewport */}
      <ThreeCanvas
        gameState={gameState}
        cameraMode={cameraMode}
        graphicsQuality={graphicsQuality}
        onInteractableChange={setCurrentInteractable}
        onOpenInteractable={handleOpenInteractable}
        joystickVectorRef={joystickVectorRef}
        isSprintingRef={isSprintingRef}
        onStaminaChange={setStamina}
      />

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          hasSavedGame={hasSavedGame}
          onContinue={handleContinueGame}
        />
      )}

      {/* Active Game HUD */}
      {gameState === 'playing' && (
        <>
          <HUD
            stats={stats}
            stamina={stamina}
            activeMission={activeMission}
            interactable={currentInteractable}
            onOpenInteractable={handleOpenInteractable}
            onOpenLedger={() => setActiveModal('ledger')}
            onOpenCourt={() => setActiveModal('court')}
            onOpenPause={() => setGameState('paused')}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />

          {/* Collapsible Bottom Control Dock */}
          <BottomDock
            onOpenLedger={() => setActiveModal('ledger')}
            onOpenCourt={() => setActiveModal('court')}
            onOpenMissions={() => setActiveModal('missions')}
            onAdvanceDay={handleAdvanceDay}
            cameraMode={cameraMode}
            onChangeCameraMode={setCameraMode}
            graphicsQuality={graphicsQuality}
            onChangeGraphicsQuality={setGraphicsQuality}
          />

          {/* Mobile On-Screen Controls */}
          <MobileControls
            joystickVectorRef={joystickVectorRef}
            isSprintingRef={isSprintingRef}
            onTriggerInteract={() => {
              if (currentInteractable) handleOpenInteractable(currentInteractable);
            }}
            onOpenLedger={() => setActiveModal('ledger')}
            hasInteractable={currentInteractable !== null}
          />
        </>
      )}

      {/* Royal Victory Toast */}
      {victoryToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#14532d] border-2 border-[#d4af37] text-[#fef9c3] rounded-lg shadow-2xl font-serif text-sm tracking-wide text-center animate-fade-in pointer-events-none">
          {victoryToast}
        </div>
      )}

      {/* Kingdom Management Modal */}
      {activeModal === 'ledger' && (
        <KingdomManagementModal
          stats={stats}
          builtBuildingIds={builtBuildingIds}
          simulationLogs={simulationLogs}
          onClose={() => setActiveModal('none')}
          onUpdateTaxRate={handleUpdateTaxRate}
          onUpdateRationing={handleUpdateRationing}
          onConstructBuilding={handleConstructBuilding}
          onAdvanceDay={handleAdvanceDay}
        />
      )}

      {/* Royal Court Modal */}
      {activeModal === 'court' && (
        <RoyalCourtModal
          stats={stats}
          decisionsMadeIds={decisionsMadeIds}
          onEnactDecision={handleEnactDecision}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Missions Modal */}
      {activeModal === 'missions' && (
        <MissionsModal
          stats={stats}
          builtBuildingIds={builtBuildingIds}
          decisionsMadeIds={decisionsMadeIds}
          completedMissionIds={completedMissionIds}
          onClaimMissionReward={handleClaimMissionReward}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Pause Menu Modal */}
      {gameState === 'paused' && (
        <PauseModal
          stats={stats}
          graphicsQuality={graphicsQuality}
          isMuted={isMuted}
          onResume={() => setGameState('playing')}
          onSave={handleSaveCurrentGame}
          onLoad={handleContinueGame}
          onToggleMute={toggleMute}
          onChangeQuality={setGraphicsQuality}
          onReturnToTitle={() => setGameState('title')}
        />
      )}

      {/* Grand Victory Modal when introductory campaign completes */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 select-none pointer-events-auto">
          <div className="bg-[#1b1510] border-2 border-[#d4af37] rounded-xl max-w-lg w-full p-6 text-[#f4eedb] shadow-[0_12px_45px_rgba(0,0,0,0.95)] text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#14532d] border-2 border-[#d4af37] flex items-center justify-center text-3xl">
              👑
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fde047] uppercase tracking-wider">
              Golden Age of Ayaan
            </h2>
            <div className="h-0.5 w-32 bg-[#d4af37] mx-auto" />
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif">
              Through justice, stewardship, and foresight, Sultan Ayaan Ahmed has delivered the Sultanate into an era of extraordinary prosperity, healing, and peace.
            </p>

            {/* End of Campaign Stats */}
            <div className="grid grid-cols-3 gap-2 py-3 bg-[#120e0a] rounded border border-stone-800 text-xs font-mono">
              <div>
                <span className="text-stone-400 block">Reign</span>
                <span className="text-[#fef08a] font-bold text-sm">Day {stats.day}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Treasury</span>
                <span className="text-[#fef08a] font-bold text-sm">{stats.treasury.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Happiness</span>
                <span className="text-emerald-400 font-bold text-sm">{stats.happiness}%</span>
              </div>
            </div>

            <button
              data-start="true"
              onClick={() => {
                sound.playOudChord();
                setGameState('playing');
              }}
              className="w-full py-3 bg-[#14532d] hover:bg-[#166534] text-[#fef9c3] font-serif font-bold text-sm rounded border border-[#d4af37] cursor-pointer shadow-lg"
            >
              Continue Ruling The Sultanate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
