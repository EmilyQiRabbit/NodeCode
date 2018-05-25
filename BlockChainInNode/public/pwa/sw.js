
var filesToCache = [
  'pwaCache.js',
  'cache.html'
];

var CACHE_NAME = 'pwa-cache-v1';
self.addEventListener('install', function(event) {
  console.log('sw install')
  event.waitUntil(caches
    .open(CACHE_NAME)//open this cache from caches and it will return a Promise
    .then(function(cache) { //catch that promise
        console.log('[ServiceWorker] Caching files');
        cache.addAll(filesToCache);//add all required files to cache it also returns a Promise
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('sw fetch')
  // 一律拦截，返回 Hello World!
  event.respondWith(new Response('Hello World!'));
  // event.respondWith(
  //   caches.match(event.request)
  //     .then(function(response) {
  //       // Cache hit - return response
  //       if (response) {
  //         return response;
  //       }

  //       return fetch(event.request);
  //     }
  //   )
  // );
});

self.addEventListener('activate', event => {
  console.log('sw activate')
});

self.addEventListener('push', event => {
  event.waitUntil(
    // Process the event and display a notification.
    self.registration.showNotification("Hey!")
  );
});