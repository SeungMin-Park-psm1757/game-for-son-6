import Phaser from 'phaser';
import { getCharacterById } from '../config/characters';
import { getStadiumById } from '../config/stadiums';
import { TEXT_STYLES } from '../constants/ui';
import { audioService } from '../services/AudioService';
import { saveService } from '../services/SaveService';
import { sessionService } from '../services/SessionService';
import { TextButton } from '../ui/Buttons';
import { drawStadiumBackdrop } from '../ui/StadiumBackdrop';

export class ResultScene extends Phaser.Scene {
  private soundButton!: TextButton;

  constructor() {
    super('ResultScene');
  }

  create(): void {
    const result = sessionService.getResult();

    if (!result) {
      this.scene.start('TitleScene');
      return;
    }

    const playerCharacter = getCharacterById(result.selection.playerCharacterId);
    const cpuCharacter = getCharacterById(result.selection.cpuCharacterId);
    const stadium = getStadiumById(result.selection.stadiumId);
    const saveData = saveService.getSnapshot();
    const winnerText =
      result.winner === 'player'
        ? '승리'
        : result.winner === 'cpu'
          ? '패배'
          : '무승부';
    const accent =
      result.winner === 'player'
        ? playerCharacter.visuals.primary
        : result.winner === 'cpu'
          ? cpuCharacter.visuals.primary
          : 0x87e6ff;
    const accentHex = Phaser.Display.Color.IntegerToColor(accent).rgba;

    drawStadiumBackdrop(this, stadium, 'result');

    this.input.once('pointerdown', () => {
      void audioService.unlock();
    });

    if (result.winner === 'player') {
      audioService.play('win');
    } else {
      audioService.play('lose');
    }

    this.add
      .text(640, 108, winnerText, {
        ...TEXT_STYLES.headline,
        color: accentHex,
      })
      .setOrigin(0.5);
    this.add
      .text(
        640,
        176,
        `${playerCharacter.name} ${result.playerScore} - ${result.cpuScore} ${cpuCharacter.name}`,
        TEXT_STYLES.title,
      )
      .setOrigin(0.5);
    this.add
      .text(
        640,
        250,
        result.wentOvertime
          ? result.suddenDeath
            ? '골든골 한 방으로 승부가 갈렸다.'
            : '연장전 끝에 승부가 정리됐다.'
          : '정규 시간 안에 결과가 났다.',
        TEXT_STYLES.body,
      )
      .setOrigin(0.5);

    const rewardPanel = this.add.graphics();
    rewardPanel.fillStyle(0x082030, 0.88);
    rewardPanel.fillRoundedRect(374, 302, 532, 180, 28);
    rewardPanel.lineStyle(5, accent, 1);
    rewardPanel.strokeRoundedRect(374, 302, 532, 180, 28);

    this.add
      .text(640, 350, `경기 코인 +${result.coinsEarned}`, TEXT_STYLES.title)
      .setOrigin(0.5);
    this.add
      .text(640, 402, `보너스 코인 +${result.bonusCoins}`, TEXT_STYLES.body)
      .setOrigin(0.5);
    this.add
      .text(640, 446, `현재 코인 ${saveData.coins}`, TEXT_STYLES.body)
      .setOrigin(0.5);

    new TextButton(
      this,
      640,
      554,
      '한 판 더',
      () => {
        audioService.play('tap');
        sessionService.setSelection(result.selection);
        this.scene.start('MatchScene');
      },
      {
        width: 220,
        height: 72,
        fillColor: 0xff6b57,
      },
    );

    new TextButton(
      this,
      640,
      638,
      '선수 다시 고르기',
      () => {
        audioService.play('tap');
        this.scene.start('CharacterSelectScene');
      },
      {
        width: 240,
        height: 62,
        fillColor: 0x87e6ff,
      },
    );

    new TextButton(
      this,
      190,
      656,
      '처음으로',
      () => {
        audioService.play('tap');
        this.scene.start('TitleScene');
      },
      {
        width: 156,
        height: 56,
        fillColor: 0xf8f4da,
      },
    );

    this.soundButton = new TextButton(
      this,
      1_112,
      66,
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
        this.refreshSoundButton();
      },
      {
        width: 196,
        height: 52,
        fillColor: 0xf8f4da,
      },
    );

    this.refreshSoundButton();
  }

  private refreshSoundButton(): void {
    const saveData = saveService.getSnapshot();
    this.soundButton.setLabel(saveData.settings.soundOn ? '소리 켜짐' : '소리 꺼짐');
  }
}
