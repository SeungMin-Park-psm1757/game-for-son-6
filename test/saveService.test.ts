import { describe, expect, it } from 'vitest';
import { DEFAULT_SAVE_DATA, SaveService, buildRewardBreakdown } from '../src/game/services/SaveService';
import type { MatchResult } from '../src/game/types/MatchTypes';

class MemoryStorage implements Storage {
  private readonly map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

function createMatchResult(partial: Partial<MatchResult> = {}): MatchResult {
  return {
    selection: {
      playerCharacterId: 'blaze',
      cpuCharacterId: 'bolt',
      difficultyId: 'normal',
      stadiumId: 'sunset-arena',
    },
    playerScore: 3,
    cpuScore: 1,
    winner: 'player',
    coinsEarned: 32,
    bonusCoins: 18,
    wentOvertime: false,
    suddenDeath: false,
    ...partial,
  };
}

describe('SaveService', () => {
  it('loads defaults and unlocks a character when coins are available', () => {
    const storage = new MemoryStorage();
    const service = new SaveService(storage);

    service.load();
    storage.setItem(
      'goalpop-arena-web-save',
      JSON.stringify({
        ...DEFAULT_SAVE_DATA,
        coins: 200,
      }),
    );

    service.load();
    const unlocked = service.tryUnlockCharacter('atlas', 120);

    expect(unlocked).toBe(true);
    expect(service.getSnapshot().coins).toBe(80);
    expect(service.isCharacterUnlocked('atlas')).toBe(true);
  });

  it('grants a first-win bonus only once', () => {
    const firstReward = buildRewardBreakdown(
      DEFAULT_SAVE_DATA,
      'player',
      'hard',
      'ripple',
    );
    const afterFirstWin = {
      ...DEFAULT_SAVE_DATA,
      firstWinCharacters: ['ripple'],
    };
    const secondReward = buildRewardBreakdown(
      afterFirstWin,
      'player',
      'hard',
      'ripple',
    );

    expect(firstReward.bonusCoins).toBe(18);
    expect(secondReward.bonusCoins).toBe(0);
  });

  it('unlocks the neon stadium after enough goals are scored', () => {
    const service = new SaveService(new MemoryStorage());

    service.load();
    service.applyMatchResult(
      createMatchResult({
        playerScore: 8,
        cpuScore: 0,
      }),
    );

    expect(service.isStadiumUnlocked('neon-night')).toBe(true);
  });
});
