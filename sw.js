// TIMELY Service Worker for PWA functionality
const CACHE_NAME = 'timely-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './src/css/simple-styles.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('TIMELY Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('TIMELY Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('TIMELY Service Worker: Install complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('TIMELY Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('TIMELY Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('TIMELY Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('TIMELY Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('TIMELY Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response since it's a stream
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Fallback for offline scenarios
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Background sync for time updates (when network becomes available)
self.addEventListener('sync', (event) => {
  if (event.tag === 'time-sync') {
    console.log('TIMELY Service Worker: Background sync for time update');
    event.waitUntil(
      // Notify the main app that network is available
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'NETWORK_AVAILABLE',
            timestamp: Date.now()
          });
        });
      })
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    default:
      console.log('TIMELY Service Worker: Unknown message type', type);
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'time-update') {
    console.log('TIMELY Service Worker: Periodic sync for time update');
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PERIODIC_UPDATE',
            timestamp: Date.now()
          });
        });
      })
    );
  }
});

console.log('TIMELY Service Worker: Loaded successfully');
