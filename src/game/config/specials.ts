import type { SpecialConfig } from '../types/SpecialConfig';

export const SPECIALS: SpecialConfig[] = [
  {
    id: 'fire-shot',
    name: '파이어 슛',
    shortLabel: '파이어',
    color: 0xff6b57,
    description: '전방으로 강한 화염 슛을 실어 공을 묵직하게 밀어 넣는다.',
    cooldownMs: 5_200,
    meterCost: 100,
    durationMs: 1_400,
  },
  {
    id: 'dash-kick',
    name: '대시 킥',
    shortLabel: '대시',
    color: 0x53c7ff,
    description: '순간 가속으로 먼저 파고들어 몸을 실은 태클 킥을 날린다.',
    cooldownMs: 4_800,
    meterCost: 100,
    durationMs: 350,
  },
  {
    id: 'wall-block',
    name: '골문 벽',
    shortLabel: '벽 세우기',
    color: 0x3fd47e,
    description: '골문 앞에 잠깐 벽을 세워 강한 슛 한 번을 버텨 낸다.',
    cooldownMs: 5_800,
    meterCost: 100,
    durationMs: 2_200,
  },
  {
    id: 'curve-touch',
    name: '커브 터치',
    shortLabel: '커브',
    color: 0xbf7cff,
    description: '휘어 나가는 회전을 걸어 직선 궤적을 비틀어 버린다.',
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
