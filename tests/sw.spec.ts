import {test, expect} from '@playwright/test';
import {ContentHashHelper} from '../lib/content-hash-helper';

test('The service worker registers and precaches', async ({baseURL, page}) => {
	await page.goto('/');

	const swURL = await page.evaluate(async () => {
		const registration = await navigator.serviceWorker.ready;
		return registration.active?.scriptURL;
	});
	expect(swURL).toBe(`${baseURL}sw.js`);

	const cacheContents = await page.evaluate(async () => {
		const cacheState: Record<string, Array<string>> = {};
		for (const cacheName of await caches.keys()) {
			const cache = await caches.open(cacheName);
			cacheState[cacheName] = (await cache.keys()).map((req) => req.url);
		}
		return cacheState;
	});

	const helper = new ContentHashHelper();
	for (const [cacheName, urls] of Object.entries(cacheContents)) {
		cacheContents[cacheName] = urls.map((url) => helper.removeHash(url)).sort();
	}

	expect(cacheContents).toEqual({
		'workbox-precache-v2-http://localhost:3000/': [
			'http://localhost:3000/assets/index.[hash].css',
			'http://localhost:3000/assets/index.[hash].js',
			'http://localhost:3000/index.html?__WB_REVISION__=[hash]',
			'http://localhost:3000/information.svg?__WB_REVISION__=[hash]',
			'http://localhost:3000/manifest.webmanifest?__WB_REVISION__=[hash]',
			'http://localhost:3000/movie-search.svg?__WB_REVISION__=[hash]',
			'http://localhost:3000/youtube-subscription.svg?__WB_REVISION__=[hash]',
			'http://localhost:3000/youtube.svg?__WB_REVISION__=[hash]',
		],
	});
});
