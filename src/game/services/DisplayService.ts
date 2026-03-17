class DisplayService {
  updateViewportVars(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.style.setProperty(
      '--app-height',
      `${window.innerHeight}px`,
    );
    document.documentElement.style.setProperty(
      '--app-width',
      `${window.innerWidth}px`,
    );
  }

  async requestImmersiveMode(): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      }
    } catch {
      // Fullscreen can be blocked by browser policy in regular tabs.
    }

    try {
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: 'portrait' | 'landscape') => Promise<void>;
      };

      if (orientation.lock) {
        await orientation.lock('landscape');
      }
    } catch {
      // Orientation lock is best-effort and may fail outside fullscreen.
    }

    this.updateViewportVars();
  }
}

export const displayService = new DisplayService();
