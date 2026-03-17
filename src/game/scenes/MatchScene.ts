import Phaser from 'phaser';
import { getCharacterById } from '../config/characters';
import { getSpecialById } from '../config/specials';
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
import type {
  MatchPhase,
  MatchResult,
  MatchSelection,
  MatchWinner,
} from '../types/MatchTypes';
import type { SpecialId } from '../types/CharacterConfig';
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
  private lastImpactSoundAt = 0;
  private lastBallTrailAt = 0;

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
      this.spawnBurst(this.ball.x, this.ball.y, 0xffffff, 6);
      if (this.time.now - this.lastImpactSoundAt > 80) {
        this.lastImpactSoundAt = this.time.now;
        audioService.play('impact');
      }
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
      '일시정지',
      () => this.togglePause(),
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
    this.hud.showBanner(this, '킥오프 준비', '45초 안에 더 많은 골을 넣자.', 0xffcb63);

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
    this.spawnBallTrail(time);
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
        audioService.play(kick.powerShot ? 'power-kick' : 'kick');
        this.specialSystem.applyKickEffect(this.player, kick.consumedQueuedSpecial, time);
        this.spawnBurst(
          this.ball.x,
          this.ball.y,
          this.player.character.visuals.secondary,
          kick.powerShot ? 9 : 5,
        );
      }
    }

    if (cpuActions.kick) {
      const kick = this.cpu.tryKick(this.ball, time);

      if (kick.kicked) {
        audioService.play(kick.powerShot ? 'power-kick' : 'kick');
        this.specialSystem.applyKickEffect(this.cpu, kick.consumedQueuedSpecial, time);
      }
    }

    if (playerActions.special && this.specialSystem.activate(this.player, time)) {
      const special = getSpecialById(this.player.character.specialId);

      this.playSpecialActivationSound(this.player.character.specialId);
      this.hud.showBanner(
        this,
        this.player.character.name,
        `${special.name} 발동!`,
        special.color,
      );
    }

    if (cpuActions.special && this.specialSystem.activate(this.cpu, time)) {
      const special = getSpecialById(this.cpu.character.specialId);

      this.playSpecialActivationSound(this.cpu.character.specialId);
      this.hud.showBanner(
        this,
        this.cpu.character.name,
        `${special.name} 발동!`,
        special.color,
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
      this.suddenDeath ? '골든골' : this.wentOvertime ? '연장전' : '준비',
      this.suddenDeath
        ? '다음 골이 바로 결승골이다.'
        : this.wentOvertime
          ? '15초 연장전. 한 번 더 몰아붙이자.'
          : '1초 뒤에 공이 떨어진다.',
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
    const scorerPlayer = scorer === 'player' ? this.player : this.cpu;
    const specialStrike = this.ball.getRecentSpecialStrike(this.time.now);
    const specialGoalId =
      specialStrike?.playerId === scorerPlayer.playerId
        ? specialStrike.specialId
        : null;
    const goalX = scorer === 'player' ? 1_204 : 76;

    this.physics.world.pause();
    this.cameras.main.shake(180, 0.009);
    this.playGoalExplosion(goalX, accent);
    this.playGoalCelebration(scorerPlayer, accent);
    audioService.play('goal');
    audioService.play('celebrate');
    this.hud.updateScore(this.playerScore, this.cpuScore);

    if (specialGoalId) {
      const special = getSpecialById(specialGoalId);

      this.playSpecialGoalEffect(scorer, specialGoalId, special.color);
      this.hud.showBanner(
        this,
        '스페셜 골',
        `${scorerPlayer.character.name}의 ${special.name}!`,
        special.color,
      );
    } else {
      this.hud.showBanner(
        this,
        '골',
        scorer === 'player'
          ? `${this.player.character.name}의 슛이 골문을 흔들었다.`
          : `${this.cpu.character.name}가 역습으로 마무리했다.`,
        accent,
      );
    }

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
          this.hud.showBanner(this, '연장전', '15초 추가 시간으로 승부를 가른다.', 0x87e6ff);
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
        this.hud.showBanner(this, '골든골', '다음 골이 경기의 끝이다.', 0xff6b57);
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
      winner === 'player' ? '승리!' : winner === 'cpu' ? '패배' : '무승부',
      `코인 +${result.coinsEarned + result.bonusCoins}`,
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
      audioService.play('resume');
      return;
    }

    if (this.stateMachine.is('goalFreeze') || this.stateMachine.is('intro')) {
      return;
    }

    this.pauseResumePhase = this.stateMachine.phase;
    this.stateMachine.setPhase('paused', this.time.now);
    this.physics.world.pause();
    this.pauseOverlay.setVisible(true);
    audioService.play('pause');
  }

  private refreshAudioButton(): void {
    const saveData = saveService.getSnapshot();
    this.audioButton.setLabel(saveData.settings.soundOn ? '소리 켜짐' : '소리 꺼짐');
  }

  private createPauseOverlay(): Phaser.GameObjects.Container {
    const panel = this.add.graphics();
    panel.fillStyle(0x041119, 0.78);
    panel.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    panel.fillStyle(0x082030, 0.92);
    panel.fillRoundedRect(430, 186, 420, 340, 32);
    panel.lineStyle(5, 0xffcb63, 1);
    panel.strokeRoundedRect(430, 186, 420, 340, 32);

    const title = this.add.text(640, 250, '일시정지', TEXT_STYLES.headline).setOrigin(0.5);
    const subtitle = this.add
      .text(640, 314, '호흡을 고르고 다시 들어가자.', TEXT_STYLES.body)
      .setOrigin(0.5);

    const resumeButton = new TextButton(
      this,
      640,
      404,
      '계속하기',
      () => this.togglePause(),
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
      '처음 화면',
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

  private playSpecialGoalEffect(
    scorer: 'player' | 'cpu',
    specialId: SpecialId,
    accent: number,
  ): void {
    const special = getSpecialById(specialId);
    const scorerName =
      scorer === 'player' ? this.player.character.name : this.cpu.character.name;
    const goalX = scorer === 'player' ? 1_204 : 76;
    const flashColor = Phaser.Display.Color.IntegerToColor(accent);
    const overlay = this.add.container(0, 0);
    const panel = this.add.graphics();
    const veil = this.add.rectangle(640, 360, GAME_WIDTH, GAME_HEIGHT, accent, 0.12);
    const title = this.add.text(640, 272, '스페셜 골', {
      ...TEXT_STYLES.headline,
      fontSize: '48px',
    });
    const subtitle = this.add.text(640, 336, `${scorerName}의 ${special.name}`, {
      ...TEXT_STYLES.title,
      fontSize: '28px',
    });
    const detail = this.add.text(640, 384, '강한 연출과 함께 골문이 터져 나간다.', {
      ...TEXT_STYLES.body,
      fontSize: '18px',
    });

    this.drawShowPanel(panel, 308, 214, 664, 194, accent);
    title.setOrigin(0.5);
    subtitle.setOrigin(0.5);
    detail.setOrigin(0.5);
    overlay.add([veil, panel, title, subtitle, detail]);
    overlay.setDepth(58);

    this.cameras.main.flash(
      180,
      flashColor.red,
      flashColor.green,
      flashColor.blue,
      true,
    );

    const textureKeys = ['pixel-star', 'pixel-chip', 'pixel-bolt', 'spark'] as const;
    for (let index = 0; index < 32; index += 1) {
      const texture = textureKeys[index % textureKeys.length];
      const burst = this.add.image(goalX, 514, texture);
      const tint = [accent, 0xffcb63, 0xffffff][index % 3];
      const angle = Phaser.Math.FloatBetween(-1.4, 1.4);
      const distance = Phaser.Math.Between(140, 380);
      const yLift = Phaser.Math.Between(-240, -30);

      burst.setTint(tint);
      burst.setDepth(59);
      burst.setBlendMode(Phaser.BlendModes.ADD);
      burst.setScale(Phaser.Math.FloatBetween(1.2, 3.3));
      overlay.add(burst);

      this.tweens.add({
        targets: burst,
        x: goalX + Math.cos(angle) * distance,
        y: 514 + yLift + Math.sin(angle) * 30,
        alpha: 0,
        angle: Phaser.Math.Between(-90, 90),
        scale: burst.scale * 0.45,
        duration: Phaser.Math.Between(520, 780),
        ease: 'Cubic.Out',
        onComplete: () => burst.destroy(),
      });
    }

    this.tweens.add({
      targets: [title, subtitle, detail],
      y: '-=8',
      duration: 210,
      ease: 'Sine.Out',
      yoyo: true,
    });

    this.tweens.add({
      targets: overlay,
      alpha: 0,
      delay: 920,
      duration: 220,
      ease: 'Quad.In',
      onComplete: () => overlay.destroy(),
    });
  }

  private drawShowPanel(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    accent: number,
  ): void {
    graphics.fillStyle(0x082030, 0.94);
    graphics.fillRoundedRect(x, y, width, height, 28);
    graphics.fillStyle(0xffffff, 0.06);
    graphics.fillRoundedRect(x + 18, y + 18, width - 36, 46, 18);
    graphics.fillStyle(accent, 0.18);
    graphics.fillRoundedRect(x + 22, y + 92, width - 44, 64, 24);
    graphics.lineStyle(6, accent, 1);
    graphics.strokeRoundedRect(x, y, width, height, 28);
    graphics.fillStyle(0xffcb63, 0.95);
    graphics.fillRoundedRect(x + 24, y + height - 28, width - 48, 12, 8);
  }

  private spawnBallTrail(time: number): void {
    const activeSpecialId = this.ball.getActiveSpecialId();

    if (!activeSpecialId || time - this.lastBallTrailAt < 42) {
      return;
    }

    this.lastBallTrailAt = time;
    const special = getSpecialById(activeSpecialId);
    const texture = activeSpecialId === 'curve-touch' ? 'pixel-bolt' : 'pixel-star';
    const trail = this.add.image(this.ball.x, this.ball.y, texture);

    trail.setTint(special.color);
    trail.setDepth(7);
    trail.setScale(activeSpecialId === 'curve-touch' ? 0.88 : 1.05);
    trail.setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: trail,
      alpha: 0,
      scale: trail.scale * 0.4,
      duration: 220,
      ease: 'Quad.Out',
      onComplete: () => trail.destroy(),
    });
  }

  private playGoalExplosion(goalX: number, accent: number): void {
    this.spawnBurst(goalX, 520, accent, 20);
    this.spawnBurst(goalX, 484, 0xffffff, 14);
    this.spawnImpactRing(goalX, 520, accent, 1.7);
    this.spawnImpactRing(goalX, 520, 0xffffff, 1.25);
  }

  private playGoalCelebration(player: Player, accent: number): void {
    const celebration = Phaser.Utils.Array.GetRandom(player.character.celebrations);
    const label = this.add
      .text(player.x, player.y - 118, celebration.label, {
        ...TEXT_STYLES.body,
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setDepth(59);
    const startX = player.x;
    const startY = player.y;

    switch (celebration.style) {
      case 'pump':
        this.tweens.add({
          targets: player,
          scaleX: 1.06,
          scaleY: 0.88,
          yoyo: true,
          repeat: 2,
          duration: 120,
        });
        break;
      case 'spin':
        this.tweens.add({
          targets: player,
          angle: player.angle + 360,
          duration: 620,
          ease: 'Cubic.Out',
        });
        break;
      case 'slide':
        this.tweens.add({
          targets: player,
          x: startX + player.facing * 52,
          angle: player.facing * 10,
          duration: 220,
          yoyo: true,
          ease: 'Sine.Out',
        });
        break;
      case 'bounce':
        this.tweens.add({
          targets: player,
          y: startY - 76,
          scaleX: 1.02,
          scaleY: 0.9,
          duration: 240,
          yoyo: true,
          ease: 'Quad.Out',
        });
        break;
      case 'pose':
        this.tweens.add({
          targets: player,
          scaleX: 1.08,
          scaleY: 0.86,
          angle: player.facing * -8,
          duration: 260,
          yoyo: true,
          ease: 'Back.Out',
        });
        break;
    }

    this.spawnBurst(player.x, player.y - 24, accent, 10);

    this.tweens.add({
      targets: label,
      y: label.y - 36,
      alpha: 0,
      duration: 920,
      ease: 'Quad.Out',
      onComplete: () => label.destroy(),
    });

    this.time.delayedCall(960, () => {
      player.setPosition(startX, startY);
      player.setAngle(0);
      player.setScale(0.94);
    });
  }

  private playSpecialActivationSound(specialId: SpecialId): void {
    if (specialId === 'dash-kick') {
      audioService.play('dash');
      return;
    }

    if (specialId === 'wall-block') {
      audioService.play('wall');
      return;
    }

    audioService.play('special');
  }

  private spawnImpactRing(x: number, y: number, tint: number, scale: number): void {
    const ring = this.add.circle(x, y, 26, tint, 0);

    ring.setDepth(21);
    ring.setStrokeStyle(6, tint, 0.8);
    this.tweens.add({
      targets: ring,
      scaleX: scale,
      scaleY: scale,
      alpha: 0,
      duration: 280,
      ease: 'Quad.Out',
      onComplete: () => ring.destroy(),
    });
  }

  private spawnBurst(
    x: number,
    y: number,
    tint: number,
    count: number,
  ): void {
    const textureKeys = ['spark', 'pixel-star', 'pixel-chip', 'pixel-bolt'] as const;

    for (let index = 0; index < count; index += 1) {
      const spark = this.add.image(x, y, textureKeys[index % textureKeys.length]);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const distance = Phaser.Math.Between(26, 102);

      spark.setTint(tint);
      spark.setBlendMode(Phaser.BlendModes.ADD);
      spark.setDepth(22);

      this.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        angle: Phaser.Math.Between(-60, 60),
        scale: Phaser.Math.FloatBetween(0.4, 1.8),
        duration: Phaser.Math.Between(260, 460),
        ease: 'Quad.Out',
        onComplete: () => spark.destroy(),
      });
    }
  }
}
