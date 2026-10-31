import { KingdomStats, Building, Advisor, Decision, Mission, SaveData, RationingLevel, TaxRate } from '../types/game';

export const INITIAL_STATS: KingdomStats = {
  treasury: 1200,     // 1200 Dinars
  population: 4500,   // Citizens
  food: 800,          // Bushels
  happiness: 75,      // 75%
  stability: 80,      // 80%
  military: 250,      // Garrison troops
  day: 1,
  taxRate: 'moderate',
  rationing: 'normal',
};

export const BUILDINGS_LIST: Building[] = [
  {
    id: 'hospital',
    name: 'Royal Bimaristan (Hospital)',
    category: 'welfare',
    cost: 500,
    maintenance: 25,
    built: false,
    description: 'A grand center of Islamic medicine and healing providing free herbal care to all citizens.',
    effectsDescription: '+20% Public Happiness, +10 Stability, population growth +15/day.',
    applyEffect: (s) => {
      s.happiness = Math.min(100, s.happiness + 20);
      s.stability = Math.min(100, s.stability + 10);
    },
  },
  {
    id: 'aqueduct',
    name: 'Oasis Aqueduct & Wells',
    category: 'infrastructure',
    cost: 400,
    maintenance: 15,
    built: false,
    description: 'Arched stone channels transporting cool mountain spring water into city cisterns and fountains.',
    effectsDescription: '+15 Food harvest/day, +10% Public Happiness.',
    applyEffect: (s) => {
      s.happiness = Math.min(100, s.happiness + 10);
      s.food += 100;
    },
  },
  {
    id: 'caravanserai',
    name: 'Grand Caravanserai',
    category: 'commerce',
    cost: 450,
    maintenance: 20,
    built: false,
    description: 'A fortified desert courtyard inn hosting merchants from the Silk and Spice routes.',
    effectsDescription: '+45 Dinars trade revenue/day, +5 Stability.',
    applyEffect: (s) => {
      s.treasury += 150;
      s.stability = Math.min(100, s.stability + 5);
    },
  },
  {
    id: 'granary',
    name: 'Royal Granary Silos',
    category: 'infrastructure',
    cost: 350,
    maintenance: 10,
    built: false,
    description: 'Deep subterranean grain vaults engineered to preserve wheat for years against desert heat.',
    effectsDescription: '+250 Grain storage reserve, prevents famine disasters.',
    applyEffect: (s) => {
      s.food += 250;
    },
  },
  {
    id: 'barracks',
    name: 'Mameluke Garrison Barracks',
    category: 'military',
    cost: 500,
    maintenance: 35,
    built: false,
    description: 'Training grounds and armory for elite royal cavalry and city watch archers.',
    effectsDescription: '+120 Military Strength, +15 Stability.',
    applyEffect: (s) => {
      s.military += 120;
      s.stability = Math.min(100, s.stability + 15);
    },
  },
  {
    id: 'souk_expansion',
    name: 'Silk & Spice Souk Expansion',
    category: 'commerce',
    cost: 300,
    maintenance: 15,
    built: false,
    description: 'Covered vaulted alleys housing perfumers, weavers, metal smiths, and spice merchants.',
    effectsDescription: '+30 Dinars tax revenue/day, +8% Happiness.',
    applyEffect: (s) => {
      s.happiness = Math.min(100, s.happiness + 8);
    },
  },
];

