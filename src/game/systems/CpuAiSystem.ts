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
    const projectedBallX = Phaser.Math.Clamp(
      context.ballX + context.ballVelocityX * 0.16,
      FIELD_BOUNDS.playableLeft,
      FIELD_BOUNDS.playableRight,
    );
    const projectedBallY = Phaser.Math.Clamp(
      context.ballY + context.ballVelocityY * 0.12,
      FIELD_BOUNDS.ceilingY,
      FIELD_BOUNDS.floorY,
    );
    const losing = context.cpuScore < context.playerScore;
    const lateGame = context.remainingMs < 12_000;
    const defendUrgent =
      projectedBallX > FIELD_BOUNDS.playableRight - 280 ||
      (context.ballVelocityX > 180 && context.ballX > FIELD_BOUNDS.playableRight - 360);
    const attackWindow =
      projectedBallX > FIELD_BOUNDS.playableLeft + 380 &&
      projectedBallX < FIELD_BOUNDS.playableRight - 120;

    let targetX = homeX;

    if (defendUrgent) {
      targetX = Math.min(homeX + 32, projectedBallX - 18);
    } else if (losing || lateGame || Math.random() < this.profile.aggression) {
      targetX = Phaser.Math.Linear(
        projectedBallX,
        homeX,
        this.profile.defendBias,
      );
    } else if (attackWindow) {
      targetX = Phaser.Math.Linear(projectedBallX, homeX, 0.52);
    }

    targetX += Phaser.Math.Between(
      -this.profile.targetError,
      this.profile.targetError,
    );
    targetX = Phaser.Math.Clamp(
      targetX,
      FIELD_BOUNDS.playableLeft + 360,
      FIELD_BOUNDS.playableRight - 72,
    );

    const horizontalDelta = targetX - context.cpuX;
    const moveLeft = horizontalDelta < -22;
    const moveRight = horizontalDelta > 22;
    const ballNear = Math.abs(context.ballX - context.cpuX) < 126;
    const projectedNear = Math.abs(projectedBallX - context.cpuX) < 110;
    const ballAbove = context.ballY < context.cpuY - 28;
    const shouldJump =
      (projectedNear &&
        projectedBallY < context.cpuY - 12 &&
        projectedBallY > context.cpuY - 188 &&
        Math.random() < this.profile.jumpChance) ||
      (ballNear &&
        ballAbove &&
        Math.random() < this.profile.jumpChance &&
        context.ballVelocityY > -220);
    const shouldKick =
      Math.abs(projectedBallX - context.cpuX) < 114 &&
      Math.abs(projectedBallY - context.cpuY) < 104 &&
      projectedBallX <= context.cpuX + 96;
    const shouldSpecial =
      context.canSpecial &&
      ((defendUrgent && projectedNear) ||
        (losing && ballNear) ||
        (context.ballVelocityX < -140 && ballNear) ||
        Math.random() < this.profile.specialChance * 0.4);

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
