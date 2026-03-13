import Phaser from 'phaser';
import type { StadiumConfig } from '../types/StadiumConfig';

function shiftColor(color: number, amount: number): number {
  const base = Phaser.Display.Color.ValueToColor(color);
  return Phaser.Display.Color.GetColor(
    Phaser.Math.Clamp(base.red + amount, 0, 255),
    Phaser.Math.Clamp(base.green + amount, 0, 255),
    Phaser.Math.Clamp(base.blue + amount, 0, 255),
  );
}

function drawGoal(
  graphics: Phaser.GameObjects.Graphics,
  stadium: StadiumConfig,
  side: 'left' | 'right',
): void {
  const isLeft = side === 'left';
  const x = isLeft ? 28 : 1_170;
  const y = 466;
  const width = 84;
  const height = 148;
  const netColor = shiftColor(stadium.goal, -40);

  graphics.fillStyle(0x000000, 0.12);
  graphics.fillRect(x + (isLeft ? 12 : -6), y + height, width + 22, 12);

  graphics.fillStyle(0xffffff, 0.07);
  graphics.fillRect(x, y + 8, width, height);

  graphics.lineStyle(6, stadium.goal, 0.95);
  graphics.strokeRect(x, y, width, height);

  graphics.lineStyle(2, netColor, 0.6);
  for (let row = 0; row < 6; row += 1) {
    const yPos = y + 18 + row * 22;
    graphics.lineBetween(x + 4, yPos, x + width - 4, yPos);
  }

  for (let col = 0; col < 5; col += 1) {
    const xPos = x + 12 + col * 16;
    graphics.lineBetween(xPos, y + 4, xPos, y + height - 4);
  }

  graphics.lineStyle(4, stadium.goal, 0.7);
  graphics.lineBetween(x, y, x + (isLeft ? 18 : -18), y - 18);
  graphics.lineBetween(
    x + width,
    y,
    x + width + (isLeft ? 18 : -18),
    y - 18,
  );
  graphics.lineBetween(
    x + (isLeft ? 18 : -18),
    y - 18,
    x + width + (isLeft ? 18 : -18),
    y - 18,
  );
}

export function drawStadiumBackdrop(
  scene: Phaser.Scene,
  stadium: StadiumConfig,
  variant: 'menu' | 'match' | 'result' = 'menu',
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0);
  const graphics = scene.add.graphics();
  const stripeCount = 12;
  const glowRadius = variant === 'match' ? 66 : 92;

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
    graphics.fillRect(0, index * 36, 1_280, 40);
  }

  graphics.fillStyle(0xffffff, stadium.id === 'sunset-arena' ? 0.2 : 0.12);
  graphics.fillCircle(
    stadium.id === 'sunset-arena' ? 1_010 : 260,
    stadium.id === 'sunset-arena' ? 116 : 128,
    glowRadius,
  );
  graphics.fillStyle(stadium.id === 'sunset-arena' ? 0xffcb63 : 0x87e6ff, 0.92);
  graphics.fillCircle(
    stadium.id === 'sunset-arena' ? 1_010 : 260,
    stadium.id === 'sunset-arena' ? 116 : 128,
    glowRadius * 0.55,
  );

  graphics.fillStyle(shiftColor(stadium.crowd, -48), 0.92);
  graphics.fillRect(0, 184, 1_280, 48);
  graphics.fillRect(0, 220, 1_280, 34);

  graphics.fillStyle(shiftColor(stadium.crowd, -22), 1);
  graphics.fillRect(0, 254, 1_280, 112);
  graphics.fillStyle(shiftColor(stadium.crowd, 18), 1);
  graphics.fillRect(0, 366, 1_280, 44);

  const seatColors = [
    shiftColor(stadium.crowd, 62),
    shiftColor(stadium.crowd, 36),
    shiftColor(stadium.line, -4),
    shiftColor(stadium.skyBottom, 18),
  ];

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 33; col += 1) {
      const seatX = 12 + col * 39 + (row % 2) * 8;
      const seatY = 238 + row * 22;
      const seatColor = seatColors[(row + col) % seatColors.length];

      graphics.fillStyle(seatColor, 0.95);
      graphics.fillRect(seatX, seatY, 20, 10);
      graphics.fillStyle(shiftColor(seatColor, -18), 0.95);
      graphics.fillRect(seatX + 2, seatY + 10, 16, 5);
    }
  }

  graphics.fillStyle(shiftColor(stadium.crowd, -34), 0.95);
  graphics.fillRect(0, 410, 1_280, 28);

  const boardColors = [
    shiftColor(stadium.skyBottom, 10),
    shiftColor(stadium.fieldStripe, 34),
    shiftColor(stadium.line, 0),
    shiftColor(stadium.skyTop, 18),
  ];

  for (let index = 0; index < 11; index += 1) {
    graphics.fillStyle(boardColors[index % boardColors.length], 0.96);
    graphics.fillRect(12 + index * 116, 382, 96, 26);
  }

  graphics.fillStyle(shiftColor(stadium.field, -26), 0.52);
  graphics.fillRect(0, 438, 1_280, 18);
  graphics.fillStyle(stadium.field, 1);
  graphics.fillRect(0, 456, 1_280, 264);

  for (let index = 0; index < 10; index += 1) {
    graphics.fillStyle(index % 2 === 0 ? stadium.fieldStripe : stadium.field, 0.88);
    graphics.fillRect(index * 128, 456, 72, 264);
  }

  graphics.fillStyle(0xffffff, 0.12);
  graphics.fillRect(0, 456, 1_280, 8);
  graphics.fillStyle(shiftColor(stadium.field, -34), 0.35);
  graphics.fillRect(0, 606, 1_280, 6);
  graphics.fillRect(0, 680, 1_280, 12);

  graphics.lineStyle(4, stadium.line, 0.45);
  graphics.lineBetween(0, 612, 1_280, 612);
  graphics.lineStyle(4, stadium.line, 0.28);
  graphics.lineBetween(640, 504, 640, 690);

  graphics.fillStyle(shiftColor(stadium.goal, -48), 0.35);
  graphics.fillRect(0, 454, 124, 8);
  graphics.fillRect(1_156, 454, 124, 8);

  drawGoal(graphics, stadium, 'left');
  drawGoal(graphics, stadium, 'right');

  graphics.fillStyle(0x000000, variant === 'result' ? 0.18 : 0.08);
  graphics.fillRect(0, 0, 1_280, 720);

  container.add(graphics);
  return container;
}
