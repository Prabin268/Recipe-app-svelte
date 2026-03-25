// /// <reference lib="webworker" />
// /// <reference types="@sveltejs/kit" />

// import { build, files, version } from '$service-worker';

// const CACHE = `cache-${version}`;
// const ASSETS = [...build, ...files];

// const API_CACHE = 'api-cache';
// const IMAGE_CACHE = 'image-cache';
// const PAGES_CACHE = 'pages-cache';
// const EXTERNAL_CACHE = 'external-cache';

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     (async () => {
//       const cache = await caches.open(API_CACHE);

//       try {
//         const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
//         if (response.ok) {
//           await cache.put('https://www.themealdb.com/api/json/v1/1/list.php?a=list', response.clone());
//         }
//       } catch (err) {
//         console.warn('API pre-cache failed', err);
//       }

//       const appCache = await caches.open(CACHE);
//       for (const url of [...ASSETS, '/']) {
//         try {
//           await appCache.add(url);
//         } catch {}
//       }
//     })()
//   );
// });

// self.addEventListener('activate', (event) => {
// 	event.waitUntil(
// 		caches.keys().then((keys) =>
// 			Promise.all(
// 				keys.map((key) => (key !== CACHE ? caches.delete(key) : undefined))
// 			)
// 		)
// 	);
// });

// self.addEventListener('fetch', (event) => {
// 	if (event.request.method !== 'GET') return;

// 	const request = event.request;
// 	const url = new URL(request.url);

// 	if (request.mode === 'navigate') {
// 		event.respondWith(handleNavigation(request));
// 		return;
// 	}

// 	if (url.hostname.includes('themealdb.com')) {
// 		event.respondWith(networkFirst(request, API_CACHE, { fallback: { meals: [] } }));
// 		return;
// 	}

// 	if (url.hostname.includes('hamrostack.com')) {
// 		event.respondWith(cacheFirst(request, EXTERNAL_CACHE));
// 		return;
// 	}

// 	if (request.destination === 'image') {
// 		event.respondWith(cacheFirst(request, IMAGE_CACHE));
// 		return;
// 	}

// 	if (url.origin !== self.location.origin) {
// 		event.respondWith(
// 			(async () => {
// 				try {
// 					return await fetch(request);
// 				} catch {
// 					return new Response(
// 						JSON.stringify({ message: 'Offline' }),
// 						{ status: 200, headers: { 'Content-Type': 'application/json' } }
// 					);
// 				}
// 			})()
// 		);
// 		return;
// 	}

// 	event.respondWith(networkFirst(request, CACHE, { fallback: null }));
// });

// async function networkFirst(request: Request, cacheName: string, options: { fallback?: any }) {
// 	const cache = await caches.open(cacheName);
// 	const key = request.url;

// 	try {
// 		const response = await fetch(request);
// 		if (response && response.status === 200) {
// 			cache.put(key, response.clone());
// 		}
// 		return response;
// 	} catch {
// 		const cached = await cache.match(key);
// 		if (cached) return cached;

// 		if (options.fallback !== undefined) {
// 			return new Response(JSON.stringify(options.fallback), {
// 				status: 200,
// 				headers: { 'Content-Type': 'application/json' }
// 			});
// 		}

// 		return new Response('Offline', { status: 503 });
// 	}
// }

// async function cacheFirst(request: Request, cacheName: string) {
// 	const cache = await caches.open(cacheName);
// 	const key = request.url;

// 	const cached = await cache.match(key);
// 	if (cached) return cached;

// 	try {
// 		const response = await fetch(request);
// 		if (response && response.status === 200) {
// 			cache.put(key, response.clone());
// 		}
// 		return response;
// 	} catch {
// 		return new Response('Offline', { status: 503 });
// 	}
// }

// async function handleNavigation(request: Request) {
// 	const cache = await caches.open(PAGES_CACHE);

// 	try {
// 		const response = await fetch(request);
// 		const url = new URL(request.url);
// 		cache.put(url.pathname, response.clone());
// 		return response;
// 	} catch {
// 		const url = new URL(request.url);
// 		const cached = await cache.match(url.pathname);
// 		if (cached) return cached;

// 		const shellCache = await caches.open(CACHE);
// 		const shell = await shellCache.match('/');
// 		return shell || Response.error();
// 	}
// }

/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const CACHE = `app-cache-${version}`;
const API_CACHE = 'api-cache';
const IMAGE_CACHE = 'image-cache';
const PAGES_CACHE = 'pages-cache';
const ASSETS = [...build, ...files, '/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE && caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Navigation (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event.request));
    return;
  }

  // API requests (example: themealdb)
  if (url.hostname.includes('themealdb.com')) {
    event.respondWith(networkFirst(event.request, API_CACHE, { fallback: { meals: [] } }));
    return;
  }

  // Images
  if (event.request.destination === 'image') {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE));
    return;
  }

  // Everything else → network first with cache fallback
  event.respondWith(networkFirst(event.request, CACHE));
});

// Network first: try network, fallback to cache, fallback to offline
async function networkFirst(request: Request, cacheName: string, options: { fallback?: any } = {}) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request.url, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request.url);
    if (cached) return cached;

    if (options.fallback !== undefined) {
      return new Response(JSON.stringify(options.fallback), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

// Cache first: use cache if available, then network
async function cacheFirst(request: Request, cacheName: string) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request.url);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request.url, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Handle navigation requests
async function handleNavigation(request: Request) {
  const cache = await caches.open(PAGES_CACHE);

  try {
    const response = await fetch(request);
    cache.put(new URL(request.url).pathname, response.clone());
    return response;
  } catch {
    const cached = await cache.match(new URL(request.url).pathname);
    if (cached) return cached;

    const shell = await caches.match('/');
    return shell || new Response('Offline', { status: 503 });
  }
}