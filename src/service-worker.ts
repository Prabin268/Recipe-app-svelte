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

  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event.request));
    return;
  }

  if (url.hostname.includes('themealdb.com')) {
    event.respondWith(networkFirst(event.request, API_CACHE, { fallback: { meals: [] } }));
    return;
  }

  if (event.request.destination === 'image') {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE));
    return;
  }

  event.respondWith(networkFirst(event.request, CACHE));
});

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