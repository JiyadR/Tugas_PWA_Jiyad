const CACHE_NAME = "webjivad-cache-v2";
const urlsToCache = [
  "./index.html",
  "./about.html",
  "./contact.html",
  "./offline.html",
  "./manifest.json",
  "./bacground/me.png",
  "./bacground/bg unand 2.png"
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
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
});

const offlinePage = "./offline.html";

// Fetch handler
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(offlinePage))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
    );
  }
});
