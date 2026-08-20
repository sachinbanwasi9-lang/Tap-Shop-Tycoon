/**
 * main.js
 * ------------------------------------------------------------
 * Application entry point. Waits for DOM ready, boots GameManager,
 * constructs UIManager, and registers the service worker for PWA
 * support. This file intentionally stays tiny — all real logic
 * lives inside the manager classes.
 * ------------------------------------------------------------
 */

(function bootstrap() {
  function start() {
    try {
      window.game = new GameManager();
      window.ui = new UIManager(window.game);

      // showScreen('loading') is the default active screen in the HTML;
      // GameManager.init() will emit 'game:initialized', which UIManager
      // listens for to switch to the tutorial or main menu.
      window.game.init();
    } catch (err) {
      console.error('[bootstrap] Fatal error during startup:', err);
      const loadingScreen = document.getElementById('screen-loading');
      if (loadingScreen) {
        loadingScreen.innerHTML =
          '<div class="loading-error">Something went wrong loading Tap Shop Tycoon.<br>' +
          'Please refresh the app. If this keeps happening, try resetting your data ' +
          'from Settings.</div>';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // PWA: register service worker (non-blocking, best effort)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((err) => {
        console.warn('[bootstrap] Service worker registration failed:', err);
      });
    });
  }
})();
