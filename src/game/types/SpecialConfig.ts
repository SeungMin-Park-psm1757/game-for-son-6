import type { SpecialId } from './CharacterConfig';

export interface SpecialConfig {
  id: SpecialId;
  name: string;
  shortLabel: string;
  color: number;
  description: string;
  cooldownMs: number;
  meterCost: number;
  durationMs: number;
}

