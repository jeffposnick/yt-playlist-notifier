import * as ChannelList from '../types/ChannelList.js';
import * as PlaylistList from '../types/PlaylistList.js';
import * as PlaylistSearch from '../types/PlaylistSearch.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

export type PlaylistItemLike = PlaylistList.Item | PlaylistSearch.Item;

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';
const PLAYLIST_LIST_URL = BASE_URL + 'playlists';
const SEARCH_URL = BASE_URL + 'search';
const PLAYLIST_ITEMS_URL = BASE_URL + 'playlistItems';
const CHANNELS_URL = BASE_URL + 'channels';

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
	if (response.ok) {
		return (await response.json()) as T;
	}

	throw new Error(`${response.status} - ${await response.text()}`);
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
		type: 'playlist,channel',
	});

	const items: Array<PlaylistSearch.Item> = [];
	for (const item of results.items) {
		if (item.id.kind === 'youtube#playlist') {
			items.push(item);
		} else if (item.id.kind === 'youtube#channel') {
			// A channel result can't be subscribed to directly, but its uploads
			// playlist can, so swap in a playlist-shaped item that points there.
			const channelId = (item.id as unknown as {channelId: string}).channelId;
			items.push({
				...item,
				id: {
					kind: 'youtube#playlist',
					playlistId: uploadsPlaylistID(channelId),
				},
			});
		}
	}
	return items;
}

/**
 * Every channel has an "uploads" playlist containing all of its public
 * videos, newest first. Its ID is the channel ID with the "UC" prefix
 * swapped for "UU".
 */
export function uploadsPlaylistID(channelID: string) {
	return channelID.replace(/^UC/, 'UU');
}

export function isChannelUploads(item: PlaylistItemLike) {
	return getPlaylistID(item).startsWith('UU');
}

/**
 * Looks up a channel by ID or @handle, and returns its uploads playlist in
 * the same shape as a playlist lookup, so it can be subscribed to like any
 * other playlist.
 */
export async function channelUploads(
	lookup: {id: string} | {handle: string},
): Promise<Array<PlaylistList.Item>> {
	const results = await fetchAPI<ChannelList.Results>(CHANNELS_URL, {
		...('id' in lookup ? {id: lookup.id} : {forHandle: lookup.handle}),
		part: 'snippet,contentDetails',
	});

	return (results.items ?? []).map((channel) => ({
		kind: 'youtube#playlist',
		etag: channel.etag,
		id: channel.contentDetails.relatedPlaylists.uploads,
		snippet: {
			publishedAt: channel.snippet.publishedAt,
			channelId: channel.id,
			title: channel.snippet.title,
			description: channel.snippet.description,
			thumbnails: channel.snippet.thumbnails as PlaylistList.Thumbnails,
			channelTitle: channel.snippet.title,
			localized: {
				title: channel.snippet.title,
				description: channel.snippet.description,
			},
		},
	}));
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
