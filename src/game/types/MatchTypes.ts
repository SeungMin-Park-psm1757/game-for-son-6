import type { DifficultyId } from '../constants/balance';

export type MatchWinner = 'player' | 'cpu' | 'draw';
export type MatchPhase =
  | 'intro'
  | 'kickoff'
  | 'live'
  | 'goalFreeze'
  | 'reset'
  | 'overtime'
  | 'finished'
  | 'paused';

export interface MatchSelection {
  playerCharacterId: string;
  cpuCharacterId: string;
  difficultyId: DifficultyId;
  stadiumId: string;
}

export interface MatchResult {
  selection: MatchSelection;
  playerScore: number;
  cpuScore: number;
  winner: MatchWinner;
  coinsEarned: number;
  bonusCoins: number;
  wentOvertime: boolean;
  suddenDeath: boolean;
}

export interface PlayerActions {
  left: boolean;
  right: boolean;
  jump: boolean;
  kick: boolean;
  special: boolean;
  pause: boolean;
}

