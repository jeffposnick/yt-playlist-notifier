### YT Playlist Notifier

Have you ever wanted to subscribe to updates to a specific playlist within a YouTube channel, instead of all the new videos in a channel? Unfortunately, YouTube doesn't support playlist subscriptions.

But, YouTube has an [API](https://developers.google.com/youtube/v3)...

[YT Playlist Notifier](https://yt-playlist-notifier.web.app/) is a [progressive web app](https://web.dev/progressive-web-apps/) that allows you to search for and subscribe to updates to playlists. You'll get a browser notification when new videos are added to any playlist you're subscribed to.

You can also follow everything a channel uploads: search for the channel by name, or paste its URL, its `UC...` channel ID, or its `@handle`. Behind the scenes, this subscribes to the channel's "uploads" playlist.

YT Playlist Notifier stores your playlist subscriptions locally, and you're not required to authenticate or log in anywhere.

### When will I see updates?

At its most basic, you'll see notifications for any new videos whenever you close and then revisit the web app. If your web browser doesn't support notifications, you'll at least see a list of the latest videos across all your subscribed playlists.

If you're using a browser that supports [periodic background sync](https://web.dev/periodic-background-sync/) and have [installed](https://support.google.com/chrome/answer/9658361) YT Playlist Notifier, the periodic sync event checking for new videos will fire automatically, about once a day. You don't have to do anything—just sit back and wait for video notifications!

### Technologies used

- [Preact](https://preactjs.com/) (thanks for the debugging help, [Jason](https://twitter.com/_developit)!)
- [Vite](https://vitejs.dev/)
- [Workbox](https://github.com/vite-pwa/workbox) (the Vite PWA fork), via the [`@unplugin-pwa/vite`](https://github.com/vite-pwa/unplugin-pwa/tree/main/packages/vite) plugin.
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [`idb-keyval`](https://github.com/jakearchibald/idb-keyval) for persisting local state.
- [Icon Kitchen](https://icon.kitchen/) for the app icons.
- [quicktype](https://app.quicktype.io/) for generating TypeScript types out of the YouTube Data API responses.

### Local development

To run a copy of this project, first [register for YouTube Data API access](https://developers.google.com/youtube/v3/getting-started), and obtain a browser API key.

Create an [`.env.local` file](https://vitejs.dev/guide/env-and-mode.html#env-files) at the root of this project, and include the following:

```sh
VITE_YT_API_KEY=[your API key here]
```

### Running tests

The end-to-end tests use [Playwright](https://playwright.dev/). Install the browsers once with `npx playwright install`, then run:

```sh
npm test
```

If your environment already has a Chromium build that doesn't match the one this version of Playwright expects (for example, a cloud dev container with a pre-installed browser), point the Chromium project at it instead and run only that project:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium npx playwright test --project=chromium
```
