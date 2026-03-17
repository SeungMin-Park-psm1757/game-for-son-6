import Phaser from 'phaser';
import { STADIUMS } from '../config/stadiums';
import { TEXT_STYLES } from '../constants/ui';
import { audioService } from '../services/AudioService';
import { displayService } from '../services/DisplayService';
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

    this.add.text(640, 94, '골팝 아레나', TEXT_STYLES.headline).setOrigin(0.5);
    this.add
      .text(
        640,
        148,
        '큰 머리, 짧은 경기, 강한 슛으로 승부하는 1대1 아케이드 축구',
        TEXT_STYLES.body,
      )
      .setOrigin(0.5);

    this.profileText = this.add.text(640, 198, '', TEXT_STYLES.body).setOrigin(0.5);

    const playButton = new TextButton(
      this,
      418,
      292,
      '경기 시작',
      () => {
        void audioService.unlock();
        void displayService.requestImmersiveMode();
        audioService.play('tap');
        this.scene.start('CharacterSelectScene');
      },
      {
        width: 250,
        height: 72,
        fillColor: 0xffcb63,
      },
    );

    const fullscreenButton = new TextButton(
      this,
      640,
      292,
      '전체화면',
      () => {
        void audioService.unlock();
        void displayService.requestImmersiveMode();
        audioService.play('resume');
      },
      {
        width: 220,
        height: 72,
        fillColor: 0x87e6ff,
      },
    );

    const tutorialButton = new TextButton(
      this,
      862,
      292,
      '자세한 조작',
      () => {
        audioService.play('tap');
        this.tutorialOverlay.setVisible(true);
      },
      {
        width: 250,
        height: 72,
        fillColor: 0xff6b57,
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

    this.createInfoCard(
      368,
      522,
      '키보드',
      ['A / D 이동', 'W 점프', 'Space 슛', 'Shift 필살기', 'Esc 일시정지'],
      0xffcb63,
    );
    this.createInfoCard(
      912,
      522,
      '휴대폰',
      ['왼쪽 원 2개로 이동', '파랑 점프', '노랑 슛', '빨강 필살기', '오른쪽 위 II 일시정지'],
      0x87e6ff,
    );

    this.add
      .text(
        640,
        664,
        '모바일 크롬에서는 전체화면 버튼을 누르거나 홈 화면에 추가하면 주소창 없이 더 넓게 플레이할 수 있다.',
        {
          ...TEXT_STYLES.body,
          fontSize: '18px',
          wordWrap: { width: 960 },
          align: 'center',
        },
      )
      .setOrigin(0.5);

    this.tutorialOverlay = this.createTutorialOverlay();
    this.refreshProfile();

    playButton.setDepth(2);
    fullscreenButton.setDepth(2);
    tutorialButton.setDepth(2);
    this.soundButton.setDepth(2);
  }

  private refreshProfile(): void {
    const saveData = saveService.getSnapshot();
    this.profileText.setText(
      `코인 ${saveData.coins}   |   해금 선수 ${saveData.unlockedCharacters.length}/4   |   총 득점 ${saveData.stats.goalsScored}`,
    );
    this.soundButton.setLabel(saveData.settings.soundOn ? '소리 켜짐' : '소리 꺼짐');
  }

  private createInfoCard(
    x: number,
    y: number,
    title: string,
    lines: string[],
    accent: number,
  ): void {
    const panel = this.add.graphics();
    panel.fillStyle(0x082030, 0.8);
    panel.fillRoundedRect(x - 210, y - 112, 420, 224, 28);
    panel.lineStyle(5, accent, 1);
    panel.strokeRoundedRect(x - 210, y - 112, 420, 224, 28);
    panel.fillStyle(0xffffff, 0.06);
    panel.fillRoundedRect(x - 190, y - 84, 380, 42, 18);

    this.add
      .text(x, y - 64, title, {
        ...TEXT_STYLES.title,
        color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      })
      .setOrigin(0.5);
    this.add
      .text(x, y + 18, lines.join('\n'), {
        ...TEXT_STYLES.body,
        fontSize: '18px',
        lineSpacing: 8,
        align: 'center',
      })
      .setOrigin(0.5);
  }

  private createTutorialOverlay(): Phaser.GameObjects.Container {
    const panel = this.add.graphics();
    panel.fillStyle(0x041119, 0.9);
    panel.fillRoundedRect(-300, -210, 600, 420, 30);
    panel.lineStyle(5, 0xffcb63, 1);
    panel.strokeRoundedRect(-300, -210, 600, 420, 30);

    const title = this.add
      .text(0, -158, '조작 한눈에 보기', TEXT_STYLES.title)
      .setOrigin(0.5);
    const body = this.add.text(
      0,
      -14,
      [
        '[키보드]',
        'A / D: 좌우 이동',
        'W: 점프',
        'Space: 슛',
        'Shift: 필살기',
        'Esc: 일시정지',
        '',
        '[휴대폰]',
        '왼쪽 원 2개: 좌우 이동',
        '파랑 버튼: 점프',
        '노랑 버튼: 슛',
        '빨강 버튼: 필살기',
        '오른쪽 위 II: 일시정지',
      ].join('\n'),
      {
        ...TEXT_STYLES.body,
        fontSize: '18px',
        align: 'center',
        lineSpacing: 8,
      },
    );
    body.setOrigin(0.5);

    const overlay = this.add.container(640, 360);
    const closeButton = new TextButton(
      this,
      0,
      148,
      '닫기',
      () => {
        audioService.play('tap');
        overlay.setVisible(false);
      },
      {
        width: 220,
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
