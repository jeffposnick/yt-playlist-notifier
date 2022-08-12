import {test, expect} from '@playwright/test';

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

	const expectedPrecacheName = `workbox-precache-v2-${baseURL}`;
	expect(Object.keys(cacheContents)).toEqual([expectedPrecacheName]);
	expect(cacheContents[expectedPrecacheName]).toHaveLength(8);
});
