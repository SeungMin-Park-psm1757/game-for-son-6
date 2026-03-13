import Phaser from 'phaser';
import { getCharacterById } from '../config/characters';
import { getStadiumById } from '../config/stadiums';
import {
  FIELD_BOUNDS,
  GAME_HEIGHT,
  GAME_WIDTH,
  MATCH_CONSTANTS,
} from '../constants/balance';
import { TEXT_STYLES } from '../constants/ui';
import { Ball } from '../entities/Ball';
import { GoalSensor } from '../entities/GoalSensor';
import { Player } from '../entities/Player';
import { audioService } from '../services/AudioService';
import {
  buildRewardBreakdown,
  saveService,
} from '../services/SaveService';
import { sessionService } from '../services/SessionService';
import { CpuAiSystem } from '../systems/CpuAiSystem';
import { InputMappingSystem } from '../systems/InputMappingSystem';
import { MatchStateMachine } from '../systems/MatchStateMachine';
import { SpecialSystem } from '../systems/SpecialSystem';
import type { MatchPhase, MatchResult, MatchSelection, MatchWinner } from '../types/MatchTypes';
import { TextButton } from '../ui/Buttons';
import { HudLayer } from '../ui/HudLayer';
import { drawStadiumBackdrop } from '../ui/StadiumBackdrop';
import { TouchControls } from '../ui/TouchControls';

const PLAYER_SPAWN_Y = FIELD_BOUNDS.floorY - 58;

export class MatchScene extends Phaser.Scene {
  private selection!: MatchSelection;
  private player!: Player;
  private cpu!: Player;
  private ball!: Ball;
  private hud!: HudLayer;
  private inputMapping!: InputMappingSystem;
  private touchControls!: TouchControls;
  private cpuAi!: CpuAiSystem;
  private stateMachine = new MatchStateMachine();
  private specialSystem!: SpecialSystem;
  private playerScore = 0;
  private cpuScore = 0;
  private matchRemainingMs = MATCH_CONSTANTS.matchDurationMs;
  private overtimeRemainingMs = MATCH_CONSTANTS.overtimeDurationMs;
  private wentOvertime = false;
  private suddenDeath = false;
  private goalLocked = true;
  private finishAfterFreeze = false;
  private pauseResumePhase: MatchPhase = 'live';
  private pauseOverlay!: Phaser.GameObjects.Container;
  private audioButton!: TextButton;

  constructor() {
    super('MatchScene');
  }

  create(): void {
    const fallbackSelection: MatchSelection = {
      playerCharacterId: 'blaze',
      cpuCharacterId: 'bolt',
      difficultyId: 'normal',
      stadiumId: 'sunset-arena',
    };

    this.selection = sessionService.getSelection() ?? fallbackSelection;
    const stadium = getStadiumById(this.selection.stadiumId);

    drawStadiumBackdrop(this, stadium, 'match');

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.input.once('pointerdown', () => {
      void audioService.unlock();
    });

    const structures = this.createArenaStructures();

    this.inputMapping = new InputMappingSystem(this);
    this.touchControls = new TouchControls(this, this.inputMapping);

    this.player = new Player(
      this,
      304,
      PLAYER_SPAWN_Y,
      'player',
      getCharacterById(this.selection.playerCharacterId),
      1,
    );
    this.cpu = new Player(
      this,
      976,
      PLAYER_SPAWN_Y,
      'cpu',
      getCharacterById(this.selection.cpuCharacterId),
      -1,
    );
    this.player.setImmovable(true);
    this.cpu.setImmovable(true);

    this.ball = new Ball(this, 640, 332);
    this.specialSystem = new SpecialSystem(this, this.ball);
    this.cpuAi = new CpuAiSystem(this.selection.difficultyId);

    const leftGoalSensor = new GoalSensor(this, 46, 542, 32, 138, 'left');
    const rightGoalSensor = new GoalSensor(this, 1_234, 542, 32, 138, 'right');

    this.physics.add.collider(this.player, structures);
    this.physics.add.collider(this.cpu, structures);
    this.physics.add.collider(this.player, this.cpu);
    this.physics.add.collider(this.ball, structures, () => {
      this.spawnBurst(this.ball.x, this.ball.y, 0xffffff, 4);
    });
    this.physics.add.collider(this.ball, this.player, () => {
      this.ball.registerTouch(this.player.playerId);
      this.player.gainMeter(1.4);
    });
    this.physics.add.collider(this.ball, this.cpu, () => {
      this.ball.registerTouch(this.cpu.playerId);
      this.cpu.gainMeter(1.2);
    });

    this.physics.add.overlap(this.ball, leftGoalSensor, () => this.handleGoal('cpu'));
    this.physics.add.overlap(this.ball, rightGoalSensor, () => this.handleGoal('player'));

    this.hud = new HudLayer(this);
    this.hud.updateScore(this.playerScore, this.cpuScore);
    this.hud.updateClock(this.matchRemainingMs, false, false);

    this.audioButton = new TextButton(
      this,
      122,
      142,
      '',
      () => {
        const snapshot = saveService.getSnapshot();
        const nextValue = !snapshot.settings.soundOn;

        saveService.setSoundEnabled(nextValue);
        audioService.setSoundEnabled(nextValue);
        if (nextValue) {
          void audioService.unlock();
          audioService.play('tap');
        }
        this.refreshAudioButton();
      },
      {
        width: 164,
        height: 50,
        fillColor: 0xf8f4da,
      },
    );

    new TextButton(
      this,
      1_158,
      142,
      'PAUSE',
      () => {
        audioService.play('tap');
        this.togglePause();
      },
      {
        width: 164,
        height: 50,
        fillColor: 0xf8f4da,
      },
    );

    this.pauseOverlay = this.createPauseOverlay();
    this.refreshAudioButton();
    this.prepareKickoffPositions();
    this.stateMachine.setPhase('intro', this.time.now);
    this.hud.showBanner(this, 'KICKOFF CLASH', '45 seconds to make a scene.', 0xffcb63);

    this.events.once('shutdown', () => {
      this.specialSystem.clear();
      this.touchControls.destroy();
    });
  }

