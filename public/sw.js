const CACHE_NAME = 'soilsidekick-pro-v3';
const STATIC_CACHE = 'soilsidekick-static-v3';
const DATA_CACHE = 'soilsidekick-data-v3';

// Core app shell files — always pre-cached
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png',
  '/offline.html',
  '/favicon.ico',
  '/favicon.png',
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

    const db = await openErrorDB();
    const tx = db.transaction('errors', 'readwrite');
    const store = tx.objectStore('errors');
    await store.add(errorEntry);

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

// ──────────────────────────────────────────────
// INSTALL — pre-cache app shell + discover built assets
// ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v3...');

  event.waitUntil(
    Promise.all([
      // Cache the app shell
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(APP_SHELL);
      }),
      // Pre-cache built assets (JS/CSS bundles) by fetching the index page
      // and caching any same-origin assets discovered
      caches.open(STATIC_CACHE).then(async (cache) => {
        try {
          const response = await fetch('/index.html');
          const html = await response.text();

          // Extract JS and CSS asset URLs from the HTML
          const assetUrls = [];
          const scriptMatches = html.matchAll(/src="(\/assets\/[^"]+)"/g);
          const linkMatches = html.matchAll(/href="(\/assets\/[^"]+)"/g);

          for (const m of scriptMatches) assetUrls.push(m[1]);
          for (const m of linkMatches) assetUrls.push(m[1]);

          if (assetUrls.length > 0) {
            console.log(`[SW] Pre-caching ${assetUrls.length} built assets`);
            await cache.addAll(assetUrls);
          }
        } catch (err) {
          // Non-fatal: assets will be cached on first fetch
          console.warn('[SW] Could not pre-cache built assets:', err.message);
        }
      }),
    ])
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

// ──────────────────────────────────────────────
// ACTIVATE — clean up old caches
// ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v3...');
  const currentCaches = [CACHE_NAME, STATIC_CACHE, DATA_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
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

// ──────────────────────────────────────────────
// FETCH — strategy depends on request type
// ──────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip Supabase API calls — never cache these
  if (url.hostname.includes('supabase')) return;

  // Static assets (JS/CSS/images/fonts) → Cache-First
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests → Network-First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Everything else → Network-First with cache fallback
  event.respondWith(networkFirst(request, DATA_CACHE));
});

// ──────────────────────────────────────────────
// Caching strategies
// ──────────────────────────────────────────────

function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|otf|eot|png|jpg|jpeg|gif|svg|webp|ico|mp4|webm|wasm|mjs)(\?|$)/.test(url.pathname)
    || url.pathname.startsWith('/assets/');
}

/** Cache-First: return cached version, only go to network on miss */
async function cacheFirst(request, cacheName) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response && response.status === 200 && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    logError(error, `cacheFirst: ${request.url}`);
    return new Response('', { status: 503 });
  }
}

/** Network-First for navigation with offline.html fallback */
async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Try serving cached version of the page
    const cached = await caches.match(request);
    if (cached) return cached;

    // Try the root page (SPA — all routes serve index.html)
    const indexCached = await caches.match('/index.html');
    if (indexCached) return indexCached;

    // Last resort: offline page
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response(
      '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

/** Network-First: try network, fall back to cache */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200 && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Serving from cache:', request.url);
      return cached;
    }

    logError(error, `networkFirst: ${request.url}`);
    return new Response(
      JSON.stringify({ error: 'Offline and no cache available', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ──────────────────────────────────────────────
// Error handlers
// ──────────────────────────────────────────────
self.addEventListener('error', (event) => {
  logError(event.error || event, 'global_error');
});

self.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, 'unhandled_rejection');
});

// ──────────────────────────────────────────────
// Message handler for error log retrieval
// ──────────────────────────────────────────────
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

console.log('[SW] Service worker v3 loaded successfully');