export const ADVISORS_LIST: Advisor[] = [
  {
    id: 'vizier',
    name: 'Tariq ibn Mansur',
    title: 'Grand Vizier of State',
    greeting: 'Assalamu Alaikum, my Sultan. The royal divan awaits your wisdom on civil affairs, cisterns, and the welfare of our people.',
    portraitIcon: 'scroll',
    decisions: [
      {
        id: 'water_crisis',
        advisorId: 'vizier',
        title: 'Repair Outlying Village Cisterns',
        description: 'Drought threatens the date palm groves and oasis villages outside our walls. Allocate relief funds and masonry workers immediately.',
        costTreasury: 250,
        costFood: 100,
        rewardHappiness: 15,
        rewardStability: 10,
        rewardMilitary: 0,
        consequences: 'The oasis farmers praise Sultan Ayaan’s justice. Water reserves are restored.',
      },
      {
        id: 'grain_subsidy',
        advisorId: 'vizier',
        title: 'Royal Grain Price Subsidy',
        description: 'Release grain reserves to bakers to keep bread affordable for poorer families in the southern quarter.',
        costTreasury: 150,
        costFood: 120,
        rewardHappiness: 12,
        rewardStability: 8,
        rewardMilitary: 0,
        consequences: 'Bread prices drop across the capital souk. Citizens offer prayers for the Sultanate.',
      },
      {
        id: 'scholars_patronage',
        advisorId: 'vizier',
        title: 'Found House of Knowledge & Astronomy',
        description: 'Gather cartographers, astronomers, and translators to draft navigational star charts and medical treatises.',
        costTreasury: 350,
        costFood: 0,
        rewardHappiness: 10,
        rewardStability: 15,
        rewardMilitary: 0,
        consequences: 'Renowned scholars flock to Madinat al-Ayaan, elevating the Sultanate’s prestige.',
      },
    ],
  },
  {
    id: 'general',
    name: 'Qasim al-Sayf',
    title: 'Commander of the Royal Guard',
    greeting: 'Sultan Ayaan, the city ramparts stand tall, yet the desert borders require vigilant vigilance. Command your army.',
    portraitIcon: 'shield',
    decisions: [
      {
        id: 'recruit_mamelukes',
        advisorId: 'general',
        title: 'Recruit Elite Mounted Guards',
        description: 'Muster 80 experienced desert riders mounted on fine Arabian steeds to safeguard the capital approaches.',
        costTreasury: 300,
        costFood: 80,
        rewardHappiness: -2,
        rewardStability: 12,
        rewardMilitary: 80,
        consequences: 'The royal cavalry conducts disciplined drills outside the East Gate. Lawlessness diminishes.',
      },
      {
        id: 'fortify_ramparts',
        advisorId: 'general',
        title: 'Reinforce City Battlements & Trebuchets',
        description: 'Mount defensive ballistas on the watchtowers and stock arrow arsenals along the city walls.',
        costTreasury: 350,
        costFood: 0,
        rewardHappiness: 0,
        rewardStability: 18,
        rewardMilitary: 50,
        consequences: 'Madinat al-Ayaan becomes an impregnable stronghold against any desert raiders.',
      },
      {
        id: 'caravan_escorts',
        advisorId: 'general',
        title: 'Deploy Desert Patrol Outposts',
        description: 'Station guard posts at desert waystations to protect traveling pilgrims and merchant caravans.',
        costTreasury: 200,
        costFood: 60,
        rewardHappiness: 5,
        rewardStability: 10,
        rewardMilitary: 30,
        rewardTreasuryDaily: 15,
        consequences: 'Banditry ceases along trade routes. Merchants pay safe passage tariffs.',
      },
    ],
  },
  {
    id: 'merchant',
    name: 'Bilal al-Taji',
    title: 'Guildmaster of Merchants',
    greeting: 'Greetings, Commander of the Faithful. Silk from the east and frankincense from the south await royal sanction for expansion.',
    portraitIcon: 'coins',
    decisions: [
      {
        id: 'silk_caravan',
        advisorId: 'merchant',
        title: 'Charter the Great Silk Trade Caravan',
        description: 'Fund an expedition of one hundred laden camels to trade damask fabrics, saffron, and fine glassware with neighboring realms.',
        costTreasury: 400,
        costFood: 100,
        rewardHappiness: 8,
        rewardStability: 5,
        rewardMilitary: 0,
        rewardTreasuryDaily: 40,
        consequences: 'The caravan departs with fanfare, securing lucrative trade treaties and high treasury dividends.',
      },
      {
        id: 'spice_depot',
        advisorId: 'merchant',
        title: 'Establish Central Spice Exchange',
        description: 'Construct a sheltered warehouse for cinnamon, cardamom, and indigo in the marketplace harbor.',
        costTreasury: 300,
        costFood: 0,
        rewardHappiness: 6,
        rewardStability: 8,
        rewardMilitary: 0,
        rewardTreasuryDaily: 25,
        consequences: 'Foreign merchants settle permanently, boosting souk activity and customs duties.',
      },
      {
        id: 'gold_standard',
        advisorId: 'merchant',
        title: 'Standardize Royal Coinage & Weights',
        description: 'Melt bullion into certified gold Ayaan Dinars with the Sultan’s seal, eradicating counterfeits.',
        costTreasury: 250,
        costFood: 0,
        rewardHappiness: 4,
        rewardStability: 14,
        rewardMilitary: 0,
        consequences: 'Commercial confidence surges across all markets within the Sultanate.',
      },
    ],
  },
];

