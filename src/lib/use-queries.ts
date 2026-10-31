import {useEffect} from 'preact/hooks';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {NUMBER_OF_LATEST_VIDEOS, VIDEOS_UPDATED} from '../constants.js';
import {requestPermission} from './notifications.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {
	getSubscribedPlaylists,
	removeSubscribedPlaylist,
	setPlaylistItems,
	Value,
} from './idb.js';
import {getPlaylistID, getPlaylistItems, PlaylistItemLike} from './youtube.js';

export function getNewestVideos(subscribedPlaylists: Array<Value>) {
	const allVideos: Array<PlaylistItemList.Item> = [];

	for (const playlist of subscribedPlaylists) {
		for (const video of playlist.videos) {
			allVideos.push(video);
		}
	}

	allVideos.sort((a, b) => {
		return b.snippet.publishedAt.localeCompare(a.snippet.publishedAt);
	});

	// The same video can be in more than one subscribed playlist (or appear
	// more than once in a single playlist). Only show it once, using its most
	// recent appearance.
	const seenVideoIDs = new Set<string>();
	const uniqueVideos = allVideos.filter((video) => {
		const videoID = video.snippet.resourceId.videoId;
		if (seenVideoIDs.has(videoID)) {
			return false;
		}
		seenVideoIDs.add(videoID);
		return true;
	});

	return uniqueVideos.slice(0, NUMBER_OF_LATEST_VIDEOS);
}

export function useQueries() {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		const handleMessage = (event: MessageEvent) => {
			if (event.data === VIDEOS_UPDATED) {
				void queryClient.invalidateQueries({queryKey: ['subscribedPlaylists']});
			}
		};

		navigator.serviceWorker.addEventListener('message', handleMessage);
		return () => {
			navigator.serviceWorker.removeEventListener('message', handleMessage);
		};
	}, [queryClient]);

	const {data: subscribedPlaylists} = useQuery<Array<Value>>({
		queryKey: ['subscribedPlaylists'],
		queryFn: () => getSubscribedPlaylists(),
		initialData: [],
	});

	const unsubscribeMutation = useMutation({
		mutationFn: async (item: PlaylistItemLike) => {
			await removeSubscribedPlaylist(getPlaylistID(item));
			await queryClient.invalidateQueries({queryKey: ['subscribedPlaylists']});
		},
	});

	const subscribeMutation = useMutation({
		mutationFn: async (item: PlaylistItemLike) => {
			const playlistItems = await getPlaylistItems(getPlaylistID(item));
			await setPlaylistItems(item, playlistItems);
			await queryClient.invalidateQueries({queryKey: ['subscribedPlaylists']});
			await requestPermission();
		},
	});

	const handleUnsubscribe = (item: PlaylistItemLike) => {
		void unsubscribeMutation.mutate(item);
	};

	const handleSubscribe = (item: PlaylistItemLike) => {
		void subscribeMutation.mutate(item);
	};

	const isSubscribing = (item: PlaylistItemLike) =>
		subscribeMutation.isPending &&
		subscribeMutation.variables !== undefined &&
		getPlaylistID(subscribeMutation.variables) === getPlaylistID(item);

	return {
		handleSubscribe,
		handleUnsubscribe,
		isSubscribing,
		subscribedPlaylists,
	};
}
