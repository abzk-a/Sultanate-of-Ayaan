export type RationingLevel = 'austere' | 'normal' | 'generous';
export type TaxRate = 'low' | 'moderate' | 'high';
export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface KingdomStats {
  treasury: number;       // Gold Dinars
  population: number;     // Citizen count
  food: number;           // Bushels of grain
  happiness: number;      // 0 - 100%
  stability: number;      // 0 - 100%
  military: number;       // Soldier strength
  day: number;            // Reign day
  taxRate: TaxRate;       // Low (5%), Moderate (12%), High (25%)
  rationing: RationingLevel;
}

export interface Building {
  id: string;
  name: string;
  category: 'welfare' | 'infrastructure' | 'military' | 'commerce';
  cost: number;
  maintenance: number;
  built: boolean;
  description: string;
  effectsDescription: string;
  applyEffect: (stats: KingdomStats) => void;
}

export interface Decision {
  id: string;
  advisorId: string;
  title: string;
  description: string;
  costTreasury: number;
  costFood: number;
  rewardHappiness: number;
  rewardStability: number;
  rewardMilitary: number;
  rewardTreasuryDaily?: number;
  consequences: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  greeting: string;
  portraitIcon: string;
  decisions: Decision[];
}

export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objectiveText: string;
  isComplete: (stats: KingdomStats, builtIds: string[], decisionsMade: string[]) => boolean;
  rewardTreasury: number;
  rewardHappiness: number;
  rewardStability: number;
  rewardHonorTitle: string;
}

export interface SaveData {
  version: number;
  playerPos: [number, number, number];
  playerRot: number;
  stats: KingdomStats;
  builtBuildingIds: string[];
  completedMissionIds: string[];
  decisionsMadeIds: string[];
  quality: GraphicsQuality;
  soundMuted: boolean;
  timestamp: number;
}
