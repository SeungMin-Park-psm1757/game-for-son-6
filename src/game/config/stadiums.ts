import type { StadiumConfig } from '../types/StadiumConfig';

export const STADIUMS: StadiumConfig[] = [
  {
    id: 'sunset-arena',
    name: '노을 경기장',
    skyTop: 0xffb15e,
    skyBottom: 0xff6b57,
    crowd: 0x5c2945,
    field: 0x3fa55a,
    fieldStripe: 0x4dc86d,
    line: 0xfef6dd,
    goal: 0xffffff,
    unlockGoals: 0,
  },
  {
    id: 'neon-night',
    name: '네온 나이트',
    skyTop: 0x12052b,
    skyBottom: 0x14577e,
    crowd: 0x2b3359,
    field: 0x1c8f61,
    fieldStripe: 0x21a472,
    line: 0xd9fffa,
    goal: 0xc8fbff,
    unlockGoals: 8,
  },
];

export const DEFAULT_UNLOCKED_STADIUM_IDS = ['sunset-arena'];

export function getStadiumById(id: string): StadiumConfig {
  const stadium = STADIUMS.find((entry) => entry.id === id);

  if (!stadium) {
    throw new Error(`Unknown stadium: ${id}`);
  }

  return stadium;
}
