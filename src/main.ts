import './styles.css';
import { GameApp } from './game/GameApp';

const ROTATE_DISMISSED_KEY = 'goalpop-rotate-dismissed';
const mount = document.getElementById('game-shell');
const rotateContinueButton = document.getElementById('rotate-continue');

if (!mount) {
  throw new Error('#game-shell 마운트 지점을 찾을 수 없습니다.');
}

if (window.sessionStorage.getItem(ROTATE_DISMISSED_KEY) === '1') {
  document.body.classList.add('rotate-dismissed');
}

const app = new GameApp(mount);
const refreshScale = () => {
  window.requestAnimationFrame(() => {
    app.game.scale.refresh();
  });
};

rotateContinueButton?.addEventListener('click', () => {
  window.sessionStorage.setItem(ROTATE_DISMISSED_KEY, '1');
  document.body.classList.add('rotate-dismissed');
  refreshScale();
});

window.addEventListener('resize', refreshScale, { passive: true });
