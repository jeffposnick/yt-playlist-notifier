import {test, expect} from './fixtures/test.js';

import {ROUTES} from '../src/constants.js';

test.describe('primary navigation', () => {
	for (const [key, route] of ROUTES) {
		test(`tab navigates to the ${key} route`, async ({baseURL, page}) => {
			await page.goto('/');
			await page
				.getByRole('navigation', {name: 'Primary'})
				.getByRole('link', {name: route.label})
				.click();

			const expectedURL =
				route.path === '/'
					? (baseURL ?? '')
					: `${baseURL ?? ''}${route.path.slice(1)}`;
			await expect(page).toHaveURL(expectedURL);
		});
	}

	test('the tab for the current route is marked as the current page', async ({
		page,
	}) => {
		await page.goto(ROUTES.get('SEARCH')?.path ?? '/search');

		const nav = page.getByRole('navigation', {name: 'Primary'});
		await expect(
			nav.getByRole('link', {name: ROUTES.get('SEARCH')?.label}),
		).toHaveAttribute('aria-current', 'page');
		await expect(
			nav.getByRole('link', {name: ROUTES.get('VIDEOS')?.label}),
		).not.toHaveAttribute('aria-current', 'page');
	});

	test('deep-linking directly to a route renders that view', async ({page}) => {
		const heading = page.getByRole('heading', {level: 1});

		await page.goto('/subscriptions');
		await expect(heading).toHaveText('Your playlists');

		await page.goto('/search');
		await expect(heading).toHaveText('Find playlists');
	});

	test('an unknown path falls back to the default (videos) route', async ({
		page,
	}) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page.getByRole('heading', {level: 1})).toHaveText(
			'Playlist Notifier',
		);
		await expect(
			page
				.getByRole('navigation', {name: 'Primary'})
				.getByRole('link', {name: ROUTES.get('VIDEOS')?.label}),
		).toHaveAttribute('aria-current', 'page');
	});
});
