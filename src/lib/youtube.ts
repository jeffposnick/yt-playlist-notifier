import * as PlaylistList from '../types/PlaylistList.js';
import * as PlaylistSearch from '../types/PlaylistSearch.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

export type PlaylistItemLike = PlaylistList.Item | PlaylistSearch.Item;

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';
const PLAYLIST_LIST_URL = BASE_URL + 'playlists';
const SEARCH_URL = BASE_URL + 'search';
const PLAYLIST_ITEMS_URL = BASE_URL + 'playlistItems';

async function fetchAPI<T>(
	url: string,
	params: Record<string, string>,
): Promise<T> {
	const urlObj = new URL(url);
	urlObj.searchParams.set('key', import.meta.env.VITE_YT_API_KEY);
	urlObj.searchParams.set('maxResults', '50');
	urlObj.searchParams.set('part', 'snippet');
	for (const [key, value] of Object.entries(params)) {
		urlObj.searchParams.set(key, value);
	}

	const response = await fetch(urlObj.href);
	const json = (await response.json()) as T;

	if (response.ok) {
		return json;
	}
	throw new Error(JSON.stringify(json, null, 2));
}

export async function playlistList(playlistID: string) {
	const results = await fetchAPI<PlaylistList.Results>(PLAYLIST_LIST_URL, {
		id: playlistID,
	});
	return results.items;
}

export async function playlistSearch(searchTerm: string) {
	const results = await fetchAPI<PlaylistSearch.Results>(SEARCH_URL, {
		q: searchTerm,
		type: 'playlist',
	});
	return results.items;
}

export async function getPlaylistItems(playlistID: string) {
	const results = await fetchAPI<PlaylistItemList.Results>(PLAYLIST_ITEMS_URL, {
		playlistId: playlistID,
	});
	return results.items;
}

export function getPlaylistID(item: PlaylistItemLike) {
	return typeof item.id === 'string' ? item.id : item.id.playlistId;
}
