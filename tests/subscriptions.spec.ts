import {test, expect} from './fixtures/test.js';

import {
	makeChannelListItem,
	makePlaylistItemListItem,
	makePlaylistSearchItem,
	mockYouTubeAPI,
} from './fixtures/youtube-api.js';

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
	await page.getByRole('button', {name: 'Search', exact: true}).click();

	const searchCard = page.locator('.result-row', {
		hasText: 'Weekly recap show',
	});
	await expect(searchCard).toBeVisible();
	await searchCard.getByRole('button', {name: 'Follow', exact: true}).click();

	// The button in-place should flip to "Following" once the mutation
	// resolves, without needing to reload.
	await expect(
		searchCard.getByRole('button', {name: 'Following'}),
	).toBeVisible();

	// The subscription shows up on the Subscriptions page.
	await page.goto('/subscriptions');
	const subscriptionCard = page.locator('.subscription-card', {
		hasText: 'Weekly recap show',
	});
	await expect(subscriptionCard).toBeVisible();
	await expect(subscriptionCard).toContainText('Recap Channel');
	await expect(subscriptionCard).toContainText('Latest video');

	// Its videos show up on the latest-videos page, newest first.
	await page.goto('/');
	const videoTitles = page.locator('.video-card .title');
	await expect(videoTitles).toHaveCount(2);
	await expect(videoTitles.nth(0)).toHaveText('Newer episode');
	await expect(videoTitles.nth(1)).toHaveText('Older episode');

	// Unsubscribing removes it from the Subscriptions page...
	await page.goto('/subscriptions');
	await subscriptionCard.getByRole('button', {name: 'Unfollow'}).click();
	await expect(page.locator('.subscription-card')).toHaveCount(0);
	await expect(
		page.getByRole('link', {name: 'Find and subscribe'}),
	).toBeVisible();

	// ...and its videos disappear from the latest-videos page too.
	await page.goto('/');
	await expect(page.locator('.video-card')).toHaveCount(0);
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
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Find playlists',
	);
});

test('following a channel subscribes to its uploads playlist', async ({
	page,
}) => {
	const mock = await mockYouTubeAPI(page, {
		channels: [
			makeChannelListItem({
				channelId: 'UCchannellookup000000001',
				title: 'Looked-up Channel',
			}),
		],
		playlistItems: (playlistId) => [
			makePlaylistItemListItem({
				playlistId,
				videoId: 'upload-1',
				title: 'Fresh upload',
				publishedAt: '2024-06-01T00:00:00Z',
			}),
		],
	});

	await page.goto('/search');
	await page.locator('#playlist-search').fill('@lookedup');
	await page.getByRole('button', {name: 'Search', exact: true}).click();
	await page.getByRole('button', {name: 'Follow', exact: true}).click();
	await expect(page.getByRole('button', {name: 'Following'})).toBeVisible();

	expect(
		mock.requests.some(
			(url) =>
				url.includes('/playlistItems?') &&
				url.includes('playlistId=UUchannellookup000000001'),
		),
	).toBe(true);

	await page.goto('/subscriptions');
	const card = page.locator('.subscription-card');
	await expect(card.locator('.title')).toHaveText('Looked-up Channel');
	await expect(card).toContainText('All uploads');

	await page.goto('/');
	await expect(page.locator('.video-card .title')).toHaveText('Fresh upload');
});

test('the notification status reflects a granted permission', async ({
	browserName,
	context,
	page,
}) => {
	test.skip(
		browserName === 'webkit',
		"WebKit's Notification.permission stays 'default' after granting it.",
	);

	await context.grantPermissions(['notifications']);
	await page.goto('/subscriptions');
	await expect(page.getByText('Notifications are on')).toBeVisible();
	await expect(page.getByRole('button', {name: 'Turn on'})).toHaveCount(0);
});
