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
	console.debug('getNewVideos() called');
	const newVideos: Array<{
		playlistItem: PlaylistItemLike;
		video: PlaylistItemList.Item;
	}> = [];
	const playlists = await getSubscribedPlaylists();
	console.debug({playlists: JSON.stringify(playlists)});
	for (const {playlistItem, videos} of playlists) {
		const latestVideos = await getPlaylistItems(getPlaylistID(playlistItem));
		console.debug({latestVideos: JSON.stringify(latestVideos)});
		await setPlaylistItems(playlistItem, latestVideos);

		for (const video of filterNewVideos(videos, latestVideos)) {
			newVideos.push({playlistItem, video});
		}
	}
	console.debug({newVideos: JSON.stringify(newVideos)});
	return newVideos;
}
