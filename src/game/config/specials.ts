import type { SpecialConfig } from '../types/SpecialConfig';

export const SPECIALS: SpecialConfig[] = [
  {
    id: 'fire-shot',
    name: '화염 슛',
    shortLabel: '화염슛',
    color: 0xff6b57,
    description: '불꽃 추진력을 실어 공을 강하게 앞으로 쏜다.',
    cooldownMs: 5_200,
    meterCost: 100,
    durationMs: 1_400,
  },
  {
    id: 'dash-kick',
    name: '대시 킥',
    shortLabel: '대시킥',
    color: 0x53c7ff,
    description: '순간 돌진으로 낮고 빠른 일격을 날려 흐르는 공을 낚아챈다.',
    cooldownMs: 4_800,
    meterCost: 100,
    durationMs: 350,
  },
  {
    id: 'wall-block',
    name: '골문 벽',
    shortLabel: '벽세움',
    color: 0x3fd47e,
    description: '골문 근처에 두꺼운 벽을 세워 상대 슛을 막아낸다.',
    cooldownMs: 5_800,
    meterCost: 100,
    durationMs: 2_200,
  },
  {
    id: 'curve-touch',
    name: '커브 터치',
    shortLabel: '커브',
    color: 0xbf7cff,
    description: '강한 회전을 더해 직선으로 가던 공을 휘게 만든다.',
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
