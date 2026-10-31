import {test, expect} from './fixtures/test.js';
import {
	BASE64_URL_CHARACTER_CLASS,
	HEX_CHARACTER_CLASS,
	createRegExp,
	removeHash,
} from 'remove-filename-hash';
import type {Page} from '@playwright/test';

import {UPDATE_CHECK} from '../src/constants.js';
import type {Value} from '../src/lib/idb.js';
import {seedSubscriptions} from './fixtures/idb.js';
import {
	makePlaylistItemListItem,
	makePlaylistListItem,
	mockYouTubeAPI,
} from './fixtures/youtube-api.js';

test.use({serviceWorkers: 'allow'});

async function waitForController(page: Page) {
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
		if (!navigator.serviceWorker.controller) {
			await new Promise((resolve) => {
				navigator.serviceWorker.addEventListener('controllerchange', resolve, {
					once: true,
				});
			});
		}
	});
}

test('The service worker registers and precaches', async ({baseURL, page}) => {
	await page.goto('/');

	const swURL = await page.evaluate(async () => {
		const registration = await navigator.serviceWorker.ready;
		return registration.active?.scriptURL;
	});
	expect(swURL).toBe(`${baseURL ?? ''}sw.js`);

	const cacheContents = await page.evaluate(async () => {
		const cacheState: Record<string, Array<string>> = {};
		for (const cacheName of await caches.keys()) {
			const cache = await caches.open(cacheName);
			cacheState[cacheName] = (await cache.keys()).map((req) => req.url);
		}
		return cacheState;
	});

	for (const [cacheName, urls] of Object.entries(cacheContents)) {
		cacheContents[cacheName] = urls
			.map((url) =>
				removeHash({
					stringWithHash: url,
					replacement: '[hash]',
					regexps: [
						createRegExp({
							characters: BASE64_URL_CHARACTER_CLASS,
							size: 8,
							before: '-',
							after: '.',
						}),
						createRegExp({
							characters: HEX_CHARACTER_CLASS,
							size: 32,
							before: '__WB_REVISION__=',
							after: '',
						}),
					],
				}),
			)
			.sort();
	}

	const origin = baseURL ?? '';
	expect(cacheContents).toEqual({
		[`workbox-precache-v2-${origin}`]: [
			`${origin}assets/index-[hash].css`,
			`${origin}assets/index-[hash].js`,
			`${origin}index.html?__WB_REVISION__=[hash]`,
			`${origin}manifest.webmanifest?__WB_REVISION__=[hash]`,
		],
	});
});

test('navigations are served from the precache while offline', async ({
	browserName,
	context,
	page,
}) => {
	test.skip(
		browserName === 'firefox',
		"Firefox's offline emulation fails navigations before the service worker sees them.",
	);

	await page.goto('/');
	await waitForController(page);

	await context.setOffline(true);
	await page.goto('/subscriptions');
	await expect(page.getByRole('heading', {level: 1})).toHaveText(
		'Your playlists',
	);
});

for (const [description, playlistId, expectedBody] of [
	[
		'a playlist',
		'PLupdatecheck0000000000001',
		"A new video was added to 'Followed playlist'",
	],
	[
		'a channel',
		'UUupdatecheck0000000000001',
		"'Followed playlist' uploaded a new video",
	],
]) {
	test(`the update check notifies about new videos in ${description}`, async ({
		browserName,
		context,
		page,
	}) => {
		test.skip(
			browserName !== 'chromium',
			'Only Chromium can route requests made by a service worker.',
		);

		const seenVideo = makePlaylistItemListItem({
			playlistId,
			videoId: 'seen',
			title: 'Already seen',
			publishedAt: '2024-01-01T00:00:00Z',
		});
		const newVideo = makePlaylistItemListItem({
			playlistId,
			videoId: 'brand-new',
			title: 'Brand new video',
			publishedAt: '2024-06-01T00:00:00Z',
		});
		const value: Value = {
			playlistItem: makePlaylistListItem({
				playlistId,
				title: 'Followed playlist',
			}),
			videos: [seenVideo],
		};

		const mock = await mockYouTubeAPI(context, {
			playlistItems: [seenVideo, newVideo],
		});

		await page.goto('/');
		await waitForController(page);

		// Headless Chromium closes notifications almost immediately, so
		// getNotifications() is unreliable. Record what gets shown instead,
		// before seeding, in case the on-load update check is still running.
		const [sw] = context.serviceWorkers();
		await sw.evaluate(() => {
			const scope = globalThis as unknown as {
				registration: ServiceWorkerRegistration;
				shown: Array<{body?: string; tag?: string; title: string}>;
			};
			scope.shown = [];
			scope.registration.showNotification = async (title, options) => {
				scope.shown.push({body: options?.body, tag: options?.tag, title});
			};
		});

		// Seeding without a reload leaves the page showing no videos, so the
		// only way they can appear is the service worker's update message.
		await seedSubscriptions(page, {[playlistId]: value});
		await page.evaluate((message) => {
			navigator.serviceWorker.controller?.postMessage(message);
		}, UPDATE_CHECK);

		// The service worker tells the page to re-read IndexedDB once it's done.
		await expect(page.locator('.video-card .title')).toHaveText([
			'Brand new video',
			'Already seen',
		]);
		expect(
			mock.requests.some((url) => url.includes(`playlistId=${playlistId}`)),
		).toBe(true);
		expect(
			await sw.evaluate(
				() => (globalThis as unknown as {shown: unknown}).shown,
			),
		).toEqual([
			{
				body: expectedBody,
				tag: 'https://youtu.be/brand-new',
				title: 'Brand new video',
			},
		]);
	});
}
