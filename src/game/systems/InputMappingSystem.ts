import Phaser from 'phaser';
import type { PlayerActions } from '../types/MatchTypes';

type ActionKey = keyof PlayerActions;

export class InputMappingSystem {
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;
  private readonly touchHeld: Record<ActionKey, boolean> = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    special: false,
    pause: false,
  };
  private readonly touchQueued: Record<ActionKey, boolean> = {
    left: false,
    right: false,
    jump: false,
    kick: false,
    special: false,
    pause: false,
  };

  constructor(private readonly scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error('Keyboard input is unavailable.');
    }

    this.keys = keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.W,
      kick: Phaser.Input.Keyboard.KeyCodes.SPACE,
      special: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  setTouchAction(action: ActionKey, isActive: boolean): void {
    if (!this.touchHeld[action] && isActive) {
      this.touchQueued[action] = true;
    }

    this.touchHeld[action] = isActive;
  }

  getPlayerActions(): PlayerActions {
    return {
      left: this.keys.left.isDown || this.touchHeld.left,
      right: this.keys.right.isDown || this.touchHeld.right,
      jump: Phaser.Input.Keyboard.JustDown(this.keys.jump) || this.consumeQueued('jump'),
      kick: Phaser.Input.Keyboard.JustDown(this.keys.kick) || this.consumeQueued('kick'),
      special:
        Phaser.Input.Keyboard.JustDown(this.keys.special) ||
        this.consumeQueued('special'),
      pause: Phaser.Input.Keyboard.JustDown(this.keys.pause) || this.consumeQueued('pause'),
    };
  }

  private consumeQueued(action: ActionKey): boolean {
    const queued = this.touchQueued[action];
    this.touchQueued[action] = false;
    return queued;
  }
}

