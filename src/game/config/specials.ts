import type { SpecialConfig } from '../types/SpecialConfig';

export const SPECIALS: SpecialConfig[] = [
  {
    id: 'fire-shot',
    name: 'Fire Shot',
    shortLabel: 'FIRE',
    color: 0xff6b57,
    description: 'Launch a fierce blazing blast that spikes the ball forward.',
    cooldownMs: 5_200,
    meterCost: 100,
    durationMs: 1_400,
  },
  {
    id: 'dash-kick',
    name: 'Dash Kick',
    shortLabel: 'DASH',
    color: 0x53c7ff,
    description: 'Burst ahead for a low, fast strike that catches loose balls.',
    cooldownMs: 4_800,
    meterCost: 100,
    durationMs: 350,
  },
  {
    id: 'wall-block',
    name: 'Wall Block',
    shortLabel: 'WALL',
    color: 0x3fd47e,
    description: 'Pop up a chunky barrier near your goal to stuff a shot.',
    cooldownMs: 5_800,
    meterCost: 100,
    durationMs: 2_200,
  },
  {
    id: 'curve-touch',
    name: 'Curve Touch',
    shortLabel: 'CURVE',
    color: 0xbf7cff,
    description: 'Add a spinning bend that drags the ball off a straight line.',
    cooldownMs: 5_000,
    meterCost: 100,
    durationMs: 2_100,
  },
];

export function getSpecialById(id: string): SpecialConfig {
  const special = SPECIALS.find((entry) => entry.id === id);

  if (!special) {
    throw new Error(`Unknown special: ${id}`);
  }

  return special;
}
