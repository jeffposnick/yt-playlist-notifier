import {test, expect} from './fixtures/test.js';

test('the web app manifest is linked and its icons resolve', async ({
	page,
	request,
}) => {
	await page.goto('/');
	const manifestURL = await page
		.locator('link[rel="manifest"]')
		.evaluate((link: HTMLLinkElement) => link.href);

	const response = await request.get(manifestURL);
	expect(response.ok()).toBe(true);
	const manifest = (await response.json()) as {
		name: string;
		icons: Array<{src: string; sizes: string; purpose?: string}>;
	};
	expect(manifest.name).toBe('YT Playlist Notifier');
	expect(manifest.icons.map(({sizes, purpose}) => [sizes, purpose])).toEqual([
		['192x192', undefined],
		['512x512', undefined],
		['512x512', 'maskable'],
	]);

	for (const icon of manifest.icons) {
		const iconResponse = await request.get(new URL(icon.src, manifestURL).href);
		expect(iconResponse.ok(), icon.src).toBe(true);
		expect(iconResponse.headers()['content-type']).toBe('image/png');
	}
});
