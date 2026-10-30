declare const self: ServiceWorkerGlobalScope;

interface PeriodicBackgroundSyncEvent extends ExtendableEvent {
	tag: string;
}

import {ExpirationPlugin} from '@vite-pwa/workbox-swkit/expiration';
import {
	createHandlerBoundToURL,
	precacheAndRoute,
} from '@vite-pwa/workbox-swkit/precaching';
import {registerRoute} from '@vite-pwa/workbox-swkit/routing';
import {StaleWhileRevalidate} from '@vite-pwa/workbox-swkit/strategies';

import {UPDATE_CHECK} from '../constants.js';
import {checkForUpdates} from './updates.js';

precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
	({request}) => request.mode === 'navigate',
	createHandlerBoundToURL('/index.html'),
);

registerRoute(
	({url}) => url.origin === 'https://i.ytimg.com',
	new StaleWhileRevalidate({
		cacheName: 'yt-thumbnails',
		plugins: [new ExpirationPlugin({maxEntries: 50})],
	}),
);

self.addEventListener('install', () => void self.skipWaiting());
self.addEventListener('activate', () => void self.clients.claim());

self.addEventListener('notificationclick', (event) => {
	event.waitUntil(self.clients.openWindow(event.notification.tag));
	event.notification.close();
});

// @ts-expect-error periodicsync is not included in the default SW interface.
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
