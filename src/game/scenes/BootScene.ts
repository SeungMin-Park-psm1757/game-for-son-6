import Phaser from 'phaser';
import { audioService } from '../services/AudioService';
import { saveService } from '../services/SaveService';
import { sessionService } from '../services/SessionService';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    const saveData = saveService.load();
    const debugTarget =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('debug')
        : null;

    audioService.boot(saveData.settings.soundOn);
    if (debugTarget === 'match') {
      sessionService.setSelection({
        playerCharacterId: 'blaze',
        cpuCharacterId: 'atlas',
        difficultyId: 'normal',
        stadiumId: 'sunset-arena',
      });
      this.registry.set('bootTargetScene', 'MatchScene');
    } else if (debugTarget === 'select') {
      this.registry.set('bootTargetScene', 'CharacterSelectScene');
    } else {
      this.registry.set('bootTargetScene', 'TitleScene');
    }

    this.scene.start('PreloadScene');
  }
}
