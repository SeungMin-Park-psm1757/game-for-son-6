import type { MatchResult, MatchSelection } from '../types/MatchTypes';

class SessionService {
  private selection: MatchSelection | null = null;
  private result: MatchResult | null = null;

  setSelection(selection: MatchSelection): void {
    this.selection = { ...selection };
  }

  getSelection(): MatchSelection | null {
    return this.selection ? { ...this.selection } : null;
  }

  setResult(result: MatchResult): void {
    this.result = {
      ...result,
      selection: { ...result.selection },
    };
  }

  getResult(): MatchResult | null {
    return this.result
      ? {
          ...this.result,
          selection: { ...this.result.selection },
        }
      : null;
  }
}

export const sessionService = new SessionService();

