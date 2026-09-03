import {test, expect} from '@playwright/test';

import {
	makePlaylistListItem,
	makePlaylistSearchItem,
	mockYouTubeAPI,
} from './fixtures/youtube-api.js';

// The service worker isn't relevant to these tests, and WebKit's route
// interception doesn't reliably intercept fetches from an SW-controlled
// page, so mocked API calls would otherwise leak through to the real API.
test.use({serviceWorkers: 'block'});

test.describe('playlist search', () => {
	test('searching by keyword hits the search endpoint and renders a result', async ({
		page,
	}) => {
		const mock = await mockYouTubeAPI(page, {
			search: [
				makePlaylistSearchItem({
					title: 'Lo-fi beats to code to',
					channelTitle: 'Chill Channel',
				}),
			],
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('lo-fi beats');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('.card .title')).toHaveText(
			'Lo-fi beats to code to',
		);
		await expect(page.locator('.card')).toContainText('Chill Channel');
		await expect(page.locator('.card button')).toHaveText('🔔');

		expect(mock.requests.some((url) => url.includes('/search?'))).toBe(true);
		expect(mock.requests.some((url) => url.includes('/playlists?'))).toBe(
			false,
		);
	});

	test('searching for a raw playlist ID looks up the playlist directly', async ({
		page,
	}) => {
		const mock = await mockYouTubeAPI(page, {
			playlistList: [
				makePlaylistListItem({
					playlistId: 'PLdirectlookup00000000000001',
					title: 'Directly found playlist',
				}),
			],
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('PLdirectlookup00000000000001');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('.card .title')).toHaveText(
			'Directly found playlist',
		);
		expect(mock.requests.some((url) => url.includes('/playlists?'))).toBe(
			true,
		);
		expect(mock.requests.some((url) => url.includes('/search?'))).toBe(false);
	});

	test('searching for a playlist URL looks up the playlist directly', async ({
		page,
	}) => {
		const mock = await mockYouTubeAPI(page, {
			playlistList: [
				makePlaylistListItem({
					playlistId: 'PLdirectlookup00000000000001',
					title: 'Found via URL',
				}),
			],
		});

		await page.goto('/search');
		await page
			.locator('#playlist-search')
			.fill(
				'https://www.youtube.com/playlist?list=PLdirectlookup00000000000001',
			);
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('.card .title')).toHaveText('Found via URL');
		const playlistsRequest = mock.requests.find((url) =>
			url.includes('/playlists?'),
		);
		expect(playlistsRequest).toContain(
			'id=PLdirectlookup00000000000001',
		);
	});

	test('falls back to keyword search when a direct ID lookup finds nothing', async ({
		page,
	}) => {
		const mock = await mockYouTubeAPI(page, {
			playlistList: [],
			search: [makePlaylistSearchItem({title: 'Fallback search result'})],
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('PLdoesnotexist000000000001');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('.card .title')).toHaveText(
			'Fallback search result',
		);
		expect(mock.requests.some((url) => url.includes('/playlists?'))).toBe(
			true,
		);
		expect(mock.requests.some((url) => url.includes('/search?'))).toBe(true);
	});

	test('shows a message when no playlists match', async ({page}) => {
		await mockYouTubeAPI(page, {search: []});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('no results for this');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('text=No matching playlists found.')).toBeVisible();
		await expect(page.locator('.card')).toHaveCount(0);
	});

	test('shows an error message when the API call fails', async ({page}) => {
		// react-query retries failed queries 3x with backoff (~7s) before
		// surfacing the error, so this needs more room than the suite's
		// default 5s test / 1s expect budget.
		test.setTimeout(30000);

		await mockYouTubeAPI(page, {
			search: {status: 500, body: 'Quota exceeded'},
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('anything');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(
			page.locator('text=Sorry, an error occurred: 500 - Quota exceeded'),
		).toBeVisible({timeout: 25000});
	});

	test('decodes HTML entities in playlist titles and channel names', async ({
		page,
	}) => {
		await mockYouTubeAPI(page, {
			search: [
				makePlaylistSearchItem({
					title: 'Rock &amp; Roll Classics',
					channelTitle: 'AT&amp;T Music',
				}),
			],
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('rock');
		await page.getByRole('button', {name: 'Search'}).click();

		await expect(page.locator('.card .title')).toHaveText(
			'Rock & Roll Classics',
		);
		await expect(page.locator('.card')).toContainText('AT&T Music');
	});
});
