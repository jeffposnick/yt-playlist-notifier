import {test, expect} from '@playwright/test';
import {ROUTES} from '../src/constants';

test('/about page renders as expected', async ({baseURL, page}) => {
	await page.goto('/');
	await page.locator(`img[alt="${ROUTES.get('ABOUT')?.title}"]`).click();
	await expect(page).toHaveURL(`${baseURL}/about`);
	await expect(page.locator('text=View on GitHub.')).toHaveAttribute(
		'href',
		'https://github.com/jeffposnick/yt-playlist-notifier',
	);
});
