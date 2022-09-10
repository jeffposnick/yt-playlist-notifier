import {FunctionalComponent, JSX} from 'preact';
import {useRef} from 'preact/hooks';
import {Signal, useSignal} from '@preact/signals';

import {
	getPlaylistID,
	getPlaylistItems,
	playlistList,
	playlistSearch,
	PlaylistItemLike,
} from '../lib/youtube.js';
import {
	getSubscribedPlaylists,
	removeSubscribedPlaylist,
	setPlaylistItems,
	Value,
} from '../lib/idb.js';
import {PlaylistItem} from './PlaylistItem.js';
import {requestPermission} from '../lib/notifications.js';

const performPlaylistSearch = async (searchTerm?: string) => {
	if (!searchTerm) {
		return [];
	}

	try {
		const url = new URL(searchTerm);
		const listParam = url.searchParams.get('list');
		if (listParam) {
			const results = await playlistList(listParam);
			if (results.length > 0) {
				return results;
			}
		}
	} catch (error: unknown) {
		// no-op
	}

	if (searchTerm.startsWith('PL')) {
		const results = await playlistList(searchTerm);
		if (results.length > 0) {
			return results;
		}
	}

	return await playlistSearch(searchTerm);
};

export const PlaylistSearchForm: FunctionalComponent<{
	subscribedPlaylists: Signal<Array<Value>>;
}> = ({subscribedPlaylists}) => {
	const search = useRef<HTMLInputElement>(null);
	const searchResults = useSignal<
		undefined | Awaited<ReturnType<typeof performPlaylistSearch>>
	>(undefined);

	const isSubscribed = (item: PlaylistItemLike) =>
		subscribedPlaylists.value.some(
			(subscribedItem) =>
				getPlaylistID(subscribedItem.playlistItem) === getPlaylistID(item),
		) || false;

	const handleSubmit = async (
		event: JSX.TargetedEvent<HTMLFormElement, Event>,
	) => {
		event.preventDefault();
		searchResults.value = await performPlaylistSearch(search.current?.value);
	};

	const handleUnsubscribeClick = async (item: PlaylistItemLike) => {
		await removeSubscribedPlaylist(getPlaylistID(item));
		subscribedPlaylists.value = await getSubscribedPlaylists();
	};

	const handleSubscribeClick = async (item: PlaylistItemLike) => {
		const playlistItems = await getPlaylistItems(getPlaylistID(item));
		await setPlaylistItems(item, playlistItems);
		await requestPermission();
		subscribedPlaylists.value = await getSubscribedPlaylists();
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label for="playlist-search">
					<h4>Subscribe to playlists:</h4>
				</label>
				<div class="form-controls">
					<input type="search" id="playlist-search" ref={search} />
					<button type="submit">Search</button>
				</div>
			</form>
			<p>Tip: You can also search for a "PL..." ID, or playlist page URL!</p>
			<div class="card-container">
				{searchResults.value?.length === 0 ? (
					<p>No matching playlists found.</p>
				) : (
					(searchResults.value || []).map((item) => {
						return isSubscribed(item) ? (
							<PlaylistItem
								buttonText="🚫"
								item={item}
								clickCallback={handleUnsubscribeClick}
							/>
						) : (
							<PlaylistItem
								buttonText="🔔"
								item={item}
								clickCallback={handleSubscribeClick}
							/>
						);
					})
				)}
			</div>
		</>
	);
};
