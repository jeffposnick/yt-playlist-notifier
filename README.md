### YT Playlist Notifier

Have you ever to subscribe to updates to a specific playlist within a YouTube channel, instead of all the new videos in a channel? Unfortunately, YouTube doesn't support playlist subscriptions.

But, YouTube has an [API](https://developers.google.com/youtube/v3)...

[YT Playlist Notifier](https://yt-playlist-notifier.web.app/) is a [progressive web app](https://web.dev/progressive-web-apps/) that allows you to search for and subscribe to updates to playlists. You'll get a browser notification when new videos are added to any playlist you're subscribed to.

YT Playlist Notifier stores your playlist subscriptions locally, and you're not required to authenticate or log in anywhere.

### When will I see updates?

At its most basic, you'll see notifications for any new videos whenever you close and then revisit the web app. If your web browser doesn't support notifications, you'll at least see a list of the latest videos across all your subscribed playlists.

If you're using a browser that supports [periodic background sync](https://web.dev/periodic-background-sync/) and have [installed](https://support.google.com/chrome/answer/9658361) YT Playlist Notifier, the periodic sync event checking for new videos will fire automatically, about once a day. You don't have to do anything—just sit back and wait for video notifications!

### Technologies used

- [Preact](https://preactjs.com/) (thanks for the debugging help, [Jason](https://twitter.com/_developit)!)
- [Vite](https://vitejs.dev/)
- [Workbox](https://workboxjs.org/), via the [`vite-plugin-pwa plugin`](https://github.com/antfu/vite-plugin-pwa).
- [Open Props](https://open-props.style/) (thanks for the styling help, [Adam](https://twitter.com/argyleink)!)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [`idb-keyval`](https://github.com/jakearchibald/idb-keyval) for persisting local state.
- [Icon Kitchen](https://icon.kitchen/) and [Material Design Icons](https://materialdesignicons.com/) for the icons.
- [quicktype](https://app.quicktype.io/) for generating TypeScript types out of the YouTube Data API responses.

### Local development

To run a copy of this project, first [register for YouTube Data API access](https://developers.google.com/youtube/v3/getting-started), and obtain a browser API key.

Create an [`.env.local` file](https://vitejs.dev/guide/env-and-mode.html#env-files) at the root of this project, and include the following:

```sh
VITE_YT_API_KEY=[your API key here]
```
