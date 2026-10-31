import {test, expect} from './fixtures/test.js';

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

	const titles = page.locator('.video-card .title');
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

	const titles = page.locator('.video-card .title');
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

	const titles = page.locator('.video-card .title');
	await expect(titles).toHaveCount(1);
	await expect(titles.first()).toHaveText('Complete video');
});

test('the empty videos state links to the search page', async ({page}) => {
	await page.goto('/');
	const link = page.getByRole('link', {name: 'Find and subscribe'});
	await expect(link).toHaveAttribute('href', '/search');
});

test('the playlist chips filter the videos to one playlist', async ({page}) => {
	const makeValue = (
		playlistId: string,
		title: string,
		dates: Array<string>,
	) => ({
		playlistItem: makePlaylistListItem({playlistId, title}),
		videos: dates.map((publishedAt, index) =>
			makePlaylistItemListItem({
				playlistId,
				videoId: `${playlistId}-${index}`,
				title: `${title} video ${index}`,
				publishedAt,
			}),
		),
	});

	await page.goto('/');
	await seedSubscriptions(page, {
		PLchipsA00000000000000000001: makeValue(
			'PLchipsA00000000000000000001',
			'Cooking',
			['2024-01-01T00:00:00Z', '2024-03-01T00:00:00Z'],
		),
		PLchipsB00000000000000000002: makeValue(
			'PLchipsB00000000000000000002',
			'Woodworking',
			['2024-02-01T00:00:00Z'],
		),
	});
	await page.reload();

	const titles = page.locator('.video-card .title');
	await expect(titles).toHaveCount(3);
	// Each video names the playlist it came from in the unfiltered view.
	await expect(page.locator('.video-card').first()).toContainText('Cooking');

	const chips = page.getByRole('group', {name: 'Filter by playlist'});
	await chips.getByRole('button', {name: 'Woodworking'}).click();
	await expect(titles).toHaveCount(1);
	await expect(titles.first()).toHaveText('Woodworking video 0');
	await expect(
		chips.getByRole('button', {name: 'Woodworking'}),
	).toHaveAttribute('aria-pressed', 'true');

	await chips.getByRole('button', {name: 'All'}).click();
	await expect(titles).toHaveCount(3);
});

test('videos added since the previous visit are marked as new', async ({
	page,
}) => {
	const value: Value = {
		playlistItem: makePlaylistListItem({
			playlistId: 'PLnewbadge00000000000000001',
		}),
		videos: [
			makePlaylistItemListItem({
				playlistId: 'PLnewbadge00000000000000001',
				videoId: 'before',
				title: 'Seen before',
				publishedAt: '2024-01-01T00:00:00Z',
			}),
			makePlaylistItemListItem({
				playlistId: 'PLnewbadge00000000000000001',
				videoId: 'after',
				title: 'Added since',
				publishedAt: '2024-06-01T00:00:00Z',
			}),
		],
	};

	await page.goto('/');
	await seedSubscriptions(page, {PLnewbadge00000000000000001: value});
	await page.evaluate(() => {
		localStorage.setItem(
			'last-visit',
			String(Date.parse('2024-03-01T00:00:00Z')),
		);
	});
	await page.reload();

	await expect(
		page.locator('.video-card', {hasText: 'Added since'}).locator('.new-badge'),
	).toBeVisible();
	await expect(
		page.locator('.video-card', {hasText: 'Seen before'}).locator('.new-badge'),
	).toHaveCount(0);
});

test('video cards link to YouTube and only lazy-load below the first row', async ({
	page,
}) => {
	const playlistId = 'PLcardlinks0000000000000001';
	const value: Value = {
		playlistItem: makePlaylistListItem({playlistId}),
		videos: Array.from({length: 6}, (_unused, index) =>
			makePlaylistItemListItem({
				playlistId,
				videoId: `card-${index}`,
				title: `Card ${index}`,
				publishedAt: new Date(2024, 0, 6 - index).toISOString(),
				videoOwnerChannelId: 'UCcardowner00000000000001',
				videoOwnerChannelTitle: 'Card Owner',
			}),
		),
	};

	await page.goto('/');
	await seedSubscriptions(page, {[playlistId]: value});
	await page.reload();

	const firstCard = page.locator('.video-card').first();
	await expect(firstCard.locator('a.title')).toHaveAttribute(
		'href',
		'https://youtu.be/card-0',
	);
	await expect(
		firstCard.getByRole('link', {name: 'Card Owner'}),
	).toHaveAttribute(
		'href',
		'https://www.youtube.com/channel/UCcardowner00000000000001',
	);

	const images = page.locator('.video-card img');
	await expect(images).toHaveCount(6);
	await expect(images.first()).toHaveAttribute('fetchpriority', 'high');
	await expect(page.locator('.video-card img[fetchpriority]')).toHaveCount(1);
	for (let index = 0; index < 6; index++) {
		if (index < 4) {
			await expect(images.nth(index)).not.toHaveAttribute('loading');
		} else {
			await expect(images.nth(index)).toHaveAttribute('loading', 'lazy');
		}
	}
});

test('a video in more than one subscription is only shown once', async ({
	page,
}) => {
	const makeValue = (playlistId: string, title: string): Value => ({
		playlistItem: makePlaylistListItem({playlistId, title}),
		videos: [
			makePlaylistItemListItem({
				playlistId,
				videoId: 'shared-video',
				title: 'Shared video',
				publishedAt:
					playlistId === 'PLdupesB00000000000000000002'
						? '2024-02-01T00:00:00Z'
						: '2024-01-01T00:00:00Z',
			}),
			makePlaylistItemListItem({
				playlistId,
				videoId: `${playlistId}-only`,
				title: `${title} only`,
				publishedAt: '2023-01-01T00:00:00Z',
			}),
		],
	});

	await page.goto('/');
	await seedSubscriptions(page, {
		PLdupesA00000000000000000001: makeValue(
			'PLdupesA00000000000000000001',
			'Playlist A',
		),
		PLdupesB00000000000000000002: makeValue(
			'PLdupesB00000000000000000002',
			'Playlist B',
		),
	});
	await page.reload();

	const titles = page.locator('.video-card .title');
	await expect(titles).toHaveCount(3);
	await expect(
		page.locator('.video-card', {hasText: 'Shared video'}),
	).toHaveCount(1);
	// The most recent appearance wins.
	await expect(
		page.locator('.video-card', {hasText: 'Shared video'}),
	).toContainText('Playlist B');
});
