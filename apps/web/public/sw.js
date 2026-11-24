/* Offline app shell for Ryad Al Aqsa. Works under any BASE_URL subpath. */
(function () {
  var scope = self.registration.scope;
  var shell = [scope, scope + 'index.html', scope + 'logo.svg', scope + 'manifest.webmanifest'];
  var cacheName = 'ryad-shell-v1::' + scope;

  self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(cacheName).then(function (cache) {
        return Promise.all(
          shell.map(function (url) {
            return cache.add(url).catch(function () { return undefined; });
          }),
        );
      }).then(function () { return self.skipWaiting(); }),
    );
  });

  self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.filter(function (key) { return key !== cacheName; }).map(function (key) {
            return caches.delete(key);
          }),
        );
      }).then(function () { return self.clients.claim(); }),
    );
  });

  self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    // API responses are user-scoped; never cache them in a shared browser cache.
    if (url.pathname.indexOf('/api/') !== -1) return;

    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request).then(function (response) {
          var copy = response.clone();
          caches.open(cacheName).then(function (cache) { cache.put(scope + 'index.html', copy); });
          return response;
        }).catch(function () { return caches.match(scope + 'index.html'); }),
      );
      return;
    }

    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response.ok) {
            var copy = response.clone();
            caches.open(cacheName).then(function (cache) { cache.put(request, copy); });
          }
          return response;
        });
      }),
    );
  });
})();
