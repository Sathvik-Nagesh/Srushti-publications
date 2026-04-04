const CACHE_NAME = 'srushti-v1';
const STATIC_CACHE = 'srushti-static-v1';
const API_CACHE = 'srushti-api-v1';
const IMAGE_CACHE = 'srushti-images-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/books',
  '/categories',
  '/cart',
  '/wishlist',
  '/offline',
];

// API routes to cache with network-first strategy
const CACHEABLE_API_ROUTES = [
  '/api/categories',
  '/api/books',
];

// Install event - cache static assets individually to be resilient to missing files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        // Use individual adds so one failure doesn't stop the whole installation
        return Promise.allSettled(
          STATIC_ASSETS.map(url => cache.add(url))
        );
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys
            .filter(function(key) {
              return key !== STATIC_CACHE && key !== API_CACHE && key !== IMAGE_CACHE;
            })
            .map(function(key) {
              return caches.delete(key);
            })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle image requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

// Network-first for API requests (fresh data preferred)
function handleAPIRequest(request) {
  return caches.open(API_CACHE).then(function(cache) {
    return fetch(request)
      .then(function(response) {
        // Cache successful GET requests
        if (response.ok) {
          var url = new URL(request.url);
          
          // Only cache specific API routes
          var shouldCache = CACHEABLE_API_ROUTES.some(function(route) {
            return url.pathname.startsWith(route);
          });
          
          if (shouldCache) {
            cache.put(request, response.clone());
          }
        }
        
        return response;
      })
      .catch(function() {
        // Network failed, try cache
        return cache.match(request).then(function(cached) {
          if (cached) {
            return cached;
          }
          
          // Return offline response for API
          return new Response(
            JSON.stringify({ success: false, error: 'Offline', offline: true }),
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
      });
  });
}

// Cache-first for images (they rarely change)
function handleImageRequest(request) {
  return caches.open(IMAGE_CACHE).then(function(cache) {
    return cache.match(request).then(function(cached) {
      if (cached) {
        return cached;
      }
      
      return fetch(request)
        .then(function(response) {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(function() {
          // Return empty response for failed images
          return new Response('', { status: 404 });
        });
    });
  });
}

// Network-first for navigation (pages)
function handleNavigationRequest(request) {
  return fetch(request)
    .catch(function() {
      // Try cache
      return caches.match(request).then(function(cached) {
        if (cached) {
          return cached;
        }
        
        // Return offline page
        return caches.match('/offline').then(function(offlinePage) {
          if (offlinePage) {
            return offlinePage;
          }
          
          // Fallback
          return new Response('Offline', { status: 503 });
        });
      });
    });
}

// Stale-while-revalidate for static assets
function handleStaticRequest(request) {
  return caches.open(STATIC_CACHE).then(function(cache) {
    return cache.match(request).then(function(cached) {
      // Fetch in background
      var fetchPromise = fetch(request)
        .then(function(response) {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(function() {
          return null;
        });
      
      // Return cached immediately, or wait for fetch
      return cached || fetchPromise || new Response('Not found', { status: 404 });
    });
  });
}

// Helper function to check if request is for an image
function isImageRequest(request) {
  var url = new URL(request.url);
  var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  var isImageExt = imageExtensions.some(function(ext) {
    return url.pathname.endsWith(ext);
  });
  return isImageExt || request.destination === 'image';
}

// Listen for sync events (for offline actions)
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

function syncCart() {
  // Sync cart data when back online
  return Promise.resolve();
}
