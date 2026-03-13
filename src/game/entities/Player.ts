import Phaser from 'phaser';
import { MATCH_CONSTANTS } from '../constants/balance';
import { getCharacterTextureKey } from '../services/TextureFactory';
import type { CharacterConfig, SpecialId } from '../types/CharacterConfig';
import type { PlayerActions } from '../types/MatchTypes';
import { Ball } from './Ball';

export interface KickResult {
  kicked: boolean;
  powerShot: boolean;
  consumedQueuedSpecial: SpecialId | null;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  facing: -1 | 1;
  specialMeter = 34;
  kickCooldownUntil = 0;
  specialCooldownUntil = 0;

  private coyoteUntil = 0;
  private queuedSpecial: SpecialId | null = null;
  private queuedSpecialUntil = 0;
  private dashUntil = 0;
  private dashVelocityX = 0;
  private dashHitConsumed = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public readonly playerId: string,
    public readonly character: CharacterConfig,
    facing: -1 | 1,
  ) {
    super(scene, x, y, getCharacterTextureKey(character.id));

    this.facing = facing;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.94);
    this.setDepth(7);
    this.setCollideWorldBounds(true);
    this.setBounce(0, 0);
    this.setFlipX(this.facing < 0);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(54, 76);
    body.setOffset(33, 48);
    body.setMaxVelocity(520, 940);
  }

  resetForKickoff(x: number, y: number, facing: -1 | 1): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setAcceleration(0);
    this.facing = facing;
    this.setFlipX(facing < 0);
    this.queuedSpecial = null;
    this.queuedSpecialUntil = 0;
    this.dashUntil = 0;
    this.dashVelocityX = 0;
    this.dashHitConsumed = false;
    this.setScale(0.94);
    this.setAngle(0);
  }

  updateFromActions(actions: PlayerActions, time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.down) {
      this.coyoteUntil = time + 110;
    }

    const axis = (actions.right ? 1 : 0) - (actions.left ? 1 : 0);

    if (time < this.dashUntil) {
      body.setVelocityX(this.dashVelocityX);
    } else {
      const moveSpeed = body.blocked.down
        ? MATCH_CONSTANTS.moveSpeed
        : MATCH_CONSTANTS.airMoveSpeed;

      body.setVelocityX(axis * moveSpeed * this.character.stats.speed);
    }

    if (axis !== 0) {
      this.facing = axis > 0 ? 1 : -1;
      this.setFlipX(this.facing < 0);
    }

    if (actions.jump && time <= this.coyoteUntil) {
      body.setVelocityY(MATCH_CONSTANTS.jumpVelocity * this.character.stats.jump);
      this.coyoteUntil = 0;
    }

    const runTilt = Phaser.Math.Clamp(body.velocity.x / 18, -9, 9);
    this.setAngle(runTilt);
    this.setScale(body.blocked.down ? 0.94 : 0.91, body.blocked.down ? 0.94 : 0.98);

    this.gainMeter(
      (MATCH_CONSTANTS.specialPassiveGainPerSecond / 60) *
        this.character.stats.meterGain,
    );
  }

  tryKick(ball: Ball, time: number): KickResult {
    if (time < this.kickCooldownUntil) {
      return {
        kicked: false,
        powerShot: false,
        consumedQueuedSpecial: null,
      };
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const deltaX = ball.x - this.x;
    const deltaY = ball.y - this.y;
    const inFront = Math.sign(deltaX || this.facing) === this.facing;
    const withinRange =
      Math.abs(deltaX) <= MATCH_CONSTANTS.kickRangeX &&
      Math.abs(deltaY) <= MATCH_CONSTANTS.kickRangeY;

    if (!withinRange || !inFront) {
      return {
        kicked: false,
        powerShot: false,
        consumedQueuedSpecial: null,
      };
    }

    this.kickCooldownUntil = time + MATCH_CONSTANTS.kickCooldownMs;

    const runningBoost = Phaser.Math.Clamp(
      Math.abs(body.velocity.x) / 280,
      0,
      0.4,
    );
    const powerShot = runningBoost > 0.18 || !body.blocked.down;
    let impulseX =
      this.facing *
      (420 + 250 * this.character.stats.kick + 140 * runningBoost);
    let impulseY = deltaY > 0 ? -290 : -190;

    const queuedSpecial = this.consumeQueuedSpecial(time);

    if (queuedSpecial === 'fire-shot') {
      impulseX *= 1.36;
      impulseY -= 80;
    } else if (queuedSpecial === 'curve-touch') {
      impulseX *= 1.08;
      impulseY -= 36;
    }

    if (powerShot) {
      impulseX *= 1.16;
      impulseY -= 60;
    }

    ball.applyImpulse(impulseX, impulseY);
    ball.registerTouch(this.playerId);
    this.gainMeter(MATCH_CONSTANTS.specialTouchGain * this.character.stats.meterGain);

    this.setScale(1.02, 0.9);

    return {
      kicked: true,
      powerShot,
      consumedQueuedSpecial: queuedSpecial,
    };
  }

  canSpecial(time: number): boolean {
    return (
      this.specialMeter >= MATCH_CONSTANTS.specialMeterMax &&
      time >= this.specialCooldownUntil
    );
  }

  useSpecial(time: number, cooldownMs: number): void {
    this.specialMeter = 0;
    this.specialCooldownUntil = time + cooldownMs;
  }

  queueSpecial(specialId: SpecialId, expiresAt: number): void {
    this.queuedSpecial = specialId;
    this.queuedSpecialUntil = expiresAt;
  }

  startDash(time: number, durationMs: number, speed: number): void {
    this.dashUntil = time + durationMs;
    this.dashVelocityX = this.facing * speed;
    this.dashHitConsumed = false;
  }

  isDashing(time: number): boolean {
    return time < this.dashUntil;
  }

  hasConsumedDashHit(): boolean {
    return this.dashHitConsumed;
  }

  markDashHitConsumed(): void {
    this.dashHitConsumed = true;
  }

  gainMeter(amount: number): void {
    this.specialMeter = Phaser.Math.Clamp(
      this.specialMeter + amount,
      0,
      MATCH_CONSTANTS.specialMeterMax,
    );
  }

  private consumeQueuedSpecial(time: number): SpecialId | null {
    if (!this.queuedSpecial || time > this.queuedSpecialUntil) {
      this.queuedSpecial = null;
      this.queuedSpecialUntil = 0;
      return null;
    }

    const specialId = this.queuedSpecial;
    this.queuedSpecial = null;
    this.queuedSpecialUntil = 0;
    return specialId;
  }
}

