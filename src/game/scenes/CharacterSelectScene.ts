import Phaser from 'phaser';
import { CHARACTERS, getCharacterById } from '../config/characters';
import { STADIUMS } from '../config/stadiums';
import {
  DIFFICULTY_PROFILES,
  type DifficultyId,
} from '../constants/balance';
import { TEXT_STYLES } from '../constants/ui';
import { audioService } from '../services/AudioService';
import { displayService } from '../services/DisplayService';
import { saveService } from '../services/SaveService';
import { sessionService } from '../services/SessionService';
import { TextButton } from '../ui/Buttons';
import { CharacterCard } from '../ui/CharacterCard';
import { drawStadiumBackdrop } from '../ui/StadiumBackdrop';

export class CharacterSelectScene extends Phaser.Scene {
  private selectedCharacterId = 'blaze';
  private selectedDifficulty: DifficultyId = 'normal';
  private selectedStadiumId = 'sunset-arena';
  private readonly cards: CharacterCard[] = [];
  private readonly difficultyButtons = new Map<DifficultyId, TextButton>();
  private readonly stadiumButtons = new Map<string, TextButton>();
  private coinsText!: Phaser.GameObjects.Text;
  private noteText!: Phaser.GameObjects.Text;
  private soundButton!: TextButton;

  constructor() {
    super('CharacterSelectScene');
  }

  create(): void {
    const saveData = saveService.getSnapshot();

    this.selectedCharacterId = saveData.unlockedCharacters[0] ?? 'blaze';
    this.selectedStadiumId = saveData.unlockedStadiums[0] ?? 'sunset-arena';

    drawStadiumBackdrop(this, STADIUMS[0], 'menu');
    this.input.once('pointerdown', () => {
      void audioService.unlock();
    });

    this.add.text(640, 56, '선수를 골라줘', TEXT_STYLES.headline).setOrigin(0.5);
    this.add
      .text(
        640,
        104,
        '선수와 경기장, 상대 난이도를 고른 뒤 경기 시작을 누르자.',
        TEXT_STYLES.body,
      )
      .setOrigin(0.5);

    this.coinsText = this.add.text(140, 56, '', TEXT_STYLES.body).setOrigin(0.5);
    this.noteText = this.add
      .text(640, 498, '', {
        ...TEXT_STYLES.body,
        fontSize: '18px',
        wordWrap: { width: 860 },
        align: 'center',
      })
      .setOrigin(0.5);

    CHARACTERS.forEach((character, index) => {
      const card = new CharacterCard(
        this,
        186 + index * 302,
        292,
        character,
        (characterId) => this.handleCharacterPick(characterId),
      );

      this.cards.push(card);
    });

    this.add.text(352, 548, '난이도', TEXT_STYLES.title).setOrigin(0.5);
    this.add.text(972, 548, '경기장', TEXT_STYLES.title).setOrigin(0.5);

    (Object.keys(DIFFICULTY_PROFILES) as DifficultyId[]).forEach(
      (difficultyId, index) => {
        const button = new TextButton(
          this,
          190 + index * 170,
          608,
          DIFFICULTY_PROFILES[difficultyId].label,
          () => {
            audioService.play('tap');
            this.selectedDifficulty = difficultyId;
            this.noteText.setText(
              `${DIFFICULTY_PROFILES[difficultyId].label} 난이도로 CPU 반응 속도와 공격성이 조정된다.`,
            );
            this.refresh();
          },
          {
            width: 146,
            height: 60,
            fillColor: 0x87e6ff,
          },
        );

        this.difficultyButtons.set(difficultyId, button);
      },
    );

    STADIUMS.forEach((stadium, index) => {
      const button = new TextButton(
        this,
        892 + index * 214,
        608,
        stadium.name,
        () => this.handleStadiumPick(stadium.id),
        {
          width: 206,
          height: 60,
          fillColor: 0xffcb63,
        },
      );

      this.stadiumButtons.set(stadium.id, button);
    });

    new TextButton(
      this,
      150,
      672,
      '뒤로',
      () => {
        audioService.play('tap');
        this.scene.start('TitleScene');
      },
      {
        width: 156,
        height: 58,
        fillColor: 0xf8f4da,
      },
    );

    new TextButton(
      this,
      640,
      672,
      '경기 시작',
      () => {
        void audioService.unlock();
        void displayService.requestImmersiveMode();
        audioService.play('tap');
        this.startMatch();
      },
      {
        width: 300,
        height: 66,
        fillColor: 0xff6b57,
      },
    );

    this.soundButton = new TextButton(
      this,
      1_116,
      64,
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
        this.refresh();
      },
      {
        width: 196,
        height: 52,
        fillColor: 0xf8f4da,
      },
    );

