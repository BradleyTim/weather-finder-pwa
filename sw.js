let version = 1;
let cacheName = `cache-v${version++}`;
const cacheFiles  = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './css/offline.css',
  './js/app.js',
  './images/icons/icon-192x192.png',
  './images/icons/icon-384x384.png',
  './images/icons/icon-512x512.png',
  './manifest.json',
  'https://fonts.googleapis.com/css?family=Roboto'
];

self.addEventListener('install', (e) => {
  console.log('serviceWorker installed!!!');
  self.skipWaiting();

  e.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      console.log('caching files...');
      return cache.addAll(cacheFiles);
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