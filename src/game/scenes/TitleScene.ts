import Phaser from 'phaser';
import { STADIUMS } from '../config/stadiums';
import { TEXT_STYLES } from '../constants/ui';
import { audioService } from '../services/AudioService';
import { saveService } from '../services/SaveService';
import { TextButton } from '../ui/Buttons';
import { drawStadiumBackdrop } from '../ui/StadiumBackdrop';

export class TitleScene extends Phaser.Scene {
  private soundButton!: TextButton;
  private profileText!: Phaser.GameObjects.Text;
  private tutorialOverlay!: Phaser.GameObjects.Container;

  constructor() {
    super('TitleScene');
  }

  create(): void {
    drawStadiumBackdrop(this, STADIUMS[0], 'menu');

    this.input.once('pointerdown', () => {
      void audioService.unlock();
    });

    this.add.text(640, 128, 'GoalPop Arena', TEXT_STYLES.headline).setOrigin(0.5);
    this.add
      .text(640, 192, 'Big heads. Tiny bodies. Ridiculous shots.', TEXT_STYLES.body)
      .setOrigin(0.5);
    this.profileText = this.add.text(640, 250, '', TEXT_STYLES.body).setOrigin(0.5);

    const playButton = new TextButton(
      this,
      640,
      360,
      'PLAY QUICK MATCH',
      () => {
        void audioService.unlock();
        audioService.play('tap');
        this.scene.start('CharacterSelectScene');
      },
      {
        width: 330,
        height: 78,
        fillColor: 0xffcb63,
      },
    );

    const tutorialButton = new TextButton(
      this,
      640,
      452,
      'HOW TO PLAY',
      () => {
        audioService.play('tap');
        this.tutorialOverlay.setVisible(true);
      },
      {
        width: 280,
        height: 68,
        fillColor: 0x87e6ff,
      },
    );

    this.soundButton = new TextButton(
      this,
      1_112,
      72,
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
        this.refreshProfile();
      },
      {
        width: 196,
        height: 56,
        fillColor: 0xf8f4da,
      },
    );

    this.add
      .text(
        640,
        626,
        'Original mobile-first arcade soccer for one-player quick matches.',
        {
          ...TEXT_STYLES.body,
          fontSize: '18px',
        },
      )
      .setOrigin(0.5);

    this.tutorialOverlay = this.createTutorialOverlay();
    this.refreshProfile();

    playButton.setDepth(2);
    tutorialButton.setDepth(2);
    this.soundButton.setDepth(2);
  }

  private refreshProfile(): void {
    const saveData = saveService.getSnapshot();
    this.profileText.setText(
      `Coins ${saveData.coins}   |   Roster ${saveData.unlockedCharacters.length}/4   |   Goals ${saveData.stats.goalsScored}`,
    );
    this.soundButton.setLabel(saveData.settings.soundOn ? 'SOUND ON' : 'SOUND OFF');
  }

  private createTutorialOverlay(): Phaser.GameObjects.Container {
    const panel = this.add.graphics();
    panel.fillStyle(0x041119, 0.84);
    panel.fillRoundedRect(-270, -184, 540, 368, 30);
    panel.lineStyle(5, 0xffcb63, 1);
    panel.strokeRoundedRect(-270, -184, 540, 368, 30);

    const title = this.add
      .text(0, -136, 'Quick Tutorial', TEXT_STYLES.title)
      .setOrigin(0.5);
    const body = this.add.text(
      0,
      -22,
      [
        'A / D  or touch left / right to move',
        'W or JUMP to hop for aerials',
        'SPACE or KICK to blast the ball',
        'SHIFT or SPEC when the meter is full',
        'Score more before time runs out',
        'Tie games spill into overtime, then golden goal',
      ].join('\n'),
      {
        ...TEXT_STYLES.body,
        align: 'center',
        lineSpacing: 10,
      },
    );
    body.setOrigin(0.5);

    const overlay = this.add.container(640, 360);
    const closeButton = new TextButton(
      this,
      0,
      118,
      'LET ME AT IT',
      () => {
        audioService.play('tap');
        overlay.setVisible(false);
      },
      {
        width: 240,
        height: 62,
        fillColor: 0xffcb63,
      },
    );

    overlay.add([panel, title, body, closeButton]);
    overlay.setDepth(40);
    overlay.setVisible(false);

    return overlay;
  }
}
