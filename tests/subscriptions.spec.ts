import {test, expect} from '@playwright/test';

import {
	makePlaylistItemListItem,
	makePlaylistSearchItem,
	mockYouTubeAPI,
} from './fixtures/youtube-api.js';

// The service worker isn't relevant to these tests, and WebKit's route
// interception doesn't reliably intercept fetches from an SW-controlled
// page, so mocked API calls would otherwise leak through to the real API.
test.use({serviceWorkers: 'block'});

test('subscribing and unsubscribing to a playlist updates every view', async ({
	page,
}) => {
	await mockYouTubeAPI(page, {
		search: [
			makePlaylistSearchItem({
				playlistId: 'PLsubscribeme000000000000001',
				title: 'Weekly recap show',
				channelTitle: 'Recap Channel',
			}),
		],
		playlistItems: [
			makePlaylistItemListItem({
				playlistId: 'PLsubscribeme000000000000001',
				videoId: 'video-old',
				title: 'Older episode',
				publishedAt: '2024-01-01T00:00:00Z',
			}),
			makePlaylistItemListItem({
				playlistId: 'PLsubscribeme000000000000001',
				videoId: 'video-new',
				title: 'Newer episode',
				publishedAt: '2024-06-01T00:00:00Z',
			}),
		],
	});

	// Start from search results and subscribe.
	await page.goto('/search');
	await page.locator('#playlist-search').fill('weekly recap');
	await page.getByRole('button', {name: 'Search'}).click();

	const searchCard = page.locator('.card', {hasText: 'Weekly recap show'});
	await expect(searchCard).toBeVisible();
	await searchCard.getByRole('button', {name: '🔔'}).click();

	// The button in-place should flip to the unsubscribe icon once the
	// mutation resolves, without needing to reload.
	await expect(searchCard.getByRole('button', {name: '🚫'})).toBeVisible();

	// The subscription shows up on the Subscriptions page.
	await page.goto('/subscriptions');
	const subscriptionCard = page.locator('.card', {
		hasText: 'Weekly recap show',
	});
	await expect(subscriptionCard).toBeVisible();
	await expect(subscriptionCard).toContainText('Recap Channel');

	// Its videos show up on the latest-videos page, newest first.
	await page.goto('/');
	const videoTitles = page.locator('.card .title');
	await expect(videoTitles).toHaveCount(2);
	await expect(videoTitles.nth(0)).toHaveText('Newer episode');
	await expect(videoTitles.nth(1)).toHaveText('Older episode');

	// Unsubscribing removes it from the Subscriptions page...
	await page.goto('/subscriptions');
	await page
		.locator('.card', {hasText: 'Weekly recap show'})
		.getByRole('button', {name: '🚫'})
		.click();
	await expect(page.locator('.card')).toHaveCount(0);
	await expect(
		page.getByRole('link', {name: 'Find and subscribe'}),
	).toBeVisible();

	// ...and its videos disappear from the latest-videos page too.
	await page.goto('/');
	await expect(page.locator('.card')).toHaveCount(0);
	await expect(
		page.getByRole('link', {name: 'Find and subscribe'}),
	).toBeVisible();
});

test('the empty subscriptions state links to the search page', async ({
	page,
}) => {
	await page.goto('/subscriptions');
	const link = page.getByRole('link', {name: 'Find and subscribe'});
	await expect(link).toHaveAttribute('href', '/search');
	await link.click();
	await expect(page.locator('h4')).toHaveText('Subscribe to playlists:');
});
