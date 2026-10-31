import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_STATS,
  simulateDay,
  canAfford,
  enactDecision,
  constructBuilding,
  BUILDINGS_LIST,
  ADVISORS_LIST,
  MISSIONS_LIST,
} from './simulation';

test('Initial kingdom stats are healthy and balanced', () => {
  assert.equal(INITIAL_STATS.treasury, 1200);
  assert.equal(INITIAL_STATS.population, 4500);
  assert.equal(INITIAL_STATS.happiness, 75);
  assert.equal(INITIAL_STATS.stability, 80);
});

test('simulateDay progresses day counter and calculates net tax income', () => {
  const { nextStats, log } = simulateDay(INITIAL_STATS, [], []);
  assert.equal(nextStats.day, 2);
  assert(nextStats.treasury >= INITIAL_STATS.treasury);
  assert(log.includes('Day 2'));
});

test('canAfford accurately checks gold and food availability', () => {
  assert.equal(canAfford(INITIAL_STATS, 500, 200), true);
  assert.equal(canAfford(INITIAL_STATS, 5000, 200), false);
  assert.equal(canAfford(INITIAL_STATS, 500, 2000), false);
});

test('enactDecision updates treasury, food, happiness, stability, and records decision', () => {
  const waterDecision = ADVISORS_LIST[0].decisions[0]; // water_crisis
  const { nextStats, nextDecisions } = enactDecision(INITIAL_STATS, [], waterDecision);

  assert.equal(nextStats.treasury, INITIAL_STATS.treasury - waterDecision.costTreasury);
  assert.equal(nextStats.food, INITIAL_STATS.food - waterDecision.costFood);
  assert.equal(nextStats.happiness, INITIAL_STATS.happiness + waterDecision.rewardHappiness);
  assert.equal(nextDecisions.includes('water_crisis'), true);

  // Enacting again should be idempotent
  const repeat = enactDecision(nextStats, nextDecisions, waterDecision);
  assert.equal(repeat.nextStats.treasury, nextStats.treasury);
});

test('constructBuilding applies unique building modifiers', () => {
  const hospital = BUILDINGS_LIST.find((b) => b.id === 'hospital')!;
  const { nextStats, nextBuilt } = constructBuilding(INITIAL_STATS, [], hospital);

  assert.equal(nextStats.treasury, INITIAL_STATS.treasury - hospital.cost);
  assert.equal(nextBuilt.includes('hospital'), true);
  assert(nextStats.happiness > INITIAL_STATS.happiness);
});

test('Missions validate conditions properly', () => {
  const m1 = MISSIONS_LIST[0]; // Village Crisis
  assert.equal(m1.isComplete(INITIAL_STATS, [], []), false);
  assert.equal(m1.isComplete(INITIAL_STATS, [], ['water_crisis']), true);
  assert.equal(m1.isComplete(INITIAL_STATS, ['aqueduct'], []), true);

  const m2 = MISSIONS_LIST[1]; // Royal Construction
  assert.equal(m2.isComplete(INITIAL_STATS, [], []), false);
  assert.equal(m2.isComplete(INITIAL_STATS, ['hospital'], []), true);
});
