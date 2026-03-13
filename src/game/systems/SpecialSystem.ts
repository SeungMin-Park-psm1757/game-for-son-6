import Phaser from 'phaser';
import { getSpecialById } from '../config/specials';
import { MATCH_CONSTANTS } from '../constants/balance';
import { Ball } from '../entities/Ball';
import { Player } from '../entities/Player';

interface WallRecord {
  expiresAt: number;
  wall: Phaser.GameObjects.Rectangle;
  collider: Phaser.Physics.Arcade.Collider;
}

export class SpecialSystem {
  private readonly walls = new Map<string, WallRecord>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly ball: Ball,
  ) {}

  activate(player: Player, time: number): boolean {
    if (!player.canSpecial(time)) {
      return false;
    }

    const special = getSpecialById(player.character.specialId);
    player.useSpecial(time, special.cooldownMs);

    switch (special.id) {
      case 'fire-shot':
        player.queueSpecial('fire-shot', time + special.durationMs);
        this.boostIfClose(player, 1.38, -110, 'fire-shot', time + special.durationMs);
        break;
      case 'dash-kick':
        player.startDash(time, MATCH_CONSTANTS.dashDurationMs, 720);
        break;
      case 'wall-block':
        this.spawnWall(player, time + special.durationMs);
        break;
      case 'curve-touch':
        player.queueSpecial('curve-touch', time + special.durationMs);
        this.boostIfClose(player, 1.08, -55, 'curve-touch', time + special.durationMs);
        break;
    }

    return true;
  }

  applyKickEffect(player: Player, consumedQueuedSpecial: string | null, time: number): void {
    if (consumedQueuedSpecial === 'fire-shot') {
      this.ball.setSpecialState('fire', 'fire-shot', player.facing, time + 1_300);
      this.ball.markSpecialStrike(player.playerId, 'fire-shot', time + 1_600);
      return;
    }

    if (consumedQueuedSpecial === 'curve-touch') {
      this.ball.setSpecialState(
        'curve',
        'curve-touch',
        player.facing,
        time + 1_900,
      );
      this.ball.markSpecialStrike(player.playerId, 'curve-touch', time + 2_100);
    }
  }

  update(player: Player, time: number): void {
    if (
      player.isDashing(time) &&
      !player.hasConsumedDashHit() &&
      Phaser.Math.Distance.Between(player.x, player.y, this.ball.x, this.ball.y) < 110
    ) {
      this.ball.applyImpulse(player.facing * 640, -180);
      this.ball.registerTouch(player.playerId);
      this.ball.markSpecialStrike(player.playerId, 'dash-kick', time + 1_200);
      player.markDashHitConsumed();
    }

    for (const [playerId, wall] of this.walls) {
      if (time < wall.expiresAt) {
        continue;
      }

      wall.collider.destroy();
      wall.wall.destroy();
      this.walls.delete(playerId);
    }
  }

  clear(): void {
    for (const wall of this.walls.values()) {
      wall.collider.destroy();
      wall.wall.destroy();
    }

    this.walls.clear();
  }

  private boostIfClose(
    player: Player,
    xMultiplier: number,
    extraY: number,
    state: 'fire-shot' | 'curve-touch',
    expiresAt: number,
  ): void {
    const closeEnough =
      Math.abs(this.ball.x - player.x) < 170 && Math.abs(this.ball.y - player.y) < 120;

    if (!closeEnough) {
      return;
    }

    this.ball.applyImpulse(player.facing * 440 * xMultiplier, extraY);
    this.ball.registerTouch(player.playerId);

    if (state === 'fire-shot') {
      this.ball.setSpecialState('fire', state, player.facing, expiresAt);
      this.ball.markSpecialStrike(player.playerId, state, expiresAt + 240);
      return;
    }

    this.ball.setSpecialState('curve', state, player.facing, expiresAt);
    this.ball.markSpecialStrike(player.playerId, state, expiresAt + 260);
  }

  private spawnWall(player: Player, expiresAt: number): void {
    const existing = this.walls.get(player.playerId);

    if (existing) {
      existing.collider.destroy();
      existing.wall.destroy();
    }

    const x = player.playerId === 'player' ? 182 : 1_098;
    const y = 510;
    const wall = this.scene.add.rectangle(
      x,
      y,
      24,
      152,
      player.character.visuals.secondary,
      0.92,
    );

    wall.setStrokeStyle(4, 0xffffff, 0.9);
    wall.setDepth(5);
    this.scene.physics.add.existing(wall, true);

    const collider = this.scene.physics.add.collider(this.ball, wall, () => {
      const body = this.ball.body as Phaser.Physics.Arcade.Body;
      body.velocity.x *= -0.95;
      body.velocity.y -= 55;
    });

    this.walls.set(player.playerId, {
      expiresAt,
      wall,
      collider,
    });
  }
}
