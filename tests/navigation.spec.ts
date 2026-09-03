import {test, expect} from '@playwright/test';

import {ROUTES} from '../src/constants.js';

test.describe('primary navigation', () => {
	for (const [key, route] of ROUTES) {
		test(`footer icon navigates to the ${key} route`, async ({
			baseURL,
			page,
		}) => {
			await page.goto('/');
			await page.locator(`img[alt="${route.title}"]`).click();

			const expectedURL =
				route.path === '/'
					? (baseURL ?? '')
					: `${baseURL ?? ''}${route.path.slice(1)}`;
			await expect(page).toHaveURL(expectedURL);
		});
	}

	test('the icon for the current route is marked active', async ({page}) => {
		await page.goto(ROUTES.get('SEARCH')?.path ?? '/search');

		const searchTitle = ROUTES.get('SEARCH')?.title ?? '';
		const videosTitle = ROUTES.get('VIDEOS')?.title ?? '';

		await expect(
			page.locator(`a:has(img[alt="${searchTitle}"])`),
		).toHaveClass(/active/);
		await expect(
			page.locator(`a:has(img[alt="${videosTitle}"])`),
		).not.toHaveClass(/active/);
	});

	test('deep-linking directly to a route renders that view', async ({
		page,
	}) => {
		await page.goto('/subscriptions');
		await expect(page.locator('h4')).toHaveText("You're getting updates to:");

		await page.goto('/search');
		await expect(page.locator('h4')).toHaveText('Subscribe to playlists:');
	});

	test('an unknown path falls back to the default (videos) route', async ({
		page,
	}) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page.locator('h4')).toHaveText('Videos from subscriptions:');
	});
});
