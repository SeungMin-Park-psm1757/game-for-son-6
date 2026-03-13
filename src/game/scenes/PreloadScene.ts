import Phaser from 'phaser';
import { TEXT_STYLES } from '../constants/ui';
import { ensureTextures } from '../services/TextureFactory';

export class PreloadScene extends Phaser.Scene {
  private fallbackTimer: number | null = null;

  constructor() {
    super('PreloadScene');
  }

  create(): void {
    const title = this.add.text(640, 250, 'GoalPop Arena', TEXT_STYLES.headline);
    const subtitle = this.add.text(640, 320, 'Loading the next absurd kickoff...', TEXT_STYLES.body);
    const barBack = this.add.rectangle(640, 400, 500, 34, 0xffffff, 0.18);
    const barFill = this.add.rectangle(394, 400, 0, 26, 0xffcb63, 1);

    title.setOrigin(0.5);
    subtitle.setOrigin(0.5);
    barFill.setOrigin(0, 0.5);

    ensureTextures(this);

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 650,
      ease: 'Sine.Out',
      onUpdate: (tween) => {
        const progress = tween.getValue() ?? 0;
        barFill.width = 492 * progress;
      },
      onComplete: () => {
        const nextScene = this.registry.get('bootTargetScene') ?? 'TitleScene';
        this.scene.start(nextScene);
      },
    });

    this.fallbackTimer = window.setTimeout(() => {
      if (this.scene.isActive()) {
        const nextScene = this.registry.get('bootTargetScene') ?? 'TitleScene';
        this.scene.start(nextScene);
      }
    }, 850);

    this.events.once('shutdown', () => {
      if (this.fallbackTimer !== null) {
        window.clearTimeout(this.fallbackTimer);
      }
    });
  }
}
