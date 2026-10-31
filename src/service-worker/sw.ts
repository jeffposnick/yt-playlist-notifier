declare const self: ServiceWorkerGlobalScope;

interface PeriodicBackgroundSyncEvent extends ExtendableEvent {
	tag: string;
}

import {ExpirationPlugin} from 'workbox-expiration';
import {createHandlerBoundToURL, precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

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

// On Android, a plain https: URL opened from a notification stays in the
// browser (or the installed PWA's Custom Tab) instead of handing off to the
// YouTube app. An intent: URL targets the app directly, and falls back to the
// original URL when the app isn't installed.
function getVideoURL(url: string) {
	if (!/Android/i.test(self.navigator.userAgent)) {
		return url;
	}

	const videoId = new URL(url).pathname.slice(1);
	return (
		`intent://www.youtube.com/watch?v=${videoId}#Intent;scheme=https;` +
		'package=com.google.android.youtube;' +
		`S.browser_fallback_url=${encodeURIComponent(url)};end`
	);
}

self.addEventListener('notificationclick', (event) => {
	event.waitUntil(self.clients.openWindow(getVideoURL(event.notification.tag)));
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
