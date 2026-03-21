const CACHE_NAME = 'income-spectrum-v3';

const APP_SHELL = [
  '/app.html',
  '/css/app.css',
  '/js/app.js',
  '/img/logo.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/apple-touch-icon.png',
  '/img/favicon.png',
  '/manifest.json',
  '/income-options.html',
  '/education-training.html',
  '/supportive-services.html',
  '/state-federal-resources.html',
  '/federal-contracting-resources.html',
  '/state-contracting-resources.html',
  '/local-government-contracting-resources.html',
  '/asl-interpreter-opportunities-by-state.html',
  '/asl-education-and-training-by-state.html',
  '/asl-communication-access-services-by-state.html',
  '/asl-official-information-by-state.html',
  '/blog/index.html',
  '/blog/what-people-will-pay-for/index.html',
  '/blog/government-contracting-resources/index.html',
  '/blog/best-ai-tools-for-people-trying-to-make-money-on-their-own/index.html',
  '/blog/what-people-will-pay-for-quiz/index.html'
];

// Install - cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch - cache-first for app shell, network-first for everything else
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Cache-first for static app shell assets
  const isShell = APP_SHELL.some(path => url.pathname === path || url.pathname.startsWith(path.split('?')[0]));

  if (isShell) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network-first for everything else, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
