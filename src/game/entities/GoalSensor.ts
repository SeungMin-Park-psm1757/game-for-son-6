import Phaser from 'phaser';

export class GoalSensor extends Phaser.GameObjects.Zone {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    public readonly side: 'left' | 'right',
  ) {
    super(scene, x, y, width, height);

    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}

