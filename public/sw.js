const CACHE_NAME = 'soilsidekick-pro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png'
];

// Error tracking storage
const ERROR_LOG_KEY = 'sw_error_log';
const MAX_ERROR_LOG_SIZE = 100;

// Log error to IndexedDB
async function logError(error, context) {
  try {
    const errorEntry = {
      timestamp: Date.now(),
      message: error.message || String(error),
      stack: error.stack,
      context: context,
      userAgent: navigator.userAgent,
      cacheVersion: CACHE_NAME,
    };

    // Store in IndexedDB
    const db = await openErrorDB();
    const tx = db.transaction('errors', 'readwrite');
    const store = tx.objectStore('errors');
    await store.add(errorEntry);

    // Keep only last 100 errors
    const allErrors = await store.getAll();
    if (allErrors.length > MAX_ERROR_LOG_SIZE) {
      const oldestKeys = await store.getAllKeys();
      for (let i = 0; i < allErrors.length - MAX_ERROR_LOG_SIZE; i++) {
        await store.delete(oldestKeys[i]);
      }
    }

    console.error('[SW Error]', context, error);
  } catch (dbError) {
    console.error('[SW Error Logging Failed]', dbError);
  }
}

// Open IndexedDB for error storage
function openErrorDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ServiceWorkerErrors', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('errors')) {
        db.createObjectStore('errors', { autoIncrement: true });
      }
    };
  });
}

// Install event - cache essential files with error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Installation successful');
        return self.skipWaiting();
      })
      .catch((error) => {
        logError(error, 'install');
        throw error;
      })
  );
});

// Activate event - clean up old caches with error handling
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation successful');
        return self.clients.claim();
      })
      .catch((error) => {
        logError(error, 'activate');
        throw error;
      })
  );
});

// Fetch event - network first, fall back to cache with comprehensive error handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome extensions and non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful GET requests
        if (request.method === 'GET' && response && response.status === 200) {
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            })
            .catch((error) => {
              logError(error, `cache_put: ${url.pathname}`);
            });
        }
        
        return response;
      })
      .catch((fetchError) => {
        // Network failed, try cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache:', url.pathname);
              return cachedResponse;
            }
            
            // No cache available, log and return error
            logError(fetchError, `fetch_failed: ${url.pathname}`);
            
            // Return a custom offline page or error response
            return new Response(
              JSON.stringify({
                error: 'Network request failed and no cached version available',
                offline: true,
                url: request.url,
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json',
                }),
              }
            );
          })
          .catch((cacheError) => {
            logError(cacheError, `cache_match: ${url.pathname}`);
            throw cacheError;
          });
      })
  );
});

// Global error handler
self.addEventListener('error', (event) => {
  logError(event.error || event, 'global_error');
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, 'unhandled_rejection');
});

// Message handler for error log retrieval
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_ERROR_LOG') {
    openErrorDB()
      .then((db) => {
        const tx = db.transaction('errors', 'readonly');
        return tx.objectStore('errors').getAll();
      })
      .then((errors) => {
        event.ports[0].postMessage({ errors });
      })
      .catch((error) => {
        logError(error, 'message_handler');
        event.ports[0].postMessage({ errors: [], error: error.message });
      });
  } else if (event.data && event.data.type === 'CLEAR_ERROR_LOG') {
    openErrorDB()
      .then((db) => {
        const tx = db.transaction('errors', 'readwrite');
        return tx.objectStore('errors').clear();
      })
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        logError(error, 'clear_errors');
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

console.log('[SW] Service worker loaded successfully');
