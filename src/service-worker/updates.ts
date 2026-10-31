declare const self: ServiceWorkerGlobalScope;

import {getNewVideos} from '../lib/get-new-videos.js';
import {isChannelUploads, PlaylistItemLike} from '../lib/youtube.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {VIDEOS_UPDATED} from '../constants.js';

// 'image' is supported by Chromium, but missing from TypeScript's DOM types.
type NotificationOptionsWithImage = NotificationOptions & {image?: string};

async function showNotification(
	playlistItem: PlaylistItemLike,
	video: PlaylistItemList.Item,
) {
	const options: NotificationOptionsWithImage = {
		body: isChannelUploads(playlistItem)
			? `'${playlistItem.snippet.title}' uploaded a new video`
			: `A new video was added to '${playlistItem.snippet.title}'`,
		icon: video.snippet.thumbnails.high.url,
		image: (video.snippet.thumbnails.maxres ?? video.snippet.thumbnails.high)
			.url,
		tag: `https://youtu.be/${video.snippet.resourceId.videoId}`,
	};
	await self.registration.showNotification(video.snippet.title ?? '', options);
}

export async function checkForUpdates() {
	const newVideos = await getNewVideos();
	for (const {playlistItem, video} of newVideos) {
		await showNotification(playlistItem, video);
	}

	const clients = await self.clients.matchAll();
	for (const client of clients) {
		client.postMessage(VIDEOS_UPDATED);
	}
}
