import {test as base} from '@playwright/test';

import {API_PREFIX} from './youtube-api.js';

// A 1x1 transparent GIF.
const STUB_IMAGE = Buffer.from(
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	'base64',
);

/**
 * Every test gets context-wide routes that keep it off the network: YouTube
 * API calls that a test hasn't mocked are aborted, and thumbnails get a stub
 * image. Routes registered later (e.g. by mockYouTubeAPI) take precedence.
 */
export const test = base.extend<{blockExternalRequests: void}>({
	blockExternalRequests: [
		async ({context}, use) => {
			await context.route(`${API_PREFIX}**`, (route) => route.abort());
			await context.route('https://i.ytimg.com/**', (route) =>
				route.fulfill({contentType: 'image/gif', body: STUB_IMAGE}),
			);
			await use();
		},
		{auto: true},
	],
});

export {expect} from '@playwright/test';
