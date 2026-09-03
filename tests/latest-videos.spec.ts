import {test, expect} from '@playwright/test';

import {NUMBER_OF_LATEST_VIDEOS} from '../src/constants.js';
import type {Value} from '../src/lib/idb.js';
import {seedSubscriptions} from './fixtures/idb.js';
import {
	makePlaylistItemListItem,
	makePlaylistListItem,
} from './fixtures/youtube-api.js';

test('shows the newest videos first and caps the list at the display limit', async ({
	page,
}) => {
	const totalVideos = NUMBER_OF_LATEST_VIDEOS + 5;
	const videos = Array.from({length: totalVideos}, (_unused, index) =>
		makePlaylistItemListItem({
			playlistId: 'PLmanyvideos00000000000001',
			videoId: `video-${index}`,
			title: `Episode ${index}`,
			publishedAt: new Date(2024, 0, index + 1).toISOString(),
		}),
	);
	const value: Value = {
		playlistItem: makePlaylistListItem({
			playlistId: 'PLmanyvideos00000000000001',
			title: 'Big playlist',
		}),
		videos,
	};

	await page.goto('/');
	await seedSubscriptions(page, {PLmanyvideos00000000000001: value});
	await page.reload();

	const titles = page.locator('.card .title');
	await expect(titles).toHaveCount(NUMBER_OF_LATEST_VIDEOS);
	// Newest (highest index/date) is first, oldest shown is last.
	await expect(titles.first()).toHaveText(`Episode ${totalVideos - 1}`);
	await expect(titles.last()).toHaveText(
		`Episode ${totalVideos - NUMBER_OF_LATEST_VIDEOS}`,
	);
});

test('merges videos from multiple subscriptions into one date-sorted list', async ({
	page,
}) => {
	const playlistA: Value = {
		playlistItem: makePlaylistListItem({
			playlistId: 'PLplaylistA0000000000000001',
			title: 'Playlist A',
		}),
		videos: [
			makePlaylistItemListItem({
				playlistId: 'PLplaylistA0000000000000001',
				videoId: 'a-old',
				title: 'A: old video',
				publishedAt: '2024-01-01T00:00:00Z',
			}),
			makePlaylistItemListItem({
				playlistId: 'PLplaylistA0000000000000001',
				videoId: 'a-new',
				title: 'A: new video',
				publishedAt: '2024-03-01T00:00:00Z',
			}),
		],
	};
	const playlistB: Value = {
		playlistItem: makePlaylistListItem({
			playlistId: 'PLplaylistB0000000000000002',
			title: 'Playlist B',
		}),
		videos: [
			makePlaylistItemListItem({
				playlistId: 'PLplaylistB0000000000000002',
				videoId: 'b-middle',
				title: 'B: middle video',
				publishedAt: '2024-02-01T00:00:00Z',
			}),
		],
	};

	await page.goto('/');
	await seedSubscriptions(page, {
		PLplaylistA0000000000000001: playlistA,
		PLplaylistB0000000000000002: playlistB,
	});
	await page.reload();

	const titles = page.locator('.card .title');
	await expect(titles).toHaveCount(3);
	await expect(titles.nth(0)).toHaveText('A: new video');
	await expect(titles.nth(1)).toHaveText('B: middle video');
	await expect(titles.nth(2)).toHaveText('A: old video');
});

test('skips videos that are missing fields required for rendering', async ({
	page,
}) => {
	const completeVideo = makePlaylistItemListItem({
		playlistId: 'PLincomplete0000000000000001',
		videoId: 'complete',
		title: 'Complete video',
		publishedAt: '2024-01-02T00:00:00Z',
	});
	const incompleteVideo = makePlaylistItemListItem({
		playlistId: 'PLincomplete0000000000000001',
		videoId: 'incomplete',
		title: 'Incomplete video',
		publishedAt: '2024-01-01T00:00:00Z',
	});
	incompleteVideo.snippet.videoOwnerChannelTitle = undefined;

	const value: Value = {
		playlistItem: makePlaylistListItem({
			playlistId: 'PLincomplete0000000000000001',
		}),
		videos: [completeVideo, incompleteVideo],
	};

	await page.goto('/');
	await seedSubscriptions(page, {PLincomplete0000000000000001: value});
	await page.reload();

	const titles = page.locator('.card .title');
	await expect(titles).toHaveCount(1);
	await expect(titles.first()).toHaveText('Complete video');
});

test('the empty videos state links to the search page', async ({page}) => {
	await page.goto('/');
	const link = page.getByRole('link', {name: 'Find and subscribe'});
	await expect(link).toHaveAttribute('href', '/search');
});