  update(time: number, delta: number): void {
    const playerActions = this.inputMapping.getPlayerActions();

    if (playerActions.pause) {
      this.togglePause();
    }

    if (this.stateMachine.is('paused') || this.stateMachine.is('finished')) {
      return;
    }

    if (this.stateMachine.is('intro') && this.stateMachine.elapsed(time) > 520) {
      this.beginKickoff(time);
    }

    if (
      this.stateMachine.is('kickoff') &&
      this.stateMachine.elapsed(time) > MATCH_CONSTANTS.kickoffDelayMs
    ) {
      this.stateMachine.setPhase(this.wentOvertime ? 'overtime' : 'live', time);
      this.goalLocked = false;
      this.ball.setVelocity(
        Phaser.Math.Between(-70, 70),
        MATCH_CONSTANTS.kickoffBallLift,
      );
      audioService.play('whistle');
    }

    if (
      this.stateMachine.is('goalFreeze') &&
      this.stateMachine.elapsed(time) > MATCH_CONSTANTS.goalFreezeMs
    ) {
      this.physics.world.resume();

      if (this.finishAfterFreeze) {
        this.finishMatch();
        return;
      }

      this.prepareKickoffPositions();
      this.beginKickoff(time);
    }

    this.ball.tick(time, delta);
    this.specialSystem.update(this.player, time);
    this.specialSystem.update(this.cpu, time);
    this.touchControls.setSpecialReady(this.player.canSpecial(time));

    if (!this.stateMachine.is('live') && !this.stateMachine.is('overtime')) {
      this.hud.updateMeters(
        this.player.specialMeter,
        this.cpu.specialMeter,
        this.player.character.specialId,
        this.cpu.character.specialId,
      );
      return;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerActions.jump && playerBody.blocked.down) {
      audioService.play('jump');
    }

    this.player.updateFromActions(playerActions, time);

    const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
    const cpuActions = this.cpuAi.update(time, {
      cpuX: this.cpu.x,
      cpuY: this.cpu.y,
      ballX: this.ball.x,
      ballY: this.ball.y,
      ballVelocityX: ballBody.velocity.x,
      ballVelocityY: ballBody.velocity.y,
      playerX: this.player.x,
      playerScore: this.playerScore,
      cpuScore: this.cpuScore,
      remainingMs: this.wentOvertime ? this.overtimeRemainingMs : this.matchRemainingMs,
      canSpecial: this.cpu.canSpecial(time),
    });

    this.cpu.updateFromActions(cpuActions, time);

    if (playerActions.kick) {
      const kick = this.player.tryKick(this.ball, time);

      if (kick.kicked) {
        audioService.play(kick.powerShot ? 'special' : 'kick');
        this.specialSystem.applyKickEffect(this.player, kick.consumedQueuedSpecial, time);
        this.spawnBurst(
          this.ball.x,
          this.ball.y,
          this.player.character.visuals.secondary,
          5,
        );
      }
    }

    if (cpuActions.kick) {
      const kick = this.cpu.tryKick(this.ball, time);

      if (kick.kicked) {
        this.specialSystem.applyKickEffect(this.cpu, kick.consumedQueuedSpecial, time);
      }
    }

    if (playerActions.special && this.specialSystem.activate(this.player, time)) {
      audioService.play('special');
      this.hud.showBanner(
        this,
        this.player.character.name.toUpperCase(),
        this.player.character.specialId.replace('-', ' ').toUpperCase(),
        this.player.character.visuals.primary,
      );
    }

    if (cpuActions.special && this.specialSystem.activate(this.cpu, time)) {
      this.hud.showBanner(
        this,
        this.cpu.character.name.toUpperCase(),
        this.cpu.character.specialId.replace('-', ' ').toUpperCase(),
        this.cpu.character.visuals.primary,
      );
    }

    this.tickClock(delta);
    this.hud.updateScore(this.playerScore, this.cpuScore);
    this.hud.updateClock(
      this.wentOvertime ? this.overtimeRemainingMs : this.matchRemainingMs,
      this.wentOvertime,
      this.suddenDeath,
    );
    this.hud.updateMeters(
      this.player.specialMeter,
      this.cpu.specialMeter,
      this.player.character.specialId,
      this.cpu.character.specialId,
    );
  }

