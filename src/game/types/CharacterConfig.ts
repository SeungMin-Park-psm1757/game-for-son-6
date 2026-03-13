export type SpecialId = 'fire-shot' | 'dash-kick' | 'wall-block' | 'curve-touch';

export interface CharacterVisualConfig {
  skin: number;
  hair: number;
  primary: number;
  secondary: number;
  accent: number;
}

export interface CharacterStats {
  speed: number;
  jump: number;
  kick: number;
  meterGain: number;
}

export interface CharacterConfig {
  id: string;
  name: string;
  title: string;
  intro: string;
  specialId: SpecialId;
  unlockCost: number;
  visuals: CharacterVisualConfig;
  stats: CharacterStats;
}

