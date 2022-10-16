declare const self: ServiceWorkerGlobalScope;

import {getNewVideos} from '../lib/get-new-videos.js';
import {PlaylistItemLike} from '../lib/youtube.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

async function showNotification(
	playlistItem: PlaylistItemLike,
	video: PlaylistItemList.Item,
) {
	await self.registration.showNotification(video.snippet.title ?? '', {
		body: `A new video was added to '${playlistItem.snippet.title}'`,
		icon: video.snippet.thumbnails.high.url,
		tag: `https://youtu.be/${video.snippet.resourceId.videoId}`,
	});
}

export async function checkForUpdates() {
	const newVideos = await getNewVideos();
	for (const {playlistItem, video} of newVideos) {
		await showNotification(playlistItem, video);
	}
}