export const MISSIONS_LIST: Mission[] = [
  {
    id: 'mission_1',
    title: 'The Village Crisis',
    subtitle: 'Relief for the Oasis Settlements',
    description: 'An extended dry season has depleted the village water cisterns and grain stores. The oasis elders look to Sultan Ayaan for justice and benevolence.',
    objectiveText: 'Enact the "Repair Outlying Village Cisterns" royal decision or build the Oasis Aqueduct.',
    isComplete: (stats, builtIds, decisionsMade) => {
      return decisionsMade.includes('water_crisis') || builtIds.includes('aqueduct');
    },
    rewardTreasury: 350,
    rewardHappiness: 15,
    rewardStability: 10,
    rewardHonorTitle: 'Protector of the Oasis',
  },
  {
    id: 'mission_2',
    title: 'The Royal Construction',
    subtitle: 'Healing the Sultanate',
    description: 'Seasonal desert fevers threaten our citizens. Sultan Ayaan has pledged to construct the Royal Bimaristan (Hospital) to provide free medicine and care.',
    objectiveText: 'Commission and complete construction of the Royal Bimaristan.',
    isComplete: (stats, builtIds) => {
      return builtIds.includes('hospital');
    },
    rewardTreasury: 400,
    rewardHappiness: 20,
    rewardStability: 12,
    rewardHonorTitle: 'The Compassionate Sovereign',
  },
  {
    id: 'mission_3',
    title: 'The Royal Trade Route',
    subtitle: 'Wealth of the Desert Horizons',
    description: 'To secure the future prosperity of the Sultanate, establish a major trade route and achieve over 1,500 Dinars in the royal treasury.',
    objectiveText: 'Charter the Silk Caravan via Guildmaster Bilal and reach 1,500+ Dinars in Treasury.',
    isComplete: (stats, builtIds, decisionsMade) => {
      return decisionsMade.includes('silk_caravan') && stats.treasury >= 1500;
    },
    rewardTreasury: 500,
    rewardHappiness: 15,
    rewardStability: 15,
    rewardHonorTitle: 'Architect of Prosperity',
  },
];

/**
 * Calculates a single simulation day turn for the Sultanate
 */
