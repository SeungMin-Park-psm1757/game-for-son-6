import Phaser from 'phaser';
import { TEXT_STYLES } from '../constants/ui';
import type { SpecialId } from '../types/CharacterConfig';

function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const seconds = totalSeconds % 60;
  return `0:${seconds.toString().padStart(2, '0')}`;
}

export class HudLayer {
  readonly root: Phaser.GameObjects.Container;

  private readonly playerScoreText: Phaser.GameObjects.Text;
  private readonly cpuScoreText: Phaser.GameObjects.Text;
  private readonly timerText: Phaser.GameObjects.Text;
  private readonly playerMeterFill: Phaser.GameObjects.Rectangle;
  private readonly cpuMeterFill: Phaser.GameObjects.Rectangle;
  private readonly playerMeterLabel: Phaser.GameObjects.Text;
  private readonly cpuMeterLabel: Phaser.GameObjects.Text;
  private readonly banner: Phaser.GameObjects.Container;
  private readonly bannerTitle: Phaser.GameObjects.Text;
  private readonly bannerSubtitle: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const frame = scene.add.graphics();

    frame.fillStyle(0x082030, 0.55);
    frame.fillRoundedRect(26, 18, 320, 92, 26);
    frame.fillRoundedRect(934, 18, 320, 92, 26);
    frame.fillRoundedRect(512, 18, 256, 92, 26);
    frame.lineStyle(4, 0xf8f4da, 0.75);
    frame.strokeRoundedRect(26, 18, 320, 92, 26);
    frame.strokeRoundedRect(934, 18, 320, 92, 26);
    frame.strokeRoundedRect(512, 18, 256, 92, 26);
    frame.setScrollFactor(0);

    this.playerScoreText = scene.add.text(54, 34, '0', TEXT_STYLES.headline);
    this.cpuScoreText = scene.add.text(1_218, 34, '0', TEXT_STYLES.headline);
    this.playerScoreText.setOrigin(0, 0);
    this.cpuScoreText.setOrigin(1, 0);
    this.playerScoreText.setScrollFactor(0);
    this.cpuScoreText.setScrollFactor(0);

    this.timerText = scene.add.text(640, 46, '0:45', TEXT_STYLES.title);
    this.timerText.setOrigin(0.5);
    this.timerText.setScrollFactor(0);

    const playerMeterBack = scene.add.rectangle(210, 92, 180, 18, 0xffffff, 0.15);
    const cpuMeterBack = scene.add.rectangle(1_070, 92, 180, 18, 0xffffff, 0.15);
    this.playerMeterFill = scene.add.rectangle(120, 92, 0, 18, 0xffcb63, 1);
    this.playerMeterFill.setOrigin(0, 0.5);
    this.cpuMeterFill = scene.add.rectangle(980, 92, 0, 18, 0x87e6ff, 1);
    this.cpuMeterFill.setOrigin(0, 0.5);
    playerMeterBack.setScrollFactor(0);
    cpuMeterBack.setScrollFactor(0);
    this.playerMeterFill.setScrollFactor(0);
    this.cpuMeterFill.setScrollFactor(0);

    this.playerMeterLabel = scene.add.text(210, 66, 'SPECIAL', TEXT_STYLES.body);
    this.cpuMeterLabel = scene.add.text(1_070, 66, 'SPECIAL', TEXT_STYLES.body);
    this.playerMeterLabel.setOrigin(0.5);
    this.cpuMeterLabel.setOrigin(0.5);
    this.playerMeterLabel.setScrollFactor(0);
    this.cpuMeterLabel.setScrollFactor(0);

    const bannerPanel = scene.add.graphics();
    bannerPanel.fillStyle(0x082030, 0.82);
    bannerPanel.fillRoundedRect(-220, -60, 440, 120, 26);
    bannerPanel.lineStyle(5, 0xffcb63, 1);
    bannerPanel.strokeRoundedRect(-220, -60, 440, 120, 26);

    this.bannerTitle = scene.add.text(0, -12, '', TEXT_STYLES.title);
    this.bannerSubtitle = scene.add.text(0, 22, '', TEXT_STYLES.body);
    this.bannerTitle.setOrigin(0.5);
    this.bannerSubtitle.setOrigin(0.5);

    this.banner = scene.add.container(640, 182, [
      bannerPanel,
      this.bannerTitle,
      this.bannerSubtitle,
    ]);
    this.banner.setAlpha(0);
    this.banner.setScrollFactor(0);
    this.banner.setDepth(30);

    this.root = scene.add.container(0, 0, [
      frame,
      this.playerScoreText,
      this.cpuScoreText,
      this.timerText,
      playerMeterBack,
      cpuMeterBack,
      this.playerMeterFill,
      this.cpuMeterFill,
      this.playerMeterLabel,
      this.cpuMeterLabel,
      this.banner,
    ]);
    this.root.setDepth(25);
  }

  updateScore(playerScore: number, cpuScore: number): void {
    this.playerScoreText.setText(String(playerScore));
    this.cpuScoreText.setText(String(cpuScore));
  }

  updateClock(remainingMs: number, overtime: boolean, suddenDeath: boolean): void {
    this.timerText.setText(
      suddenDeath ? 'GOLDEN GOAL' : overtime ? `OT ${formatClock(remainingMs)}` : formatClock(remainingMs),
    );
  }

  updateMeters(
    playerMeter: number,
    cpuMeter: number,
    playerSpecial: SpecialId,
    cpuSpecial: SpecialId,
  ): void {
    this.playerMeterFill.width = 180 * Phaser.Math.Clamp(playerMeter / 100, 0, 1);
    this.cpuMeterFill.width = 180 * Phaser.Math.Clamp(cpuMeter / 100, 0, 1);
    this.playerMeterLabel.setText(playerMeter >= 100 ? `${playerSpecial.toUpperCase()} READY` : 'SPECIAL');
    this.cpuMeterLabel.setText(cpuMeter >= 100 ? `${cpuSpecial.toUpperCase()} READY` : 'CPU SPECIAL');
  }

  showBanner(
    scene: Phaser.Scene,
    title: string,
    subtitle: string,
    accentColor = 0xffcb63,
  ): void {
    const graphics = this.banner.list[0] as Phaser.GameObjects.Graphics;

    graphics.clear();
    graphics.fillStyle(0x082030, 0.82);
    graphics.fillRoundedRect(-220, -60, 440, 120, 26);
    graphics.lineStyle(5, accentColor, 1);
    graphics.strokeRoundedRect(-220, -60, 440, 120, 26);

    this.bannerTitle.setText(title);
    this.bannerSubtitle.setText(subtitle);
    this.banner.setAlpha(0);
    this.banner.setScale(0.92);

    scene.tweens.add({
      targets: this.banner,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 180,
      ease: 'Back.Out',
      yoyo: true,
      hold: 780,
    });
  }
}

