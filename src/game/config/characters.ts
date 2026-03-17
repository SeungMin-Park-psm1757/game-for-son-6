import type { CharacterConfig } from '../types/CharacterConfig';

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'blaze',
    name: '블레이즈',
    title: '태양 슈터',
    intro: '강한 전진력으로 슛을 뜨겁게 밀어 넣는 공격수다.',
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
    celebrations: [
      { label: '태양 슬라이드', style: 'slide' },
      { label: '불꽃 점프', style: 'bounce' },
      { label: '챔피언 펌프', style: 'pump' },
      { label: '회전 발차기', style: 'spin' },
      { label: '포효 포즈', style: 'pose' },
    ],
  },
  {
    id: 'bolt',
    name: '볼트',
    title: '터보 트리커',
    intro: '순간 가속으로 틈을 파고드는 스피드형 공격수다.',
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
    celebrations: [
      { label: '터보 질주', style: 'slide' },
      { label: '번개 펌프', style: 'pump' },
      { label: '스핀 대시', style: 'spin' },
      { label: '플래시 점프', style: 'bounce' },
      { label: '하이 포즈', style: 'pose' },
    ],
  },
  {
    id: 'atlas',
    name: '아틀라스',
    title: '골문 수문장',
    intro: '묵직한 체격으로 공중볼과 몸싸움에 강한 수비수다.',
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
    celebrations: [
      { label: '가드 포즈', style: 'pose' },
      { label: '거인 점프', style: 'bounce' },
      { label: '철벽 펌프', style: 'pump' },
      { label: '수문장 스핀', style: 'spin' },
      { label: '대지 슬라이드', style: 'slide' },
    ],
  },
  {
    id: 'ripple',
    name: '리플',
    title: '커브 장인',
    intro: '휘어 나가는 터치로 수비 라인을 흔드는 테크니션이다.',
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
    celebrations: [
      { label: '웨이브 포즈', style: 'pose' },
      { label: '곡선 스핀', style: 'spin' },
      { label: '리듬 슬라이드', style: 'slide' },
      { label: '리듬 점프', style: 'bounce' },
      { label: '바운스 펌프', style: 'pump' },
    ],
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
