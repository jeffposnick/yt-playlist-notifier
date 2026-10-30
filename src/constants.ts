interface RouteInfo {
	label: string;
	path: string;
	title: string;
}

export const ROUTES = new Map<string, RouteInfo>([
	[
		'VIDEOS',
		{
			label: 'Videos',
			path: '/',
			title: 'Latest videos from subscribed playlists.',
		},
	],
	[
		'SEARCH',
		{
			label: 'Find',
			path: '/search',
			title: 'Find playlists and channels to subscribe to.',
		},
	],
	[
		'SUBSCRIPTIONS',
		{
			label: 'Playlists',
			path: '/subscriptions',
			title: 'List of current playlist subscriptions.',
		},
	],
	[
		'ABOUT',
		{
			label: 'About',
			path: '/about',
			title: 'About this project.',
		},
	],
]);

export const NUMBER_OF_LATEST_VIDEOS = 20;

export const UPDATE_CHECK = 'update-check';

export const VIDEOS_UPDATED = 'videos-updated';
