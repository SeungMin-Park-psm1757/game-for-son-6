import Phaser from 'phaser';
import { CHARACTERS } from '../config/characters';

const CHARACTER_TEXTURE_PREFIX = 'character-';

function drawRoundedRect(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: number,
): void {
  graphics.fillStyle(color);
  graphics.fillRoundedRect(x, y, width, height, radius);
}

function generateCharacterTexture(
  scene: Phaser.Scene,
  characterId: string,
  visuals: {
    skin: number;
    hair: number;
    primary: number;
    secondary: number;
    accent: number;
  },
): void {
  const key = `${CHARACTER_TEXTURE_PREFIX}${characterId}`;

  if (scene.textures.exists(key)) {
    return;
  }

  const graphics = scene.add.graphics();
  graphics.setVisible(false);

  graphics.fillStyle(0x091622);
  graphics.fillCircle(60, 42, 34);
  graphics.fillStyle(visuals.skin);
  graphics.fillCircle(60, 42, 29);

  graphics.fillStyle(visuals.hair);
  graphics.fillCircle(50, 27, 14);
  graphics.fillCircle(70, 23, 12);
  graphics.fillTriangle(36, 37, 56, 8, 82, 30);

  graphics.fillStyle(0x091622);
  graphics.fillCircle(49, 42, 4);
  graphics.fillCircle(71, 42, 4);
  graphics.fillCircle(59, 54, 3);
  graphics.lineStyle(4, 0x091622);
  graphics.beginPath();
  graphics.arc(60, 58, 11, Phaser.Math.DegToRad(15), Phaser.Math.DegToRad(165));
  graphics.strokePath();

  drawRoundedRect(graphics, 40, 72, 40, 28, 8, 0x091622);
  drawRoundedRect(graphics, 44, 74, 32, 24, 8, visuals.primary);
  drawRoundedRect(graphics, 44, 88, 32, 12, 6, visuals.secondary);

  graphics.fillStyle(0x091622);
  graphics.fillRect(40, 78, 10, 18);
  graphics.fillRect(70, 78, 10, 18);
  graphics.fillRect(48, 100, 9, 18);
  graphics.fillRect(64, 100, 9, 18);

  graphics.fillStyle(visuals.accent);
  graphics.fillCircle(60, 86, 6);
  graphics.fillStyle(0x091622);
  graphics.fillRect(40, 116, 19, 8);
  graphics.fillRect(61, 116, 19, 8);
  graphics.fillStyle(visuals.secondary);
  graphics.fillRect(41, 117, 17, 6);
  graphics.fillRect(62, 117, 17, 6);

  graphics.generateTexture(key, 120, 132);
  graphics.destroy();
}

export function getCharacterTextureKey(characterId: string): string {
  return `${CHARACTER_TEXTURE_PREFIX}${characterId}`;
}

export function ensureTextures(scene: Phaser.Scene): void {
  if (!scene.textures.exists('soccer-ball')) {
    const graphics = scene.add.graphics();
    graphics.setVisible(false);

    graphics.fillStyle(0x0b1724);
    graphics.fillCircle(24, 24, 21);
    graphics.fillStyle(0xfaf7ef);
    graphics.fillCircle(24, 24, 18);
    graphics.fillStyle(0x111b2b);
    graphics.fillCircle(24, 19, 5);
    graphics.fillCircle(17, 28, 4);
    graphics.fillCircle(30, 30, 4);
    graphics.lineStyle(2, 0x111b2b, 0.9);
    graphics.lineBetween(24, 19, 17, 28);
    graphics.lineBetween(24, 19, 30, 30);
    graphics.lineBetween(17, 28, 30, 30);
    graphics.generateTexture('soccer-ball', 48, 48);
    graphics.destroy();
  }

  if (!scene.textures.exists('spark')) {
    const graphics = scene.add.graphics();
    graphics.setVisible(false);

    graphics.fillStyle(0xffffff);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('spark', 8, 8);
    graphics.destroy();
  }

  for (const character of CHARACTERS) {
    generateCharacterTexture(scene, character.id, character.visuals);
  }
}
