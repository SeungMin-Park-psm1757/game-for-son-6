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

    this.add.text(640, 128, '골팝 아레나', TEXT_STYLES.headline).setOrigin(0.5);
    this.add
      .text(640, 192, '큰 머리, 작은 몸, 황당하게 시원한 슛!', TEXT_STYLES.body)
      .setOrigin(0.5);
    this.profileText = this.add.text(640, 250, '', TEXT_STYLES.body).setOrigin(0.5);

    const playButton = new TextButton(
      this,
      640,
      360,
      '바로 경기 시작',
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
      '플레이 방법',
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
        '휴대폰에서도 가볍게 즐기는 1대1 아케이드 축구.',
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
      `코인 ${saveData.coins}   |   선수단 ${saveData.unlockedCharacters.length}/4   |   누적 골 ${saveData.stats.goalsScored}`,
    );
    this.soundButton.setLabel(saveData.settings.soundOn ? '소리 켜짐' : '소리 꺼짐');
  }

  private createTutorialOverlay(): Phaser.GameObjects.Container {
    const panel = this.add.graphics();
    panel.fillStyle(0x041119, 0.84);
    panel.fillRoundedRect(-270, -184, 540, 368, 30);
    panel.lineStyle(5, 0xffcb63, 1);
    panel.strokeRoundedRect(-270, -184, 540, 368, 30);

    const title = this.add
      .text(0, -136, '빠른 설명', TEXT_STYLES.title)
      .setOrigin(0.5);
    const body = this.add.text(
      0,
      -22,
      [
        'A / D 또는 좌우 버튼으로 이동',
        'W 또는 점프로 공중볼에 대응',
        'SPACE 또는 슛으로 강하게 차기',
        '게이지가 차면 SHIFT 또는 필살 발동',
        '시간이 끝나기 전 더 많은 골 넣기',
        '비기면 연장전, 그래도 비기면 골든골',
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
      '바로 해볼래',
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
