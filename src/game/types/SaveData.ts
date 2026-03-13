export interface SaveSettings {
  soundOn: boolean;
}

export interface SaveStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsScored: number;
  goalsAllowed: number;
}

export interface SaveData {
  version: number;
  coins: number;
  unlockedCharacters: string[];
  unlockedStadiums: string[];
  firstWinCharacters: string[];
  settings: SaveSettings;
  stats: SaveStats;
}

