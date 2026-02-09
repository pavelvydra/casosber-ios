const CACHE_NAME = 'time-tracker-v1';
// Seznam souborů, které se mají uložit do cache pro offline přístup
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json'
];

// Instalace Service Workeru: Uložení statických souborů do cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache, adding all files for offline use.');
        // Poznámka: V Canvas prostředí nemusí být vždy '/' úspěšné,
        // proto se spoléháme hlavně na index.html a manifest.json
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache files during install:', error);
      })
  );
});

// Fetch událost: Vrátí obsah z cache (pokud je dostupný), jinak stáhne ze sítě
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - vracíme data z cache
        if (response) {
          return response;
        }
        // Cache miss - stahujeme ze sítě
        return fetch(event.request);
      }
    )
  );
});

// Aktivace Service Workeru: Vyčištění starých verzí cache
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Smaže staré cache
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});