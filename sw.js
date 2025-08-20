// TIMELY Service Worker for PWA functionality
const CACHE_NAME = 'timely-v2.1.0';
const STATIC_CACHE = 'timely-static-v2.1.0';
const DYNAMIC_CACHE = 'timely-dynamic-v2.1.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './src/css/simple-styles.css',
  './src/assets/timely-logo.svg',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap'
];

// Enhanced offline fallback page
const OFFLINE_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TIMELY - Offline</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
               display: flex; align-items: center; justify-content: center; min-height: 100vh; 
               margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
               color: white; text-align: center; }
        .offline-container { max-width: 400px; padding: 2rem; }
        .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
        h1 { margin: 0 0 1rem 0; }
        p { opacity: 0.9; margin-bottom: 2rem; }
        button { background: rgba(255,255,255,0.2); border: 2px solid white; 
                 color: white; padding: 12px 24px; border-radius: 8px; 
                 font-size: 16px; cursor: pointer; }
        button:hover { background: rgba(255,255,255,0.3); }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">🕐</div>
        <h1>You're Offline</h1>
        <p>TIMELY is currently offline. Please check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Try Again</button>
    </div>
</body>
</html>
`;

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('TIMELY Service Worker: Installing v2.1.0...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('TIMELY Service Worker: Caching static assets');
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('TIMELY Service Worker: Preparing dynamic cache');
        return cache.put('/offline', new Response(OFFLINE_PAGE, {
          headers: { 'Content-Type': 'text/html' }
        }));
      })
    ]).then(() => {
      console.log('TIMELY Service Worker: Install complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('TIMELY Service Worker: Activating v2.1.0...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old caches
        ...cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('TIMELY Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        }),
        // Take control of all clients
        self.clients.claim()
      ]);
    }).then(() => {
      console.log('TIMELY Service Worker: Activation complete');
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: '2.1.0'
          });
        });
      });
    })
  );
});

// Enhanced fetch event with cache strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for fonts)
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('fonts.googleapis.com') &&
      !event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (event.request.destination === 'document') {
    // Documents: Network first, then cache, then offline page
    event.respondWith(handleDocumentRequest(event.request));
  } else if (event.request.url.includes('fonts.googleapis.com') || 
             event.request.url.includes('fonts.gstatic.com')) {
    // Fonts: Cache first (they rarely change)
    event.respondWith(handleFontRequest(event.request));
  } else if (event.request.destination === 'style' || 
             event.request.destination === 'script' || 
             event.request.destination === 'image') {
    // Static assets: Cache first with network fallback
    event.respondWith(handleStaticAssetRequest(event.request));
  } else {
    // Other requests: Network first with cache fallback
    event.respondWith(handleNetworkFirstRequest(event.request));
  }
});

// Document request handler
async function handleDocumentRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for document, trying cache...');
  }

  // Try cache if network fails
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fallback to offline page
  return caches.match('/offline');
}

// Font request handler (cache first strategy)
async function handleFontRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Font loading failed:', error);
    throw error;
  }
}

// Static asset request handler
async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Static asset loading failed:', error);
    throw error;
  }
}

// Network first request handler
async function handleNetworkFirstRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Enhanced background sync for time updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'time-sync') {
    console.log('TIMELY Service Worker: Background sync for time update');
    event.waitUntil(handleTimeSync());
  } else if (event.tag === 'cache-cleanup') {
    console.log('TIMELY Service Worker: Background sync for cache cleanup');
    event.waitUntil(handleCacheCleanup());
  }
});

// Handle time synchronization
async function handleTimeSync() {
  try {
    const clients = await self.clients.matchAll();
    const timestamp = Date.now();
    
    clients.forEach((client) => {
      client.postMessage({
        type: 'NETWORK_AVAILABLE',
        timestamp: timestamp,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    });
    
    console.log('TIMELY Service Worker: Time sync completed');
  } catch (error) {
    console.error('TIMELY Service Worker: Time sync failed', error);
  }
}

// Handle cache cleanup
async function handleCacheCleanup() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Remove entries older than 24 hours
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      const response = await cache.match(request);
      const responseDate = new Date(response.headers.get('date'));
      
      if (responseDate.getTime() < dayAgo) {
        await cache.delete(request);
        console.log('TIMELY Service Worker: Cleaned old cache entry', request.url);
      }
    }
  } catch (error) {
    console.error('TIMELY Service Worker: Cache cleanup failed', error);
  }
}

// Enhanced message handling
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ 
        version: STATIC_CACHE,
        features: ['offline', 'background-sync', 'cache-strategies', 'enhanced-pwa']
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ cacheSize: size });
      });
      break;
      
    default:
      console.log('TIMELY Service Worker: Unknown message type', type);
  }
});

// Utility function to clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Utility function to get cache size
async function getCacheSize() {
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'time-update') {
    console.log('TIMELY Service Worker: Periodic sync for time update');
    event.waitUntil(handleTimeSync());
  } else if (event.tag === 'cache-maintenance') {
    console.log('TIMELY Service Worker: Periodic cache maintenance');
    event.waitUntil(handleCacheCleanup());
  }
});

// Push notification handler (for future features)
self.addEventListener('push', (event) => {
  console.log('TIMELY Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time zone update available',
    icon: '/src/assets/timely-logo.svg',
    badge: '/src/assets/timely-logo.svg',
    vibrate: [200, 100, 200],
    data: {
      timestamp: Date.now(),
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Time',
        icon: '/src/assets/timely-logo.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TIMELY', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll().then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

console.log('TIMELY Service Worker v2.1.0: Loaded successfully with enhanced PWA features');
