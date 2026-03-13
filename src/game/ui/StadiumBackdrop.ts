import Phaser from 'phaser';
import { getStadiumTextureKey } from '../services/TextureFactory';
import type { StadiumConfig } from '../types/StadiumConfig';

export function drawStadiumBackdrop(
  scene: Phaser.Scene,
  stadium: StadiumConfig,
  variant: 'menu' | 'match' | 'result' = 'menu',
): Phaser.GameObjects.Container {
  const container = scene.add.container(0, 0);
  const backdrop = scene.add
    .image(640, 360, getStadiumTextureKey(stadium.id))
    .setDisplaySize(1_280, 720);
  const wash = scene.add.rectangle(
    640,
    360,
    1_280,
    720,
    0x082030,
    variant === 'match' ? 0.08 : variant === 'result' ? 0.16 : 0.12,
  );
  const topGlow = scene.add.rectangle(
    640,
    136,
    1_280,
    220,
    0xffffff,
    variant === 'match' ? 0.03 : 0.06,
  );

  container.add([backdrop, wash, topGlow]);
  return container;
}
