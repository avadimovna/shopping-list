const CACHE_NAME = "shopping-list-v1.6";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/js/components/listField.js",
  "/js/components/listItem.js",
  "/js/components/modal.js",
  "/js/pages/listPage.js",
  "/js/pages/startPage.js",
  "/js/state/state.js",
  "/js/utils/share.js",
  "/js/utils/storage.js",
  "/js/utils/utils.js",
  "/js/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/images/button-back.png",
  "/images/button-bin.png",
  "/images/button-cancel.png",
  "/images/button-done.png",
  "/images/button-edit.png",
  "/images/button-more.png",
  "/images/button-drag.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});