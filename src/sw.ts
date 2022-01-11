/// <reference lib="ESNext" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

interface PeriodicBackgroundSyncEvent extends ExtendableEvent {
  tag: string;
}

import {precacheAndRoute} from 'workbox-precaching';

import {getNewVideos} from './lib/update-check';
import {PlaylistSearch, PlaylistItemList} from './lib/youtube';

const filteredManifest = (self.__WB_MANIFEST || []).filter((entry) => {
  if (typeof entry === 'string' || entry.url !== 'registerSW.js') {
    return entry;
  }
});
precacheAndRoute(filteredManifest);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(self.clients.openWindow(event.notification.tag));
  event.notification.close();
});

async function showNotification(
  playlistItem: PlaylistSearch.Item,
  video: PlaylistItemList.Item,
) {
  console.log('notifying:', playlistItem, video);
  self.registration.showNotification(video.snippet.title, {
    body: `A new video was added to '${playlistItem.snippet.title}'`,
    icon: video.snippet.thumbnails.high.url,
    tag: `https://youtu.be/${video.snippet.resourceId.videoId}`,
  });
}

async function updateCheck() {
  console.log('update check...');
  const newVideos = await getNewVideos();
  for (const {playlistItem, video} of newVideos) {
    showNotification(playlistItem, video);
  }
}

// @ts-expect-error
self.addEventListener('periodicsync', (event: PeriodicBackgroundSyncEvent) => {
  if (event.tag === 'update-check') {
    event.waitUntil(updateCheck());
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'update-check') {
    event.waitUntil(updateCheck());
  }
});
