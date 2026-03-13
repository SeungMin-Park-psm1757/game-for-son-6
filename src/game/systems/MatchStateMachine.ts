import type { MatchPhase } from '../types/MatchTypes';

export class MatchStateMachine {
  phase: MatchPhase = 'intro';
  previousPhase: MatchPhase = 'intro';
  phaseStartedAt = 0;

  setPhase(phase: MatchPhase, time: number): void {
    this.previousPhase = this.phase;
    this.phase = phase;
    this.phaseStartedAt = time;
  }

  is(phase: MatchPhase): boolean {
    return this.phase === phase;
  }

  elapsed(time: number): number {
    return time - this.phaseStartedAt;
  }
}

