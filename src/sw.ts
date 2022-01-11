/// <reference lib="ESNext" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

import {precacheAndRoute} from 'workbox-precaching';

const filteredManifest = (self.__WB_MANIFEST || []).filter((entry) => {
  if (typeof entry === 'string' || entry.url !== 'registerSW.js') {
    return entry;
  }
});
precacheAndRoute(filteredManifest);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
