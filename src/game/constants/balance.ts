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
  goalFreezeMs: 1_350,
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
    label: '쉬움',
    reactionMs: 320,
    targetError: 156,
    jumpChance: 0.48,
    aggression: 0.45,
    specialChance: 0.3,
    defendBias: 0.76,
  },
  normal: {
    id: 'normal',
    label: '보통',
    reactionMs: 185,
    targetError: 76,
    jumpChance: 0.72,
    aggression: 0.62,
    specialChance: 0.5,
    defendBias: 0.58,
  },
  hard: {
    id: 'hard',
    label: '어려움',
    reactionMs: 110,
    targetError: 24,
    jumpChance: 0.92,
    aggression: 0.78,
    specialChance: 0.76,
    defendBias: 0.44,
  },
};