  private createArenaStructures(): Phaser.Physics.Arcade.StaticGroup {
    const structures = this.physics.add.staticGroup();
    const makeBlock = (x: number, y: number, width: number, height: number) => {
      const block = this.add.rectangle(x, y, width, height, 0xffffff, 0);
      structures.add(block);
      return block;
    };

    makeBlock(640, 704, 1_400, 32);
    makeBlock(8, 360, 16, 720);
    makeBlock(1_272, 360, 16, 720);
    makeBlock(64, 458, 104, 10);
    makeBlock(18, 538, 10, 160);
    makeBlock(1_216, 458, 104, 10);
    makeBlock(1_262, 538, 10, 160);
    return structures;
  }

  private beginKickoff(time: number): void {
    this.stateMachine.setPhase('kickoff', time);
    this.goalLocked = true;
    this.hud.showBanner(
      this,
      this.suddenDeath ? 'GOLDEN GOAL' : this.wentOvertime ? 'OVERTIME' : 'READY',
      this.suddenDeath
        ? 'Next goal wins everything.'
        : this.wentOvertime
          ? '15 seconds. No easy touches now.'
          : 'Ball drops in 1 second.',
      this.suddenDeath ? 0xff6b57 : this.wentOvertime ? 0x87e6ff : 0xffcb63,
    );
  }

  private prepareKickoffPositions(): void {
    this.player.resetForKickoff(304, PLAYER_SPAWN_Y, 1);
    this.cpu.resetForKickoff(976, PLAYER_SPAWN_Y, -1);
    this.ball.resetBall(640, 330);
    this.ball.setVelocity(0, 0);
  }

  private handleGoal(scorer: 'player' | 'cpu'): void {
    if (
      this.goalLocked ||
      (!this.stateMachine.is('live') && !this.stateMachine.is('overtime'))
    ) {
      return;
    }

    this.goalLocked = true;
    this.finishAfterFreeze = false;

    if (scorer === 'player') {
      this.playerScore += 1;
    } else {
      this.cpuScore += 1;
    }

    const accent =
      scorer === 'player'
        ? this.player.character.visuals.primary
        : this.cpu.character.visuals.primary;

    this.physics.world.pause();
    this.cameras.main.shake(160, 0.008);
    this.spawnBurst(scorer === 'player' ? 1_204 : 76, 520, accent, 16);
    audioService.play('goal');
    this.hud.updateScore(this.playerScore, this.cpuScore);
    this.hud.showBanner(
      this,
      'GOAL!',
      scorer === 'player'
        ? `${this.player.character.name} makes the net rattle.`
        : `${this.cpu.character.name} sneaks one in.`,
      accent,
    );
    this.stateMachine.setPhase('goalFreeze', this.time.now);

    if (this.suddenDeath) {
      this.finishAfterFreeze = true;
      return;
    }

    const regulationDone = this.matchRemainingMs <= 0;
    const overtimeDone = this.wentOvertime && this.overtimeRemainingMs <= 0;

    if ((regulationDone || overtimeDone) && this.playerScore !== this.cpuScore) {
      this.finishAfterFreeze = true;
    }
  }

  private tickClock(delta: number): void {
    if (!this.wentOvertime) {
      this.matchRemainingMs = Math.max(0, this.matchRemainingMs - delta);

      if (this.matchRemainingMs === 0) {
        if (this.playerScore === this.cpuScore) {
          this.wentOvertime = true;
          this.hud.showBanner(this, 'OVERTIME', '15 more seconds. Settle it.', 0x87e6ff);
          audioService.play('whistle');
        } else {
          this.finishMatch();
        }
      }

      return;
    }

    if (this.suddenDeath) {
      return;
    }

    this.overtimeRemainingMs = Math.max(0, this.overtimeRemainingMs - delta);

    if (this.overtimeRemainingMs === 0) {
      if (this.playerScore === this.cpuScore) {
        this.suddenDeath = true;
        this.hud.showBanner(this, 'GOLDEN GOAL', 'Next finish ends it.', 0xff6b57);
        audioService.play('whistle');
      } else {
        this.finishMatch();
      }
    }
  }

