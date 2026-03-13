import Phaser from 'phaser';
import { MATCH_CONSTANTS } from '../constants/balance';
import type { SpecialId } from '../types/CharacterConfig';

type BallState = 'normal' | 'fire' | 'curve';

export class Ball extends Phaser.Physics.Arcade.Image {
  lastTouchPlayerId: string | null = null;
  private ballState: BallState = 'normal';
  private stateExpiresAt = 0;
  private curveDirection = 0;
  private activeSpecialId: SpecialId | null = null;
  private lastSpecialStrikeId: SpecialId | null = null;
  private lastSpecialStrikePlayerId: string | null = null;
  private lastSpecialStrikeExpiresAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'soccer-ball');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(18, 6, 6);
    this.setBounce(MATCH_CONSTANTS.ballBounce, MATCH_CONSTANTS.ballBounce);
    this.setCollideWorldBounds(true);
    this.setDrag(8, 2);
    this.setDepth(8);
  }

  registerTouch(playerId: string): void {
    if (
      this.lastSpecialStrikePlayerId &&
      playerId !== this.lastSpecialStrikePlayerId
    ) {
      this.lastSpecialStrikeId = null;
      this.lastSpecialStrikePlayerId = null;
      this.lastSpecialStrikeExpiresAt = 0;
    }

    this.lastTouchPlayerId = playerId;
  }

  applyImpulse(vx: number, vy: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.velocity.x += vx;
    body.velocity.y += vy;
    this.capVelocity();
  }

  setSpecialState(
    state: BallState,
    specialId: SpecialId | null,
    direction: number,
    expiresAt: number,
  ): void {
    this.ballState = state;
    this.activeSpecialId = specialId;
    this.curveDirection = direction;
    this.stateExpiresAt = expiresAt;
    this.refreshTint();
  }

  markSpecialStrike(
    playerId: string,
    specialId: SpecialId,
    expiresAt: number,
  ): void {
    this.lastSpecialStrikePlayerId = playerId;
    this.lastSpecialStrikeId = specialId;
    this.lastSpecialStrikeExpiresAt = expiresAt;
  }

  getActiveSpecialId(): SpecialId | null {
    return this.activeSpecialId;
  }

  getRecentSpecialStrike(
    time: number,
  ): { playerId: string; specialId: SpecialId } | null {
    if (
      !this.lastSpecialStrikeId ||
      !this.lastSpecialStrikePlayerId ||
      time > this.lastSpecialStrikeExpiresAt
    ) {
      return null;
    }

    return {
      playerId: this.lastSpecialStrikePlayerId,
      specialId: this.lastSpecialStrikeId,
    };
  }

  clearSpecialState(): void {
    this.ballState = 'normal';
    this.activeSpecialId = null;
    this.curveDirection = 0;
    this.stateExpiresAt = 0;
    this.clearTint();
    this.setScale(1);
  }

  resetBall(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, MATCH_CONSTANTS.kickoffBallLift);
    this.clearSpecialState();
    this.lastSpecialStrikeId = null;
    this.lastSpecialStrikePlayerId = null;
    this.lastSpecialStrikeExpiresAt = 0;
    this.lastTouchPlayerId = null;
  }

  tick(time: number, delta: number): void {
    if (this.ballState !== 'normal' && time >= this.stateExpiresAt) {
      this.clearSpecialState();
    }

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.ballState === 'curve') {
      body.velocity.x += this.curveDirection * 0.018 * delta;
      body.velocity.y += Math.sin(time / 85) * 0.012 * delta;
    }

    if (this.ballState === 'fire') {
      this.setScale(1.08 + Math.sin(time / 45) * 0.02);
    }

    this.rotation += body.velocity.x * 0.0006;
    this.capVelocity();
  }

  private refreshTint(): void {
    if (this.ballState === 'fire') {
      this.setTint(0xff8f5d);
      return;
    }

    if (this.ballState === 'curve') {
      this.setTint(0xcf9cff);
      return;
    }

    this.clearTint();
  }

  private capVelocity(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const velocity = new Phaser.Math.Vector2(body.velocity.x, body.velocity.y);

    if (velocity.length() > MATCH_CONSTANTS.ballMaxSpeed) {
      velocity.setLength(MATCH_CONSTANTS.ballMaxSpeed);
      body.setVelocity(velocity.x, velocity.y);
    }
  }
}
