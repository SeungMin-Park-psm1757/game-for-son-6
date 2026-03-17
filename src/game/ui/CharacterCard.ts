import Phaser from 'phaser';
import { getSpecialById } from '../config/specials';
import type { CharacterConfig } from '../types/CharacterConfig';
import { getCharacterTextureKey } from '../services/TextureFactory';
import { UI_FONT_STACK } from '../constants/ui';

interface CharacterCardState {
  selected: boolean;
  unlocked: boolean;
  canAfford: boolean;
}

export class CharacterCard extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly portrait: Phaser.GameObjects.Image;
  private readonly nameText: Phaser.GameObjects.Text;
  private readonly subtitleText: Phaser.GameObjects.Text;
  private readonly footerText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    public readonly character: CharacterConfig,
    onClick: (characterId: string) => void,
  ) {
    super(scene, x, y);

    this.background = scene.add.graphics();
    this.portrait = scene.add
      .image(0, -52, getCharacterTextureKey(character.id))
      .setScale(0.72);
    this.nameText = scene.add.text(0, 34, character.name, {
      fontFamily: UI_FONT_STACK,
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#f8f4da',
      stroke: '#082030',
      strokeThickness: 6,
    });
    this.subtitleText = scene.add.text(0, 68, character.title, {
      fontFamily: UI_FONT_STACK,
      fontSize: '15px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 220 },
    });
    this.footerText = scene.add.text(0, 118, '', {
      fontFamily: UI_FONT_STACK,
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#082030',
    });

    this.nameText.setOrigin(0.5);
    this.subtitleText.setOrigin(0.5);
    this.footerText.setOrigin(0.5);
    this.add([
      this.background,
      this.portrait,
      this.nameText,
      this.subtitleText,
      this.footerText,
    ]);

    this.setSize(240, 300);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-120, -150, 240, 300),
      Phaser.Geom.Rectangle.Contains,
    );
    this.on('pointerdown', () => onClick(character.id));

    scene.add.existing(this);
  }

  refresh(state: CharacterCardState): void {
    const fill = state.unlocked ? this.character.visuals.primary : 0x59667a;
    const border = state.selected ? 0x87e6ff : 0x082030;

    this.background.clear();
    this.background.fillStyle(0x082030, 1);
    this.background.fillRoundedRect(-112, -142, 224, 284, 26);
    this.background.fillStyle(fill, state.unlocked ? 1 : 0.82);
    this.background.fillRoundedRect(-120, -150, 224, 284, 26);
    this.background.lineStyle(6, border, 1);
    this.background.strokeRoundedRect(-120, -150, 224, 284, 26);

    this.portrait.setAlpha(state.unlocked ? 1 : 0.55);
    this.footerText.setText(
      state.unlocked
        ? state.selected
          ? '선택 완료'
          : getSpecialById(this.character.specialId).shortLabel
        : state.canAfford
          ? `${this.character.unlockCost}코인 해금`
          : `${this.character.unlockCost}코인 필요`,
    );
  }
}
