let version = 1;
let cacheName = `cache-v${version}`;
let dataCacheName = `weatherdata-v${version}`;
const cacheAssetFiles = [
  '/',
  '/index.html',
  '/pages/search.html',
  '/css/style.css',
  '/js/app.js',
  '/js/search.js',
  '/manifest.json',
  '/offline.json',
  '/favicon.ico',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/images/loading.gif'
];

self.addEventListener('install', (e) => {
  console.log('serviceWorker installed!!!');
  self.skipWaiting();

  e.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      console.log('caching files...');
      return cache.addAll(cacheAssetFiles);
    })
  );
});


self.addEventListener('activate', (e) => {
  console.log('serviceWorker activated!!!');

  e.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(cacheNames.map(thisCacheName => {
        if (thisCacheName !== cacheName && thisCacheName !== dataCacheName) {
          console.log('serviceWorker deleting outdated cache');
          return caches.delete(thisCacheName);
        }
      }))
    })
  );
});


self.addEventListener('fetch', (e) => {
  console.log('serviceWorker request for ', e.request.url);

  const req = e.request;
  const dataUrl = new URL(req.url);

  if (dataUrl.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }

});

async function cacheFirst(req) {
  const cacheResponse = await caches.match(req);
  return cacheResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open(dataCacheName);

  try {
    const response = await fetch(req);
    cache.put(req, response.clone());
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || caches.match('/offline.json');
  }

}