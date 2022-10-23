import {FunctionalComponent, JSX} from 'preact';
import {useQuery} from '@tanstack/react-query';
import {useRef, useState} from 'preact/hooks';

import {PlaylistItem} from './PlaylistItem.js';
import {useQueries} from '../lib/use-queries.js';
import {
	getPlaylistID,
	playlistList,
	playlistSearch,
	PlaylistItemLike,
} from '../lib/youtube.js';

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

export const PlaylistSearchForm: FunctionalComponent = () => {
	const {handleSubscribe, handleUnsubscribe, subscribedPlaylists} =
		useQueries();
	const [searchTerm, setSearchTerm] = useState<string>();
	const search = useRef<HTMLInputElement>(null);

	const result = useQuery<Awaited<ReturnType<typeof performPlaylistSearch>>>(
		['searchResults', searchTerm],
		() => performPlaylistSearch(searchTerm),
		{
			enabled: Boolean(searchTerm),
		},
	);
	const searchResults = result.data;

	const isSubscribed = (item: PlaylistItemLike) =>
		subscribedPlaylists.some(
			(subscribedItem) =>
				getPlaylistID(subscribedItem.playlistItem) === getPlaylistID(item),
		) || false;

	const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
		event.preventDefault();
		setSearchTerm(search.current?.value);
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
				{result.isFetching && <p>Searching...</p>}
				{result.isError && (
					<p>Sorry, an error occurred: {(result.error as Error).message}</p>
				)}
				{searchResults?.length === 0 ? (
					<p>No matching playlists found.</p>
				) : (
					searchResults?.map((item) => {
						return isSubscribed(item) ? (
							<PlaylistItem
								buttonText="🚫"
								item={item}
								clickCallback={handleUnsubscribe}
							/>
						) : (
							<PlaylistItem
								buttonText="🔔"
								item={item}
								clickCallback={handleSubscribe}
							/>
						);
					})
				)}
			</div>
		</>
	);
};
