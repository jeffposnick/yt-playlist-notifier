import {test, expect} from '@playwright/test';

test('/about page renders as expected', async ({baseURL, page}) => {
	await page.goto('/');
	await page
		.getByRole('navigation', {name: 'Primary'})
		.getByRole('link', {name: 'About'})
		.click();
	await expect(page).toHaveURL(`${baseURL ?? ''}about`);
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Follow a playlist, not a whole channel.',
	);
	await expect(
		page.getByRole('link', {name: 'Source code & credits on GitHub'}),
	).toHaveAttribute(
		'href',
		'https://github.com/jeffposnick/yt-playlist-notifier',
	);
	await expect(page.getByText('Stored only on this device')).toBeVisible();
});
