/* 青甘大环线 PWA Service Worker — 离线壳子缓存 */
const CACHE = 'suishigo-v12-1.2.9';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './data/scenes/index.json',
  './data/scenes/qinggan-loop.json',
  './data/scenes/chuanxi-loop.json',
  './data/scenes/yunnan-dali-lijiang.json',
  './data/scenes/xinjiang-north.json',
  './images/CREDITS.txt',
  './images/cx-cover-v2@1x.webp',
  './images/cx-cover-v2@2x.webp',
  './images/cx-d1-v2@1x.webp',
  './images/cx-d1-v2@2x.webp',
  './images/cx-d2-v2@1x.webp',
  './images/cx-d2-v2@2x.webp',
  './images/cx-d3-v2@1x.webp',
  './images/cx-d3-v2@2x.webp',
  './images/cx-d4-v2@1x.webp',
  './images/cx-d4-v2@2x.webp',
  './images/cx-d5-v2@1x.webp',
  './images/cx-d5-v2@2x.webp',
  './images/fallback@1x.webp',
  './images/fallback@2x.webp',
  './images/qg-cover-v2@1x.webp',
  './images/qg-cover-v2@2x.webp',
  './images/qg-d1-v2@1x.webp',
  './images/qg-d1-v2@2x.webp',
  './images/qg-d2-v2@1x.webp',
  './images/qg-d2-v2@2x.webp',
  './images/qg-d3-v3@1x.webp',
  './images/qg-d3-v3@2x.webp',
  './images/qg-d4-v2@1x.webp',
  './images/qg-d4-v2@2x.webp',
  './images/qg-d5-v2@1x.webp',
  './images/qg-d5-v2@2x.webp',
  './images/qg-d7-v2@1x.webp',
  './images/qg-d7-v2@2x.webp',
  './images/qg-danxia-v2@1x.webp',
  './images/qg-danxia-v2@2x.webp',
  './images/qg-trip-cover-v2@1x.webp',
  './images/qg-trip-cover-v2@2x.webp',
  './images/xj-cover-v2@1x.webp',
  './images/xj-cover-v2@2x.webp',
  './images/xj-d1-v2@1x.webp',
  './images/xj-d1-v2@2x.webp',
  './images/xj-d2-v2@1x.webp',
  './images/xj-d2-v2@2x.webp',
  './images/xj-d3-v2@1x.webp',
  './images/xj-d3-v2@2x.webp',
  './images/xj-d4-v2@1x.webp',
  './images/xj-d4-v2@2x.webp',
  './images/xj-d5-v2@1x.webp',
  './images/xj-d5-v2@2x.webp',
  './images/xj-d7-v2@1x.webp',
  './images/xj-d7-v2@2x.webp',
  './images/xj-sayram-sunset@1x.webp',
  './images/xj-sayram-sunset@2x.webp',
  './images/yn-cover-v2@1x.webp',
  './images/yn-cover-v2@2x.webp',
  './images/yn-d1-v2@1x.webp',
  './images/yn-d1-v2@2x.webp',
  './images/yn-d2-v2@1x.webp',
  './images/yn-d2-v2@2x.webp',
  './images/yn-d4-v2@1x.webp',
  './images/yn-d4-v2@2x.webp',
  './images/yn-d5-v2@1x.webp',
  './images/yn-d5-v2@2x.webp',
  './images/yn-lijiang-blue@1x.webp',
  './images/yn-lijiang-blue@2x.webp',
  './vendor/leaflet/leaflet.js',
  './vendor/leaflet/leaflet.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Same-origin: cache-first for shell assets; network-first for HTML
  if (url.origin !== self.location.origin) {
    // CDN (leaflet etc.): network with cache fallback
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  // HTML + scene JSON: network-first so content/cover updates are never masked by a stale cache
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((h) => h || caches.match('./index.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
