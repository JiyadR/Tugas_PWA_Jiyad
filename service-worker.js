const CACHE_NAME = "webjivad-cache-v2";
const urlsToCache = [
  "./",
  "./Tugas_PWA_Jiyad/index.html",
  "./Tugas_PWA_Jiyad/about.html",
  "./Tugas_PWA_Jiyad/contact.html",
  "./Tugas_PWA_Jiyad/offline.html",
  "./Tugas_PWA_Jiyad/manifest.json",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker & hapus cache lama
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

// Fetch handler
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        // Jika gagal ambil dari cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika request dokumen HTML dan offline
          if (
            event.request.mode === "navigate" ||
            event.request.destination === "document"
          ) {
            return caches.match("./Tugas_PWA_Jiyad/offline.html");
          }
        });
      })
  );
});
