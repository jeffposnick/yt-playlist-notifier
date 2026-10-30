import type {Page, Route} from '@playwright/test';

import * as ChannelList from '../../src/types/ChannelList.js';
import * as PlaylistList from '../../src/types/PlaylistList.js';
import * as PlaylistSearch from '../../src/types/PlaylistSearch.js';
import * as PlaylistItemList from '../../src/types/PlaylistItemList.js';

const API_PREFIX = 'https://youtube.googleapis.com/youtube/v3/';

function thumbnailSet(seed: string) {
	const image = (suffix: string, width: number, height: number) => ({
		url: `https://i.ytimg.com/vi/${seed}/${suffix}.jpg`,
		width,
		height,
	});

	return {
		default: image('default', 120, 90),
		medium: image('mqdefault', 320, 180),
		high: image('hqdefault', 480, 360),
		standard: image('sddefault', 640, 480),
		maxres: image('maxresdefault', 1280, 720),
	};
}

export function makePlaylistSearchItem(
	overrides: {
		playlistId?: string;
		title?: string;
		channelId?: string;
		channelTitle?: string;
	} = {},
): PlaylistSearch.Item {
	const playlistId = overrides.playlistId ?? 'PLsearchresult00000000000001';
	return {
		kind: 'youtube#searchResult',
		etag: 'etag-search',
		id: {
			kind: 'youtube#playlist',
			playlistId,
		},
		snippet: {
			publishedAt: new Date('2024-01-01T00:00:00Z'),
			channelId: overrides.channelId ?? 'UCchannel00000000000000001',
			title: overrides.title ?? 'Search result playlist',
			description: 'A playlist found via search.',
			thumbnails: thumbnailSet(playlistId),
			channelTitle: overrides.channelTitle ?? 'Search Result Channel',
			liveBroadcastContent: 'none',
			publishTime: new Date('2024-01-01T00:00:00Z'),
		},
	};
}

/**
 * A channel result from the search endpoint. It has no `playlistId`, so the
 * app swaps it for the channel's uploads playlist before reaching the UI.
 */
export function makeChannelSearchItem(
	overrides: {
		channelId?: string;
		title?: string;
	} = {},
): PlaylistSearch.Item {
	const channelId = overrides.channelId ?? 'UCchannel00000000000000004';
	return {
		kind: 'youtube#searchResult',
		etag: 'etag-search-channel',
		id: {
			kind: 'youtube#channel',
			channelId,
		} as unknown as PlaylistSearch.ID,
		snippet: {
			publishedAt: new Date('2024-01-01T00:00:00Z'),
			channelId,
			title: overrides.title ?? 'Search Result Channel',
			description: "Well done! You've found the channel.",
			thumbnails: thumbnailSet(channelId),
			channelTitle: overrides.title ?? 'Search Result Channel',
			liveBroadcastContent: 'none',
			publishTime: new Date('2024-01-01T00:00:00Z'),
		},
	};
}

export function makeChannelListItem(
	overrides: {
		channelId?: string;
		title?: string;
	} = {},
): ChannelList.Item {
	const channelId = overrides.channelId ?? 'UCchannellookup000000001';
	return {
		kind: 'youtube#channel',
		etag: 'etag-channel',
		id: channelId,
		snippet: {
			title: overrides.title ?? 'Looked-up Channel',
			description: 'A channel found by ID, URL or handle.',
			publishedAt: new Date('2024-01-01T00:00:00Z'),
			thumbnails: thumbnailSet(channelId),
		},
		contentDetails: {
			relatedPlaylists: {
				likes: '',
				uploads: channelId.replace(/^UC/, 'UU'),
			},
		},
	};
}

export function makePlaylistListItem(
	overrides: {
		playlistId?: string;
		title?: string;
		channelId?: string;
		channelTitle?: string;
	} = {},
): PlaylistList.Item {
	const playlistId = overrides.playlistId ?? 'PLdirectlookup00000000000001';
	return {
		kind: 'youtube#playlist',
		etag: 'etag-playlist',
		id: playlistId,
		snippet: {
			publishedAt: new Date('2024-01-01T00:00:00Z'),
			channelId: overrides.channelId ?? 'UCchannel00000000000000002',
			title: overrides.title ?? 'Directly looked-up playlist',
			description: 'A playlist found by ID or URL.',
			thumbnails: thumbnailSet(playlistId),
			channelTitle: overrides.channelTitle ?? 'Direct Lookup Channel',
			localized: {
				title: overrides.title ?? 'Directly looked-up playlist',
				description: 'A playlist found by ID or URL.',
			},
		},
	};
}

