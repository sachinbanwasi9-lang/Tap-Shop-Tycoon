const CACHE_NAME = "tap-shop-tycoon-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/main.css",
  "./css/responsive.css",
  "./js/config/GameConfig.js",
  "./js/utils/EventBus.js",
  "./js/core/SaveManager.js",
  "./js/core/SettingsManager.js",
  "./js/core/EconomyManager.js",
  "./js/core/GameManager.js",
  "./js/ui/UIManager.js",
  "./js/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
      .catch(() => caches.match("./index.html"))
  );
});
