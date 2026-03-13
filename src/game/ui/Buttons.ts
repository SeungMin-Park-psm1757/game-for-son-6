import Phaser from 'phaser';
import { UI_COLORS, UI_FONT_STACK } from '../constants/ui';

interface TextButtonOptions {
  width?: number;
  height?: number;
  fillColor?: number;
  accentColor?: number;
  textColor?: string;
}

export class TextButton extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly labelText: Phaser.GameObjects.Text;
  private enabled = true;
  private selected = false;
  private readonly options: Required<TextButtonOptions>;
  private readonly hitArea: Phaser.Geom.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    options: TextButtonOptions = {},
  ) {
    super(scene, x, y);

    this.options = {
      width: options.width ?? 240,
      height: options.height ?? 68,
      fillColor: options.fillColor ?? 0xffcb63,
      accentColor: options.accentColor ?? 0x082030,
      textColor: options.textColor ?? UI_COLORS.ink,
    };

    this.background = scene.add.graphics();
    this.labelText = scene.add.text(0, 0, label, {
      fontFamily: UI_FONT_STACK,
      fontSize: '28px',
      fontStyle: 'bold',
      color: this.options.textColor,
      align: 'center',
    });

    this.labelText.setOrigin(0.5);
    this.add([this.background, this.labelText]);
    this.setSize(this.options.width, this.options.height);
    this.hitArea = new Phaser.Geom.Rectangle(
      0,
      0,
      this.options.width,
      this.options.height,
    );
    this.setInteractive(this.hitArea, Phaser.Geom.Rectangle.Contains);

    this.on('pointerdown', () => {
      if (!this.enabled) {
        return;
      }

      this.setScale(0.98);
      onClick();
    });

    this.on('pointerup', () => this.setScale(1));
    this.on('pointerout', () => this.setScale(1));

    scene.add.existing(this);
    this.redraw();
  }

  setLabel(label: string): void {
    this.labelText.setText(label);
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
    this.redraw();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.alpha = enabled ? 1 : 0.45;
    this.disableInteractive();
    if (enabled) {
      this.setInteractive(this.hitArea, Phaser.Geom.Rectangle.Contains);
    }
    this.redraw();
  }

  private redraw(): void {
    const width = this.options.width;
    const height = this.options.height;
    const backgroundColor = this.selected
      ? 0x87e6ff
      : this.options.fillColor;

    this.background.clear();
    this.background.fillStyle(0x082030, this.enabled ? 1 : 0.65);
    this.background.fillRoundedRect(
      -width / 2 + 6,
      -height / 2 + 8,
      width,
      height,
      22,
    );
    this.background.fillStyle(backgroundColor);
    this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 22);
    this.background.lineStyle(5, this.options.accentColor, 1);
    this.background.strokeRoundedRect(-width / 2, -height / 2, width, height, 22);
  }
}