export function simulateDay(
  currentStats: KingdomStats,
  builtBuildingIds: string[],
  decisionsMadeIds: string[]
): { nextStats: KingdomStats; log: string } {
  const stats: KingdomStats = { ...currentStats };
  stats.day += 1;

  // 1. Tax Calculation
  // Moderate = 12 Dinars per 1000 citizens = 0.012
  // Low = 6 Dinars per 1000 citizens = 0.006 (+5% happiness bonus)
  // High = 25 Dinars per 1000 citizens = 0.025 (-10% happiness penalty)
  let taxMultiplier = 0.012;
  let taxHappinessDelta = 0;
  if (stats.taxRate === 'low') {
    taxMultiplier = 0.006;
    taxHappinessDelta = 2;
  } else if (stats.taxRate === 'high') {
    taxMultiplier = 0.024;
    taxHappinessDelta = -4;
  }

  const baseTax = Math.round(stats.population * taxMultiplier);

  // Bonus daily revenue from decisions and buildings
  let extraDailyIncome = 0;
  if (decisionsMadeIds.includes('caravan_escorts')) extraDailyIncome += 15;
  if (decisionsMadeIds.includes('silk_caravan')) extraDailyIncome += 40;
  if (decisionsMadeIds.includes('spice_depot')) extraDailyIncome += 25;
  if (builtBuildingIds.includes('caravanserai')) extraDailyIncome += 45;
  if (builtBuildingIds.includes('souk_expansion')) extraDailyIncome += 30;

  // Maintenance cost of buildings
  let maintenanceCost = 0;
  for (const bId of builtBuildingIds) {
    const b = BUILDINGS_LIST.find((x) => x.id === bId);
    if (b) maintenanceCost += b.maintenance;
  }

  const netIncome = baseTax + extraDailyIncome - maintenanceCost;
  stats.treasury = Math.max(0, stats.treasury + netIncome);

  // 2. Food Production & Consumption
  // Base harvest per 1000 people ~ 20 bushels
  let foodProduced = Math.round(stats.population * 0.018);
  if (builtBuildingIds.includes('aqueduct')) foodProduced += 25;

  // Consumption based on rationing
  let foodPer1000 = 20; // normal
  let rationHappinessDelta = 0;
  if (stats.rationing === 'austere') {
    foodPer1000 = 12;
    rationHappinessDelta = -5;
  } else if (stats.rationing === 'generous') {
    foodPer1000 = 30;
    rationHappinessDelta = 3;
  }

  const foodConsumed = Math.round((stats.population * foodPer1000) / 1000);
  stats.food = Math.max(0, stats.food + foodProduced - foodConsumed);

  // Famine penalty if food hits zero
  let faminePenalty = 0;
  if (stats.food === 0) {
    faminePenalty = -15;
    stats.population = Math.max(1000, stats.population - 50);
  }

  // 3. Happiness update
  const hospitalBonus = builtBuildingIds.includes('hospital') ? 2 : 0;
  stats.happiness = Math.max(
    5,
    Math.min(
      100,
      stats.happiness + taxHappinessDelta + rationHappinessDelta + faminePenalty + hospitalBonus
    )
  );

  // 4. Stability update
  // High military and high happiness sustain high stability
  const happinessContribution = (stats.happiness - 50) * 0.1;
  const militaryContribution = (stats.military - 200) * 0.02;
  stats.stability = Math.max(
    10,
    Math.min(100, Math.round(stats.stability + happinessContribution + militaryContribution))
  );

  // 5. Population growth
  if (stats.happiness > 60 && stats.food > 100) {
    const growth = Math.round(stats.population * 0.003) + (builtBuildingIds.includes('hospital') ? 15 : 0);
    stats.population += growth;
  }

  const log = `Day ${stats.day}: Net Income +${netIncome} Dinars (${baseTax} tax + ${extraDailyIncome} trade - ${maintenanceCost} maint). Food: +${foodProduced} / -${foodConsumed}. Happiness: ${stats.happiness}%.`;

  return { nextStats: stats, log };
}

export function canAfford(stats: KingdomStats, costTreasury: number, costFood: number = 0): boolean {
  return stats.treasury >= costTreasury && stats.food >= costFood;
}

export function enactDecision(
  currentStats: KingdomStats,
  decisionsMadeIds: string[],
  decision: Decision
): { nextStats: KingdomStats; nextDecisions: string[] } {
  if (decisionsMadeIds.includes(decision.id)) {
    return { nextStats: currentStats, nextDecisions: decisionsMadeIds };
  }

  const nextStats: KingdomStats = {
    ...currentStats,
    treasury: Math.max(0, currentStats.treasury - decision.costTreasury),
    food: Math.max(0, currentStats.food - decision.costFood),
    happiness: Math.min(100, Math.max(0, currentStats.happiness + decision.rewardHappiness)),
    stability: Math.min(100, Math.max(0, currentStats.stability + decision.rewardStability)),
    military: currentStats.military + decision.rewardMilitary,
  };

  const nextDecisions = [...decisionsMadeIds, decision.id];
  return { nextStats, nextDecisions };
}

export function constructBuilding(
  currentStats: KingdomStats,
  builtIds: string[],
  building: Building
): { nextStats: KingdomStats; nextBuilt: string[] } {
  if (builtIds.includes(building.id) || currentStats.treasury < building.cost) {
    return { nextStats: currentStats, nextBuilt: builtIds };
  }

  const nextStats: KingdomStats = {
    ...currentStats,
    treasury: currentStats.treasury - building.cost,
  };

  building.applyEffect(nextStats);
  const nextBuilt = [...builtIds, building.id];
  return { nextStats, nextBuilt };
}

const SAVE_KEY = 'sultanate_of_ayaan_save_v1';

export function saveGame(data: SaveData): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save game', err);
    return false;
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch (err) {
    console.error('Failed to load game', err);
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.error('Failed to clear save', err);
  }
}
