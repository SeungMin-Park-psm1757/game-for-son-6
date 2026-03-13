import './styles.css';
import { GameApp } from './game/GameApp';

const ROTATE_DISMISSED_KEY = 'goalpop-rotate-dismissed';
const mount = document.getElementById('game-shell');
const rotateContinueButton = document.getElementById('rotate-continue');

if (!mount) {
  throw new Error('Missing #game-shell mount point.');
}

if (window.sessionStorage.getItem(ROTATE_DISMISSED_KEY) === '1') {
  document.body.classList.add('rotate-dismissed');
}

rotateContinueButton?.addEventListener('click', () => {
  window.sessionStorage.setItem(ROTATE_DISMISSED_KEY, '1');
  document.body.classList.add('rotate-dismissed');
});

new GameApp(mount);
