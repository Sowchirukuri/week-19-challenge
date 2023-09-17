const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Precache and route all assets defined in self.__WB_MANIFEST
precacheAndRoute(self.__WB_MANIFEST);

// Create a cache for HTML pages with CacheFirst strategy
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
    }),
  ],
});

// Warm the strategy cache for specific URLs
registerRoute(
  ({ request }) => request.mode === 'navigate',
  ({ event }) => {
    return pageCache
      .handle({ event })
      .then((response) => {
        if (!response) {
          return caches.match('/offline.html'); // Replace with your offline page URL
        }
        return response;
      })
      .catch(() => {
        return caches.match('/offline.html'); // Replace with your offline page URL
      });
  }
);

// Implement asset caching - replace with your specific assets
registerRoute(
  // Define a pattern that matches your assets
  ({ request }) => /\/assets\//.test(request.url),
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache for 7 days
      }),
    ],
  })
);

