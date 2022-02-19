interface RouteInfo {
  iconUrl: string;
  path: string;
  title: string;
}

export const ROUTES = new Map<string, RouteInfo>([
  [
    'VIDEOS',
    {
      iconUrl: 'youtube.svg',
      path: '/',
      title: 'Latest videos from subscribed playlists.',
    },
  ],
  [
    'SEARCH',
    {
      iconUrl: 'movie-search.svg',
      path: '/search',
      title: 'Find playlists to subscribe to.',
    },
  ],
  [
    'SUBSCRIPTIONS',
    {
      iconUrl: 'youtube-subscription.svg',
      path: '/subscriptions',
      title: 'List of current playlist subscriptions.',
    },
  ],
  [
    'ABOUT',
    {
      iconUrl: 'information.svg',
      path: '/about',
      title: 'About this project.',
    },
  ],
]);

export const NUMBER_OF_LATEST_VIDEOS = 20;

export const UPDATE_CHECK = 'update-check';
