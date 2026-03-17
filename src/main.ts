import './styles.css';
import { GameApp } from './game/GameApp';
import { displayService } from './game/services/DisplayService';

const ROTATE_DISMISSED_KEY = 'goalpop-rotate-dismissed';
const mount = document.getElementById('game-shell');
const rotateContinueButton = document.getElementById('rotate-continue');

if (!mount) {
  throw new Error('#game-shell mount node was not found.');
}

if (window.sessionStorage.getItem(ROTATE_DISMISSED_KEY) === '1') {
  document.body.classList.add('rotate-dismissed');
}

displayService.updateViewportVars();

const app = new GameApp(mount);

const refreshScale = () => {
  displayService.updateViewportVars();
  window.requestAnimationFrame(() => {
    app.game.scale.refresh();
  });
};

rotateContinueButton?.addEventListener('click', () => {
  window.sessionStorage.setItem(ROTATE_DISMISSED_KEY, '1');
  document.body.classList.add('rotate-dismissed');
  void displayService.requestImmersiveMode();
  refreshScale();
});

window.addEventListener('resize', refreshScale, { passive: true });
window.addEventListener('orientationchange', refreshScale, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    refreshScale();
  }
});
