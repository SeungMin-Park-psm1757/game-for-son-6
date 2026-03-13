import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, MATCH_CONSTANTS } from './constants/balance';
import { BootScene } from './scenes/BootScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { MatchScene } from './scenes/MatchScene';
import { PreloadScene } from './scenes/PreloadScene';
import { ResultScene } from './scenes/ResultScene';
import { TitleScene } from './scenes/TitleScene';

export class GameApp {
  readonly game: Phaser.Game;

  constructor(parent: string | HTMLElement) {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#041119',
      render: {
        antialias: true,
        pixelArt: false,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: MATCH_CONSTANTS.gravityY },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      input: {
        activePointers: 4,
      },
      scene: [
        BootScene,
        PreloadScene,
        TitleScene,
        CharacterSelectScene,
        MatchScene,
        ResultScene,
      ],
    });
  }
}
