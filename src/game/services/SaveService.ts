import { DEFAULT_UNLOCKED_CHARACTER_IDS } from '../config/characters';
import { DEFAULT_UNLOCKED_STADIUM_IDS, STADIUMS } from '../config/stadiums';
import type { DifficultyId } from '../constants/balance';
import type { MatchResult, MatchWinner } from '../types/MatchTypes';
import type { SaveData } from '../types/SaveData';

const SAVE_KEY = 'goalpop-arena-web-save';
const SAVE_VERSION = 1;

export const DEFAULT_SAVE_DATA: SaveData = {
  version: SAVE_VERSION,
  coins: 0,
  unlockedCharacters: [...DEFAULT_UNLOCKED_CHARACTER_IDS],
  unlockedStadiums: [...DEFAULT_UNLOCKED_STADIUM_IDS],
  firstWinCharacters: [],
  settings: {
    soundOn: true,
  },
  stats: {
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    goalsScored: 0,
    goalsAllowed: 0,
  },
};

export interface RewardBreakdown {
  coinsEarned: number;
  bonusCoins: number;
}

export interface SaveApplyResult {
  snapshot: SaveData;
  newlyUnlockedStadiums: string[];
}

function cloneSaveData(data: SaveData): SaveData {
  return JSON.parse(JSON.stringify(data)) as SaveData;
}

export function buildRewardBreakdown(
  saveData: SaveData,
  winner: MatchWinner,
  difficultyId: DifficultyId,
  playerCharacterId: string,
): RewardBreakdown {
  const baseCoins =
    winner === 'player' ? 28 : winner === 'draw' ? 18 : 12;
  const difficultyBonus =
    difficultyId === 'hard' ? 10 : difficultyId === 'normal' ? 4 : 0;
  const firstWinBonus =
    winner === 'player' && !saveData.firstWinCharacters.includes(playerCharacterId)
      ? 18
      : 0;

  return {
    coinsEarned: baseCoins + difficultyBonus,
    bonusCoins: firstWinBonus,
  };
}

export class SaveService {
  private data: SaveData = cloneSaveData(DEFAULT_SAVE_DATA);

  constructor(private readonly storage?: Storage) {}

  load(): SaveData {
    try {
      const raw = this.storage?.getItem(SAVE_KEY);

      if (!raw) {
        this.data = cloneSaveData(DEFAULT_SAVE_DATA);
        return this.getSnapshot();
      }

      const parsed = JSON.parse(raw) as Partial<SaveData>;
      this.data = {
        ...cloneSaveData(DEFAULT_SAVE_DATA),
        ...parsed,
        settings: {
          ...cloneSaveData(DEFAULT_SAVE_DATA).settings,
          ...parsed.settings,
        },
        stats: {
          ...cloneSaveData(DEFAULT_SAVE_DATA).stats,
          ...parsed.stats,
        },
        unlockedCharacters: parsed.unlockedCharacters
          ? [...new Set(parsed.unlockedCharacters)]
          : [...DEFAULT_UNLOCKED_CHARACTER_IDS],
        unlockedStadiums: parsed.unlockedStadiums
          ? [...new Set(parsed.unlockedStadiums)]
          : [...DEFAULT_UNLOCKED_STADIUM_IDS],
        firstWinCharacters: parsed.firstWinCharacters
          ? [...new Set(parsed.firstWinCharacters)]
          : [],
      };
    } catch {
      this.data = cloneSaveData(DEFAULT_SAVE_DATA);
    }

    return this.getSnapshot();
  }

  getSnapshot(): SaveData {
    return cloneSaveData(this.data);
  }

  persist(): void {
    this.storage?.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  isCharacterUnlocked(characterId: string): boolean {
    return this.data.unlockedCharacters.includes(characterId);
  }

  isStadiumUnlocked(stadiumId: string): boolean {
    return this.data.unlockedStadiums.includes(stadiumId);
  }

  canAfford(amount: number): boolean {
    return this.data.coins >= amount;
  }

  tryUnlockCharacter(characterId: string, cost: number): boolean {
    if (this.isCharacterUnlocked(characterId) || !this.canAfford(cost)) {
      return false;
    }

    this.data.coins -= cost;
    this.data.unlockedCharacters.push(characterId);
    this.persist();
    return true;
  }

  setSoundEnabled(soundOn: boolean): void {
    this.data.settings.soundOn = soundOn;
    this.persist();
  }

  applyMatchResult(result: MatchResult): SaveApplyResult {
    const snapshotBefore = this.getSnapshot();
    const newlyUnlockedStadiums: string[] = [];

    this.data.coins += result.coinsEarned + result.bonusCoins;
    this.data.stats.matchesPlayed += 1;
    this.data.stats.goalsScored += result.playerScore;
    this.data.stats.goalsAllowed += result.cpuScore;

    if (result.winner === 'player') {
      this.data.stats.wins += 1;

      if (!snapshotBefore.firstWinCharacters.includes(result.selection.playerCharacterId)) {
        this.data.firstWinCharacters.push(result.selection.playerCharacterId);
      }
    } else if (result.winner === 'cpu') {
      this.data.stats.losses += 1;
    } else {
      this.data.stats.draws += 1;
    }

    for (const stadium of STADIUMS) {
      if (
        stadium.unlockGoals > 0 &&
        this.data.stats.goalsScored >= stadium.unlockGoals &&
        !this.data.unlockedStadiums.includes(stadium.id)
      ) {
        this.data.unlockedStadiums.push(stadium.id);
        newlyUnlockedStadiums.push(stadium.id);
      }
    }

    this.persist();

    return {
      snapshot: this.getSnapshot(),
      newlyUnlockedStadiums,
    };
  }
}

const safeStorage =
  typeof window !== 'undefined' ? window.localStorage : undefined;

export const saveService = new SaveService(safeStorage);

