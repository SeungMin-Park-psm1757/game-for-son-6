import Phaser from 'phaser';
import type { StadiumConfig } from '../types/StadiumConfig';

export function drawStadiumBackdrop(
  scene: Phaser.Scene,
  stadium: StadiumConfig,
  variant: 'menu' | 'match' | 'result' = 'menu',
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0);
  const graphics = scene.add.graphics();
  const stripeCount = 12;

  for (let index = 0; index < stripeCount; index += 1) {
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(stadium.skyTop),
      Phaser.Display.Color.ValueToColor(stadium.skyBottom),
      stripeCount - 1,
      index,
    );

    graphics.fillStyle(
      Phaser.Display.Color.GetColor(color.r, color.g, color.b),
      1,
    );
    graphics.fillRect(0, index * 54, 1280, 60);
  }

  graphics.fillStyle(0xffffff, stadium.id === 'sunset-arena' ? 0.26 : 0.16);
  graphics.fillCircle(
    stadium.id === 'sunset-arena' ? 1_020 : 250,
    stadium.id === 'sunset-arena' ? 126 : 132,
    variant === 'match' ? 76 : 92,
  );

  graphics.fillStyle(0x082030, 0.16);
  for (let index = 0; index < 8; index += 1) {
    graphics.fillCircle(80 + index * 180, 150 + (index % 2) * 14, 28);
  }

  graphics.fillStyle(stadium.crowd, 0.88);
  graphics.fillRect(0, 280, 1280, 114);

  for (let index = 0; index < 12; index += 1) {
    graphics.fillStyle(index % 2 === 0 ? 0xffcb63 : 0xffffff, 0.85);
    graphics.fillTriangle(
      50 + index * 104,
      280,
      92 + index * 104,
      210 + (index % 3) * 10,
      134 + index * 104,
      280,
    );
  }

  graphics.fillStyle(stadium.field, 1);
  graphics.fillRect(0, 394, 1280, 326);
  graphics.fillStyle(stadium.fieldStripe, 1);

  for (let index = 0; index < 8; index += 1) {
    graphics.fillRect(index * 160, 394, 80, 326);
  }

  graphics.lineStyle(8, stadium.line, 0.85);
  graphics.strokeRect(60, 430, 1_160, 250);
  graphics.strokeCircle(640, 555, 68);
  graphics.lineBetween(640, 430, 640, 680);

  if (variant === 'match') {
    graphics.lineStyle(8, stadium.goal, 0.9);
    graphics.strokeRect(10, 458, 108, 160);
    graphics.strokeRect(1_162, 458, 108, 160);
  }

  container.add(graphics);
  return container;
}

