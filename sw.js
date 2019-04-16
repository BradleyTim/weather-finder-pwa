let version = 2;
let cacheName = `cache-v${version}`;
const cacheAssetFiles  = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/css/offline.css',
  '/js/app.js',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/favs/android-icon-36x36.png',
  '/favs/android-icon-48x48.png',
  '/favs/android-icon-72x72.png',
  '/favs/android-icon-96x96.png',
  '/favs/android-icon-144x144.png',
  '/favs/android-icon-192x192.png',
  '/favs/apple-icon-57x57.png',
  '/favs/apple-icon-60x60.png',
  '/favs/apple-icon-72x72.png',
  '/favs/apple-icon-76x76.png',
  '/favs/apple-icon-114x114.png',
  '/favs/apple-icon-120x120.png',
  '/favs/apple-icon-144x144.png',
  '/favs/apple-icon-152x152.png',
  '/favs/apple-icon-180x180.png',
  '/favs/apple-icon-precomposed.png',
  '/favs/apple-icon.png',
  '/favs/browserconfig.xml',
  '/favs/favicon-16x16.png',
  '/favs/favicon-32x32.png',
  '/favs/favicon-96x96.png',
  '/favs/favicon.ico',
  '/favs/ms-icon-70x70.png',
  '/favs/ms-icon-144x144.png',
  '/favs/ms-icon-150x150.png',
  '/favs/ms-icon-310x310.png',
  '/manifest.json'
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
        if(thisCacheName !== cacheName) {
          console.log('serviceWorker deleting outdated cache');
          return caches.delete(thisCacheName);
        }
      }))
    })
  );
});


self.addEventListener('fetch', (e) => {
  console.log('serviceWorker request for ', e.request.url);

  e.respondWith(

    caches.match(e.request)
    .then(cachedResponse => {
      if(cachedResponse) {
        console.log('fetching from cache!!!');
        return cachedResponse;
      }

      return fetch(e.request)
      .then(fetchResponse => fetchResponse)
      .catch(err => {
        const isHtmlPage = e.request.method === 'GET' && e.request.headers.get('accept').includes('text/html');
        if(isHtmlPage) return caches.match('/offline.html');
      });

      // const requestClone = e.request.clone();

      // fetch(requestClone)
      // .then(response => {
      //   if(!response) {
      //     console.log('No response from fetch');
      //     return response;
      //   }

      //   const responseClone = response.clone();

      //   caches.open(cacheName).then(cache => {
      //     caches.put(e.request, responseClone);
      //     return response;
      //   })

      // })
    })
  );
});