import {FunctionalComponent} from 'preact';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Router} from 'preact-router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {About} from '../components/About.js';
import {CurrentSubscriptions} from '../components/CurrentSubscriptions.js';
import {
	getSubscribedPlaylists,
	removeSubscribedPlaylist,
	setPlaylistItems,
	Value,
} from '../lib/idb.js';
import {LatestVideos} from '../components/LatestVideos.js';
import {NUMBER_OF_LATEST_VIDEOS, ROUTES} from '../constants.js';
import {PlaylistSearchForm} from '../components/PlaylistSearchForm.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

import {
	getPlaylistID,
	getPlaylistItems,
	PlaylistItemLike,
} from '../lib/youtube.js';
import {requestPermission} from '../lib/notifications.js';

function loadNewestVideosFromIDB(subscribedPlaylists: Array<Value>) {
	const allVideos: Array<PlaylistItemList.Item> = [];

	for (const playlist of subscribedPlaylists || []) {
		for (const video of playlist.videos) {
			allVideos.push(video);
		}
	}

	return allVideos
		.sort((a, b) => {
			return b.snippet.publishedAt.localeCompare(a.snippet.publishedAt);
		})
		.slice(0, NUMBER_OF_LATEST_VIDEOS);
}

export const Main: FunctionalComponent = () => {
	const queryClient = useQueryClient();

	const {data: subscribedPlaylists} = useQuery<Array<Value>>(
		['subscribedPlaylists'],
		() => getSubscribedPlaylists(),
		{initialData: []},
	);

	const {data: newestVideos} = useQuery<Array<PlaylistItemList.Item>>(
		['newestVideos', ...subscribedPlaylists],
		() => loadNewestVideosFromIDB(subscribedPlaylists),
		{
			initialData: [],
		},
	);

	const unsubscribeMutation = useMutation(async (item: PlaylistItemLike) => {
		await removeSubscribedPlaylist(getPlaylistID(item));
		await queryClient.invalidateQueries(['subscribedPlaylists']);
	});

	const subscribeMutation = useMutation(async (item: PlaylistItemLike) => {
		const playlistItems = await getPlaylistItems(getPlaylistID(item));
		await setPlaylistItems(item, playlistItems);
		await queryClient.invalidateQueries(['subscribedPlaylists']);
		await requestPermission();
	});

	const handleUnsubscribe = (item: PlaylistItemLike) => {
		void unsubscribeMutation.mutate(item);
	};

	const handleSubscribe = (item: PlaylistItemLike) => {
		void subscribeMutation.mutate(item);
	};

	return (
		<main>
			<Router>
				<LatestVideos
					newestVideos={newestVideos}
					default
					path={ROUTES.get('VIDEOS')?.path}
				/>
				<PlaylistSearchForm
					path={ROUTES.get('SEARCH')?.path}
					handleSubscribe={handleSubscribe}
					handleUnsubscribe={handleUnsubscribe}
					subscribedPlaylists={subscribedPlaylists}
				/>
				<CurrentSubscriptions
					path={ROUTES.get('SUBSCRIPTIONS')?.path}
					handleUnsubscribe={handleUnsubscribe}
					subscribedPlaylists={subscribedPlaylists}
				/>
				<About path={ROUTES.get('ABOUT')?.path} />
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</main>
	);
};
