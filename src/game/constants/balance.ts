export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const FIELD_BOUNDS = {
  floorY: 612,
  ceilingY: 62,
  playableLeft: 72,
  playableRight: 1208,
  goalDepth: 72,
  goalHeight: 164,
  goalInnerWidth: 100,
};

export const MATCH_CONSTANTS = {
  matchDurationMs: 45_000,
  overtimeDurationMs: 15_000,
  kickoffDelayMs: 1_000,
  goalFreezeMs: 900,
  moveSpeed: 290,
  airMoveSpeed: 238,
  jumpVelocity: -600,
  gravityY: 1_500,
  kickCooldownMs: 260,
  specialCooldownMs: 5_400,
  ballMaxSpeed: 980,
  ballBounce: 0.94,
  wallDamping: 0.97,
  specialMeterMax: 100,
  specialPassiveGainPerSecond: 8,
  specialTouchGain: 16,
  dashDurationMs: 230,
  kickRangeX: 110,
  kickRangeY: 92,
  kickoffBallLift: -180,
};

export type DifficultyId = 'easy' | 'normal' | 'hard';

export interface DifficultyProfile {
  id: DifficultyId;
  label: string;
  reactionMs: number;
  targetError: number;
  jumpChance: number;
  aggression: number;
  specialChance: number;
  defendBias: number;
}

export const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    reactionMs: 280,
    targetError: 136,
    jumpChance: 0.44,
    aggression: 0.42,
    specialChance: 0.28,
    defendBias: 0.74,
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    reactionMs: 190,
    targetError: 82,
    jumpChance: 0.68,
    aggression: 0.58,
    specialChance: 0.46,
    defendBias: 0.62,
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    reactionMs: 126,
    targetError: 40,
    jumpChance: 0.88,
    aggression: 0.7,
    specialChance: 0.68,
    defendBias: 0.48,
  },
};

