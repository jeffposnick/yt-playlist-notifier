import {getSubscribedPlaylists, setPlaylistItems} from '../lib/idb.js';

import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {
	getPlaylistID,
	getPlaylistItems,
	PlaylistItemLike,
} from '../lib/youtube.js';

function filterNewVideos(
	previousItems: Array<PlaylistItemList.Item>,
	latestItems: Array<PlaylistItemList.Item>,
) {
	const oldVideoIDs = new Set<string>();
	for (const item of previousItems) {
		oldVideoIDs.add(item.snippet.resourceId.videoId);
	}

	return latestItems.filter(
		(item) => !oldVideoIDs.has(item.snippet.resourceId.videoId),
	);
}

export async function getNewVideos() {
	const newVideos: Array<{
		playlistItem: PlaylistItemLike;
		video: PlaylistItemList.Item;
	}> = [];
	// Avoid notifying more than once about a video that was added to several
	// subscribed playlists.
	const notifiedVideoIDs = new Set<string>();
	const playlists = await getSubscribedPlaylists();

	for (const {playlistItem, videos} of playlists) {
		const latestVideos = await getPlaylistItems(getPlaylistID(playlistItem));
		await setPlaylistItems(playlistItem, latestVideos);

		for (const video of filterNewVideos(videos, latestVideos)) {
			const videoID = video.snippet.resourceId.videoId;
			if (notifiedVideoIDs.has(videoID)) {
				continue;
			}
			notifiedVideoIDs.add(videoID);
			newVideos.push({playlistItem, video});
		}
	}

	return newVideos;
}
