/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

interface PeriodicBackgroundSyncEvent extends ExtendableEvent {
  tag: string;
}

import {precacheAndRoute} from 'workbox-precaching';

import {UPDATE_CHECK} from '../constants';
import {checkForUpdates} from './updates';

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(self.clients.openWindow(event.notification.tag));
  event.notification.close();
});

// @ts-expect-error
self.addEventListener('periodicsync', (event: PeriodicBackgroundSyncEvent) => {
  if (event.tag === UPDATE_CHECK) {
    event.waitUntil(checkForUpdates());
  }
});

self.addEventListener('message', (event) => {
  if (event.data === UPDATE_CHECK) {
    event.waitUntil(checkForUpdates());
  }
});
