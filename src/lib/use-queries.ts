import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {NUMBER_OF_LATEST_VIDEOS} from '../constants.js';
import {requestPermission} from './notifications.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {
	getSubscribedPlaylists,
	removeSubscribedPlaylist,
	setPlaylistItems,
	Value,
} from './idb.js';
import {getPlaylistID, getPlaylistItems, PlaylistItemLike} from './youtube.js';

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

export function useQueries() {
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

	return {
		handleSubscribe,
		handleUnsubscribe,
		newestVideos,
		subscribedPlaylists,
	};
}
