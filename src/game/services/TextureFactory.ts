import Phaser from 'phaser';
import { CHARACTERS } from '../config/characters';
import { STADIUMS } from '../config/stadiums';

const CHARACTER_TEXTURE_PREFIX = 'character-';
const STADIUM_TEXTURE_PREFIX = 'stadium-';

interface SvgAsset {
  key: string;
  path: string;
}

function getPublicAssetPath(path: string): string {
  return `art/${path}`;
}

function queueSvg(scene: Phaser.Scene, asset: SvgAsset): void {
  if (scene.textures.exists(asset.key)) {
    return;
  }

  scene.load.image(asset.key, asset.path);
}

function getCharacterAssetPath(characterId: string): string {
  return getPublicAssetPath(`characters/${characterId}.svg`);
}

function getStadiumAssetPath(stadiumId: string): string {
  return getPublicAssetPath(`backgrounds/${stadiumId}.svg`);
}

export function getCharacterTextureKey(characterId: string): string {
  return `${CHARACTER_TEXTURE_PREFIX}${characterId}`;
}

export function getStadiumTextureKey(stadiumId: string): string {
  return `${STADIUM_TEXTURE_PREFIX}${stadiumId}`;
}

export function queueArtAssets(scene: Phaser.Scene): void {
  for (const character of CHARACTERS) {
    queueSvg(scene, {
      key: getCharacterTextureKey(character.id),
      path: getCharacterAssetPath(character.id),
    });
  }

  for (const stadium of STADIUMS) {
    queueSvg(scene, {
      key: getStadiumTextureKey(stadium.id),
      path: getStadiumAssetPath(stadium.id),
    });
  }

  queueSvg(scene, {
    key: 'soccer-ball',
    path: getPublicAssetPath('props/soccer-ball.svg'),
  });
  queueSvg(scene, {
    key: 'spark',
    path: getPublicAssetPath('effects/paint-star.svg'),
  });
  queueSvg(scene, {
    key: 'pixel-star',
    path: getPublicAssetPath('effects/paint-star.svg'),
  });
  queueSvg(scene, {
    key: 'pixel-chip',
    path: getPublicAssetPath('effects/paint-splash.svg'),
  });
  queueSvg(scene, {
    key: 'pixel-bolt',
    path: getPublicAssetPath('effects/paint-swoosh.svg'),
  });
}
