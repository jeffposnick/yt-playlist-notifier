interface RouteInfo {
	label: string;
	path: string;
}

export const ROUTES = new Map<string, RouteInfo>([
	[
		'VIDEOS',
		{
			label: 'Videos',
			path: '/',
		},
	],
	[
		'SEARCH',
		{
			label: 'Find',
			path: '/search',
		},
	],
	[
		'SUBSCRIPTIONS',
		{
			label: 'Playlists',
			path: '/subscriptions',
		},
	],
	[
		'ABOUT',
		{
			label: 'About',
			path: '/about',
		},
	],
]);

export const NUMBER_OF_LATEST_VIDEOS = 20;

export const UPDATE_CHECK = 'update-check';

export const VIDEOS_UPDATED = 'videos-updated';
