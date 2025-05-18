const CACHE_NAME = 'ai-shooter-v1';
const ASSETS = [
  '.',
  'index.html',
  'p5.min.js',
  'sketch.js',
  'manifest.json',
  'js/game.js',
  'js/player.js',
  'js/enemy.js',
  'js/bullet.js',
  'js/collision.js',
  'js/controls.js',
  'js/virtual-joystick.js',
  'js/ui.js',
  'js/mobile-optimization.js',
  'assets/player.png',
  'assets/enemy_normal.png',
  'assets/enemy_fast.png',
  'assets/enemy_strong.png',
  'assets/bullet.png',
  'assets/background.png',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
}); 