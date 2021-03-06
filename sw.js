// #sw 5/26/2021 11:18am

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = ['/pwa-auto-otp-demo', '/pwa-auto-otp-demo/styles.css', '/pwa-auto-otp-demo/scripts.js'];

self.addEventListener('install', event => {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache);
		}),
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			// Cache hit - return response
			if (response) {
				return response;
			}

			return fetch(event.request).then(response => {
				// Check if we received a valid response
				if (!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}

				// IMPORTANT: Clone the response. A response is a stream
				// and because we want the browser to consume the response
				// as well as the cache consuming the response, we need
				// to clone it so we have two streams.
				var responseToCache = response.clone();

				caches.open(CACHE_NAME).then(cache => {
                    console.log(event);
					cache.put(event.request, responseToCache);
				});

				return response;
			});
		}),
	);
});

self.addEventListener('activate', event => {
	console.info('SW updated');
});
