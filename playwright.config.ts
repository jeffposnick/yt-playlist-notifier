import {type PlaywrightTestConfig, devices} from '@playwright/test';

const URL = 'http://localhost:3000/';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: './tests',
	/*
	 * Maximum time one test can run for, including fixture setup (e.g.
	 * browser/page launch). CI runs single-worker, so by the time WebKit's
	 * first test launches, dozens of Chromium/Firefox tests have already run
	 * and the runner is under more CPU/memory pressure than a local machine,
	 * so give it more headroom there.
	 */
	timeout: (process.env.CI ? 20 : 5) * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 1000,
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: process.env.CI ? '50%' : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['dot'], ['html', {open: 'never'}], ['github']],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
		baseURL: URL,
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},

		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
			},
		},

		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'],
			},
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: {
		//     ...devices['Pixel 5'],
		//   },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: {
		//     ...devices['iPhone 12'],
		//   },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: {
		//     channel: 'msedge',
		//   },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: {
		//     channel: 'chrome',
		//   },
		// },
	],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	outputDir: 'test-results/',

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run stage',
		reuseExistingServer: !process.env.CI,
		url: URL,
	},
};

export default config;
