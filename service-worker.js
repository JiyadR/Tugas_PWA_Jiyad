const CACHE_NAME = "webjivad-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./about.html",
  "./contact.html",
  "./offline.html",
  "./manifest.json",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker & bersihkan cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // ambil dari cache kalau ada
      }
      return fetch(event.request).catch(() => {
        // fallback kalau offline dan akses navigasi
        if (event.request.mode === "navigate") {
          return caches.match("./offline.html");
        }
      });
    })
  );
});