  private finishMatch(): void {
    if (this.stateMachine.is('finished')) {
      return;
    }

    this.physics.world.resume();
    this.stateMachine.setPhase('finished', this.time.now);

    const winner: MatchWinner =
      this.playerScore > this.cpuScore
        ? 'player'
        : this.playerScore < this.cpuScore
          ? 'cpu'
          : 'draw';
    const rewards = buildRewardBreakdown(
      saveService.getSnapshot(),
      winner,
      this.selection.difficultyId,
      this.selection.playerCharacterId,
    );

    const result: MatchResult = {
      selection: { ...this.selection },
      playerScore: this.playerScore,
      cpuScore: this.cpuScore,
      winner,
      coinsEarned: rewards.coinsEarned,
      bonusCoins: rewards.bonusCoins,
      wentOvertime: this.wentOvertime,
      suddenDeath: this.suddenDeath,
    };

    saveService.applyMatchResult(result);
    sessionService.setResult(result);

    this.player.setVelocity(0, 0);
    this.cpu.setVelocity(0, 0);
    this.ball.setVelocity(0, 0);
    this.hud.showBanner(
      this,
      winner === 'player' ? 'YOU WIN' : winner === 'cpu' ? 'CPU WINS' : 'DRAW',
      `Coins +${result.coinsEarned + result.bonusCoins}`,
      winner === 'player' ? 0x7df3c1 : winner === 'cpu' ? 0xff6b57 : 0x87e6ff,
    );

    this.time.delayedCall(1_200, () => {
      this.scene.start('ResultScene');
    });
  }

  private togglePause(): void {
    if (this.stateMachine.is('finished')) {
      return;
    }

    if (this.stateMachine.is('paused')) {
      this.pauseOverlay.setVisible(false);
      this.physics.world.resume();
      this.stateMachine.setPhase(this.pauseResumePhase, this.time.now);
      return;
    }

    if (this.stateMachine.is('goalFreeze') || this.stateMachine.is('intro')) {
      return;
    }

    this.pauseResumePhase = this.stateMachine.phase;
    this.stateMachine.setPhase('paused', this.time.now);
    this.physics.world.pause();
    this.pauseOverlay.setVisible(true);
  }

  private refreshAudioButton(): void {
    const saveData = saveService.getSnapshot();
    this.audioButton.setLabel(saveData.settings.soundOn ? 'SOUND ON' : 'SOUND OFF');
  }

  private createPauseOverlay(): Phaser.GameObjects.Container {
    const panel = this.add.graphics();
    panel.fillStyle(0x041119, 0.78);
    panel.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    panel.fillStyle(0x082030, 0.92);
    panel.fillRoundedRect(430, 186, 420, 340, 32);
    panel.lineStyle(5, 0xffcb63, 1);
    panel.strokeRoundedRect(430, 186, 420, 340, 32);

    const title = this.add.text(640, 250, 'Paused', TEXT_STYLES.headline).setOrigin(0.5);
    const subtitle = this.add
      .text(640, 314, 'Take a breath, then get back to the chaos.', TEXT_STYLES.body)
      .setOrigin(0.5);

    const resumeButton = new TextButton(
      this,
      640,
      404,
      'RESUME',
      () => {
        audioService.play('tap');
        this.togglePause();
      },
      {
        width: 220,
        height: 66,
        fillColor: 0x87e6ff,
      },
    );

    const menuButton = new TextButton(
      this,
      640,
      482,
      'BACK TO TITLE',
      () => {
        audioService.play('tap');
        this.physics.world.resume();
        this.scene.start('TitleScene');
      },
      {
        width: 260,
        height: 66,
        fillColor: 0xffcb63,
      },
    );

    const overlay = this.add.container(0, 0, [
      panel,
      title,
      subtitle,
      resumeButton,
      menuButton,
    ]);
    overlay.setDepth(60);
    overlay.setVisible(false);
    return overlay;
  }

  private spawnBurst(
    x: number,
    y: number,
    tint: number,
    count: number,
  ): void {
    for (let index = 0; index < count; index += 1) {
      const spark = this.add.image(x, y, 'spark');
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(20, 88);

      spark.setTint(tint);
      spark.setDepth(22);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: Phaser.Math.FloatBetween(0.4, 1.8),
        duration: Phaser.Math.Between(260, 460),
        ease: 'Quad.Out',
        onComplete: () => spark.destroy(),
      });
    }
  }
}
