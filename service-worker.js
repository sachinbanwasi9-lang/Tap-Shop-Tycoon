/**
 * service-worker.js
 * ------------------------------------------------------------
 * Caches the app shell (HTML/CSS/JS/config) so core gameplay —
 * shop, products, staff, upgrades, save — works with zero network
 * connection, per the OFFLINE / ONLINE requirements. Only Ads/IAP/
 * Analytics (added in later phases) will require connectivity, and
 * those will fail gracefully on their own.
 *
 * Strategy: cache-first for app shell assets, network-first-with-
 * fallback for anything else (keeps things simple and safe for v1).
 * ------------------------------------------------------------
 */

const CACHE_NAME = 'tap-shop-tycoon-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/responsive.css',
  './js/config/GameConfig.js',
  './js/utils/EventBus.js',
  './js/core/SaveManager.js',
  './js/core/SettingsManager.js',
  './js/core/EconomyManager.js',
  './js/core/GameManager.js',
  './js/ui/UIManager.js',
  './js/main.js',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg',
  './assets/icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests — never intercept ad/IAP/
  // analytics calls to third-party domains added in later phases.
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Opportunistically cache new same-origin assets
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached — fall back to the app shell so the
          // player at least reaches the game instead of a browser error.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