    this.refresh();
  }

  private handleCharacterPick(characterId: string): void {
    const saveData = saveService.getSnapshot();
    const character = getCharacterById(characterId);

    if (saveData.unlockedCharacters.includes(characterId)) {
      audioService.play('tap');
      this.selectedCharacterId = characterId;
      this.noteText.setText(`${character.name}: ${character.intro}`);
      this.refresh();
      return;
    }

    if (saveService.tryUnlockCharacter(characterId, character.unlockCost)) {
      audioService.play('special');
      this.selectedCharacterId = characterId;
      this.noteText.setText(`${character.name} 해금 완료. ${character.intro}`);
      this.refresh();
      return;
    }

    this.noteText.setText(
      `${character.name} 해금에는 ${character.unlockCost}코인이 필요하다.`,
    );
  }

  private handleStadiumPick(stadiumId: string): void {
    const saveData = saveService.getSnapshot();
    const stadium = STADIUMS.find((entry) => entry.id === stadiumId);

    if (!stadium) {
      return;
    }

    if (saveData.unlockedStadiums.includes(stadiumId)) {
      audioService.play('tap');
      this.selectedStadiumId = stadiumId;
      this.noteText.setText(`${stadium.name}에서 킥오프 준비 완료.`);
      this.refresh();
      return;
    }

    this.noteText.setText(
      `${stadium.name}은 총 ${stadium.unlockGoals}골을 넣으면 열린다.`,
    );
  }

  private startMatch(): void {
    const saveData = saveService.getSnapshot();

    if (
      !saveData.unlockedCharacters.includes(this.selectedCharacterId) ||
      !saveData.unlockedStadiums.includes(this.selectedStadiumId)
    ) {
      return;
    }

    const cpuPool = CHARACTERS.filter(
      (character) => character.id !== this.selectedCharacterId,
    );
    const cpuCharacter = Phaser.Utils.Array.GetRandom(cpuPool);

    sessionService.setSelection({
      playerCharacterId: this.selectedCharacterId,
      cpuCharacterId: cpuCharacter.id,
      difficultyId: this.selectedDifficulty,
      stadiumId: this.selectedStadiumId,
    });

    this.scene.start('MatchScene');
  }

  private refresh(): void {
    const saveData = saveService.getSnapshot();
    const selectedCharacter = getCharacterById(this.selectedCharacterId);

    this.coinsText.setText(`코인 ${saveData.coins}`);
    this.soundButton.setLabel(
      saveData.settings.soundOn ? '소리 켜짐' : '소리 꺼짐',
    );
    if (!this.noteText.text) {
      this.noteText.setText(`${selectedCharacter.name}: ${selectedCharacter.intro}`);
    }

    this.cards.forEach((card) => {
      const unlocked = saveData.unlockedCharacters.includes(card.character.id);

      card.refresh({
        selected: card.character.id === this.selectedCharacterId,
        unlocked,
        canAfford: saveData.coins >= card.character.unlockCost,
      });
    });

    this.difficultyButtons.forEach((button, difficultyId) => {
      button.setEnabled(true);
      button.setSelected(difficultyId === this.selectedDifficulty);
    });

    this.stadiumButtons.forEach((button, stadiumId) => {
      const stadium = STADIUMS.find((entry) => entry.id === stadiumId);
      const unlocked = saveData.unlockedStadiums.includes(stadiumId);

      button.setSelected(stadiumId === this.selectedStadiumId);
      button.setEnabled(unlocked);
      button.setLabel(
        unlocked
          ? stadium?.name ?? stadiumId
          : `${stadium?.name ?? stadiumId} (${stadium?.unlockGoals}골)`,
      );
    });
  }
}
