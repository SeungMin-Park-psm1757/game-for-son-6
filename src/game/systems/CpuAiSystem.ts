import Phaser from 'phaser';
import type { DifficultyId } from '../constants/balance';
import { DIFFICULTY_PROFILES, FIELD_BOUNDS } from '../constants/balance';
import type { PlayerActions } from '../types/MatchTypes';

export interface CpuContext {
  cpuX: number;
  cpuY: number;
  ballX: number;
  ballY: number;
  ballVelocityX: number;
  ballVelocityY: number;
  playerX: number;
  playerScore: number;
  cpuScore: number;
  remainingMs: number;
  canSpecial: boolean;
}

export class CpuAiSystem {
  private readonly profile;
  private nextThinkAt = 0;
  private cachedActions: PlayerActions = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    special: false,
    pause: false,
  };

  constructor(private readonly difficultyId: DifficultyId) {
    this.profile = DIFFICULTY_PROFILES[this.difficultyId];
  }

  update(time: number, context: CpuContext): PlayerActions {
    if (time < this.nextThinkAt) {
      return this.cachedActions;
    }

    this.nextThinkAt = time + this.profile.reactionMs;
    const homeX = FIELD_BOUNDS.playableRight - 118;
    const goalDanger =
      context.ballVelocityX > 120 && context.ballX > FIELD_BOUNDS.playableRight - 320;
    const losing = context.cpuScore < context.playerScore;
    const lateGame = context.remainingMs < 12_000;

    let targetX = homeX;

    if (goalDanger || (lateGame && !losing)) {
      targetX =
        context.ballX > FIELD_BOUNDS.playableRight - 420
          ? context.ballX - 18
          : homeX;
    } else if (
      context.ballX > FIELD_BOUNDS.playableLeft + 420 ||
      losing ||
      Math.random() < this.profile.aggression
    ) {
      targetX = Phaser.Math.Linear(
        context.ballX,
        homeX,
        this.profile.defendBias,
      );
    }

    targetX += Phaser.Math.Between(
      -this.profile.targetError,
      this.profile.targetError,
    );

    const horizontalDelta = targetX - context.cpuX;
    const moveLeft = horizontalDelta < -24;
    const moveRight = horizontalDelta > 24;
    const ballNear = Math.abs(context.ballX - context.cpuX) < 120;
    const ballAbove = context.ballY < context.cpuY - 30;
    const shouldJump =
      ballNear &&
      ballAbove &&
      Math.random() < this.profile.jumpChance &&
      context.ballVelocityY > -160;
    const shouldKick =
      Math.abs(context.ballX - context.cpuX) < 110 &&
      Math.abs(context.ballY - context.cpuY) < 100 &&
      context.ballX <= context.cpuX + 100;
    const shouldSpecial =
      context.canSpecial &&
      ballNear &&
      (context.ballX > FIELD_BOUNDS.playableRight - 320 ||
        context.ballVelocityX < -120 ||
        Math.random() < this.profile.specialChance);

    this.cachedActions = {
      left: moveLeft && !moveRight,
      right: moveRight && !moveLeft,
      jump: shouldJump,
      kick: shouldKick,
      special: shouldSpecial,
      pause: false,
    };

    return this.cachedActions;
  }
}
