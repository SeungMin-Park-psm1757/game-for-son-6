import type { CharacterConfig } from '../types/CharacterConfig';

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'blaze',
    name: 'Blaze',
    title: 'Solar Striker',
    intro: 'Charges the ball with a blazing rocket shot.',
    specialId: 'fire-shot',
    unlockCost: 0,
    visuals: {
      skin: 0xf6c387,
      hair: 0x61221a,
      primary: 0xff6b57,
      secondary: 0xffcb63,
      accent: 0xfff2e1,
    },
    stats: {
      speed: 1.02,
      jump: 1,
      kick: 1.12,
      meterGain: 1,
    },
  },
  {
    id: 'bolt',
    name: 'Bolt',
    title: 'Turbo Trickster',
    intro: 'Explodes forward with a quick burst dash kick.',
    specialId: 'dash-kick',
    unlockCost: 0,
    visuals: {
      skin: 0xffd7b0,
      hair: 0x1b3254,
      primary: 0x53c7ff,
      secondary: 0xffdf4f,
      accent: 0xffffff,
    },
    stats: {
      speed: 1.12,
      jump: 0.98,
      kick: 0.98,
      meterGain: 1.06,
    },
  },
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'Goal Gatekeeper',
    intro: 'Summons a short-lived wall that blocks screaming shots.',
    specialId: 'wall-block',
    unlockCost: 120,
    visuals: {
      skin: 0xefc39a,
      hair: 0x30333d,
      primary: 0x3fd47e,
      secondary: 0x0f5d39,
      accent: 0xf7fff0,
    },
    stats: {
      speed: 0.93,
      jump: 0.95,
      kick: 1.04,
      meterGain: 1.08,
    },
  },
  {
    id: 'ripple',
    name: 'Ripple',
    title: 'Curve Artist',
    intro: 'Bends the ball into a wobbling arc after contact.',
    specialId: 'curve-touch',
    unlockCost: 180,
    visuals: {
      skin: 0xf0c7aa,
      hair: 0x5f2370,
      primary: 0xbf7cff,
      secondary: 0x4fdbcc,
      accent: 0xfff5ff,
    },
    stats: {
      speed: 1,
      jump: 1.06,
      kick: 1,
      meterGain: 1.14,
    },
  },
];

export const DEFAULT_UNLOCKED_CHARACTER_IDS = ['blaze', 'bolt'];

export function getCharacterById(id: string): CharacterConfig {
  const character = CHARACTERS.find((entry) => entry.id === id);

  if (!character) {
    throw new Error(`Unknown character: ${id}`);
  }

  return character;
}

