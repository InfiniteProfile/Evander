var C = 'evander-v1';
var F = ['./', 'index.html', 'style.css', 'script.js', 'manifest.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(F); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(r).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone(), u = new URL(r.url);
          u.search = '';
          caches.open(C).then(function (c) { c.put(u.href, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
