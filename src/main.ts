import './styles.css';
import { GameApp } from './game/GameApp';

const mount = document.getElementById('game-shell');

if (!mount) {
  throw new Error('Missing #game-shell mount point.');
}

new GameApp(mount);

