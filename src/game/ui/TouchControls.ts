import Phaser from 'phaser';
import { InputMappingSystem } from '../systems/InputMappingSystem';
import { UI_FONT_STACK } from '../constants/ui';

type TouchAction = 'left' | 'right' | 'jump' | 'kick' | 'special' | 'pause';

interface TouchButtonRecord {
  action: TouchAction;
  background: Phaser.GameObjects.Arc;
  label: Phaser.GameObjects.Text;
}

export class TouchControls {
  readonly enabled: boolean;

  private readonly buttons: TouchButtonRecord[] = [];
  private readonly root: Phaser.GameObjects.Container;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly inputMapping: InputMappingSystem,
  ) {
    this.enabled =
      scene.sys.game.device.input.touch ||
      window.matchMedia?.('(pointer: coarse)').matches ||
      false;

    this.root = scene.add.container(0, 0);
    this.root.setDepth(24);
    this.root.setScrollFactor(0);

    if (!this.enabled) {
      this.root.setVisible(false);
      return;
    }

    this.createButton(108, 610, 46, '좌', 'left', 0x082030);
    this.createButton(226, 610, 46, '우', 'right', 0x082030);
    this.createButton(1_058, 610, 50, '점프', 'jump', 0x53c7ff);
    this.createButton(1_170, 618, 58, '슛', 'kick', 0xffcb63);
    this.createButton(1_102, 516, 52, '필살', 'special', 0xff6b57);
    this.createButton(1_196, 142, 32, 'II', 'pause', 0x082030);
  }

  setSpecialReady(ready: boolean): void {
    const specialButton = this.buttons.find((button) => button.action === 'special');

    if (!specialButton) {
      return;
    }

    specialButton.background.fillColor = ready ? 0xff6b57 : 0x545d6d;
    specialButton.label.alpha = ready ? 1 : 0.65;
  }

  destroy(): void {
    for (const button of this.buttons) {
      button.background.destroy();
      button.label.destroy();
    }

    this.root.destroy();
  }

  private createButton(
    x: number,
    y: number,
    radius: number,
    text: string,
    action: TouchAction,
    color: number,
  ): void {
    const background = this.scene.add.circle(x, y, radius, color, 0.78);
    const label = this.scene.add.text(x, y, text, {
      fontFamily: UI_FONT_STACK,
      fontSize: action === 'kick' ? '24px' : '22px',
      fontStyle: 'bold',
      color: '#f8f4da',
      stroke: '#082030',
      strokeThickness: 4,
    });

    label.setOrigin(0.5);
    background.setStrokeStyle(4, 0xf8f4da, 0.85);
    background.setScrollFactor(0);
    label.setScrollFactor(0);
    background.setInteractive(
      new Phaser.Geom.Circle(radius, radius, radius + 14),
      Phaser.Geom.Circle.Contains,
    );

    const setState = (pressed: boolean) => {
      this.inputMapping.setTouchAction(action, pressed);
      background.setScale(pressed ? 0.92 : 1);
      background.setAlpha(pressed ? 1 : 0.78);
    };

    background.on('pointerdown', () => setState(true));
    background.on('pointerup', () => setState(false));
    background.on('pointerout', () => setState(false));
    background.on('pointerupoutside', () => setState(false));

    this.buttons.push({
      action,
      background,
      label,
    });
    this.root.add([background, label]);
  }
}