export function makePlaylistItemListItem(
	overrides: {
		playlistId?: string;
		videoId?: string;
		title?: string;
		publishedAt?: string;
		videoOwnerChannelId?: string;
		videoOwnerChannelTitle?: string;
	} = {},
): PlaylistItemList.Item {
	const videoId = overrides.videoId ?? 'videoId0001';
	return {
		kind: 'youtube#playlistItem',
		etag: 'etag-playlist-item',
		id: `playlistItem-${videoId}`,
		snippet: {
			publishedAt: overrides.publishedAt ?? '2024-01-01T00:00:00Z',
			channelId: overrides.videoOwnerChannelId ?? 'UCchannel00000000000000003',
			title: overrides.title ?? 'A great video',
			description: 'A video description.',
			thumbnails: thumbnailSet(videoId),
			channelTitle: overrides.videoOwnerChannelTitle ?? 'Video Channel',
			playlistId: overrides.playlistId ?? 'PLdirectlookup00000000000001',
			position: 0,
			resourceId: {
				kind: 'youtube#video',
				videoId,
			},
			videoOwnerChannelTitle:
				overrides.videoOwnerChannelTitle ?? 'Video Channel',
			videoOwnerChannelId:
				overrides.videoOwnerChannelId ?? 'UCchannel00000000000000003',
		},
	};
}

export interface YouTubeMock {
	/** Every intercepted request URL, in order. */
	requests: Array<string>;
}

export interface YouTubeMockOptions {
	search?: Array<PlaylistSearch.Item> | {status: number; body: string};
	playlistList?: Array<PlaylistList.Item> | {status: number; body: string};
	channels?: Array<ChannelList.Item>;
	playlistItems?:
		| Array<PlaylistItemList.Item>
		| ((playlistId: string) => Array<PlaylistItemList.Item>);
}

async function fulfillResults(route: Route, items: Array<unknown>) {
	await route.fulfill({
		contentType: 'application/json',
		body: JSON.stringify({
			kind: 'youtube#results',
			etag: 'etag',
			nextPageToken: '',
			regionCode: 'US',
			pageInfo: {
				totalResults: items.length,
				resultsPerPage: items.length,
			},
			items,
		}),
	});
}

/**
 * Intercepts all calls to the YouTube Data API and responds with canned
 * data, so tests don't depend on network access or a real API key. Must be
 * awaited before triggering navigation/actions that issue the request.
 */
export async function mockYouTubeAPI(
	page: Page,
	options: YouTubeMockOptions,
): Promise<YouTubeMock> {
	const mock: YouTubeMock = {requests: []};

	await page.route(`${API_PREFIX}**`, async (route) => {
		const url = new URL(route.request().url());
		mock.requests.push(url.href);

		if (url.pathname.endsWith('/search')) {
			if (!options.search) {
				await route.fulfill({status: 404, body: 'Not mocked'});
			} else if (Array.isArray(options.search)) {
				await fulfillResults(route, options.search);
			} else {
				await route.fulfill(options.search);
			}
			return;
		}

		if (url.pathname.endsWith('/playlists')) {
			if (!options.playlistList) {
				await route.fulfill({status: 404, body: 'Not mocked'});
			} else if (Array.isArray(options.playlistList)) {
				await fulfillResults(route, options.playlistList);
			} else {
				await route.fulfill(options.playlistList);
			}
			return;
		}

		if (url.pathname.endsWith('/channels')) {
			if (!options.channels) {
				await route.fulfill({status: 404, body: 'Not mocked'});
			} else {
				await fulfillResults(route, options.channels);
			}
			return;
		}

		if (url.pathname.endsWith('/playlistItems')) {
			const playlistId = url.searchParams.get('playlistId') ?? '';
			if (!options.playlistItems) {
				await route.fulfill({status: 404, body: 'Not mocked'});
			} else if (typeof options.playlistItems === 'function') {
				await fulfillResults(route, options.playlistItems(playlistId));
			} else {
				await fulfillResults(route, options.playlistItems);
			}
			return;
		}

		await route.fulfill({status: 404, body: 'Not mocked'});
	});

	return mock;
}
