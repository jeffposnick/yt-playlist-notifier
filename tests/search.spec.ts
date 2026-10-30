import {test, expect} from '@playwright/test';

import {
	makeChannelListItem,
	makeChannelSearchItem,
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row .title')).toHaveText(
			'Lo-fi beats to code to',
		);
		await expect(page.locator('.result-row')).toContainText('Chill Channel');
		await expect(
			page
				.locator('.result-row')
				.getByRole('button', {name: 'Follow', exact: true}),
		).toBeVisible();

		const searchRequest = mock.requests.find((url) => url.includes('/search?'));
		expect(searchRequest).toContain('type=playlist%2Cchannel');
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row .title')).toHaveText(
			'Directly found playlist',
		);
		expect(mock.requests.some((url) => url.includes('/playlists?'))).toBe(true);
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row .title')).toHaveText(
			'Found via URL',
		);
		const playlistsRequest = mock.requests.find((url) =>
			url.includes('/playlists?'),
		);
		expect(playlistsRequest).toContain('id=PLdirectlookup00000000000001');
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row .title')).toHaveText(
			'Fallback search result',
		);
		expect(mock.requests.some((url) => url.includes('/playlists?'))).toBe(true);
		expect(mock.requests.some((url) => url.includes('/search?'))).toBe(true);
	});

	test('shows a message when no playlists match', async ({page}) => {
		await mockYouTubeAPI(page, {search: []});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('no results for this');
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(
			page.locator('text=No matching playlists or channels found.'),
		).toBeVisible();
		await expect(page.locator('.result-row')).toHaveCount(0);
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(
			page.locator('text=Sorry, an error occurred: 500 - Quota exceeded'),
		).toBeVisible({timeout: 25000});
	});

	test('turns a channel search result into its uploads playlist', async ({
		page,
	}) => {
		await mockYouTubeAPI(page, {
			search: [
				makeChannelSearchItem({
					channelId: 'UCtaskmaster000000000001',
					title: 'Taskmaster',
				}),
				makePlaylistSearchItem({
					title: 'Taskmaster - Full Episodes',
					channelTitle: 'Taskmaster',
				}),
			],
		});

		await page.goto('/search');
		await page.locator('#playlist-search').fill('Taskmaster');
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row')).toHaveCount(2);
		const channelRow = page.locator('.result-row').first();
		await expect(channelRow.locator('.title')).toHaveText('Taskmaster');
		await expect(channelRow).toContainText('All uploads');
		await expect(channelRow.locator('a.title')).toHaveAttribute(
			'href',
			'https://www.youtube.com/playlist?list=UUtaskmaster000000000001',
		);
		await expect(page.locator('.result-row').nth(1)).not.toContainText(
			'All uploads',
		);
	});

	for (const [description, searchTerm, expectedParam] of [
		[
			'a channel URL',
			'https://www.youtube.com/channel/UCchannellookup000000001',
			'id=UCchannellookup000000001',
		],
		[
			'a raw channel ID',
			'UCchannellookup000000001',
			'id=UCchannellookup000000001',
		],
		[
			'a channel handle URL',
			'https://www.youtube.com/@lookedup/videos',
			'forHandle=%40lookedup',
		],
		['a bare @handle', '@lookedup', 'forHandle=%40lookedup'],
		[
			'a URL without a scheme',
			'youtube.com/@lookedup',
			'forHandle=%40lookedup',
		],
	]) {
		test(`searching for ${description} looks up the channel's uploads`, async ({
			page,
		}) => {
			const mock = await mockYouTubeAPI(page, {
				channels: [makeChannelListItem({title: 'Looked-up Channel'})],
			});

			await page.goto('/search');
			await page.locator('#playlist-search').fill(searchTerm);
			await page.getByRole('button', {name: 'Search', exact: true}).click();

			const row = page.locator('.result-row');
			await expect(row.locator('.title')).toHaveText('Looked-up Channel');
			await expect(row).toContainText('All uploads');
			await expect(row.locator('a.title')).toHaveAttribute(
				'href',
				'https://www.youtube.com/playlist?list=UUchannellookup000000001',
			);

			const channelsRequest = mock.requests.find((url) =>
				url.includes('/channels?'),
			);
			expect(channelsRequest).toContain(expectedParam);
			expect(channelsRequest).toContain('part=snippet%2CcontentDetails');
			expect(mock.requests.some((url) => url.includes('/search?'))).toBe(false);
		});
	}

	test('the clear button empties the search field', async ({page}) => {
		await page.goto('/search');
		await page.locator('#playlist-search').fill('something');
		await page.getByRole('button', {name: 'Clear search'}).click();
		await expect(page.locator('#playlist-search')).toHaveValue('');
		await expect(page.getByRole('button', {name: 'Clear search'})).toHaveCount(
			0,
		);
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
		await page.getByRole('button', {name: 'Search', exact: true}).click();

		await expect(page.locator('.result-row .title')).toHaveText(
			'Rock & Roll Classics',
		);
		await expect(page.locator('.result-row')).toContainText('AT&T Music');
	});
});
