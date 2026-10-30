import {FunctionalComponent, JSX} from 'preact';
import {useQuery} from '@tanstack/react-query';
import {useRef, useState} from 'preact/hooks';

import {useQueries} from '../lib/use-queries.js';
import {
	channelUploads,
	getPlaylistID,
	playlistList,
	playlistSearch,
	PlaylistItemLike,
} from '../lib/youtube.js';
import {CheckIcon, CloseIcon, SearchIcon} from './Icons.js';
import {PlaylistDetails, PlaylistThumbnail} from './PlaylistItem.js';

const CHANNEL_ID_REGEXP = /^UC[\w-]{22}$/;
const HANDLE_REGEXP = /^@[\w.-]+$/;

// Lets "youtube.com/..." be pasted without a scheme.
function parseURL(searchTerm: string) {
	try {
		return new URL(searchTerm);
	} catch {
		try {
			return new URL(`https://${searchTerm}`);
		} catch {
			return undefined;
		}
	}
}

async function lookUpURL(url: URL) {
	if (!/(^|\.)youtube\.com$/.test(url.hostname)) {
		return [];
	}

	const listParam = url.searchParams.get('list');
	if (listParam) {
		return await playlistList(listParam);
	}

	const [firstSegment, secondSegment] = url.pathname.split('/').slice(1);
	if (firstSegment === 'channel' && secondSegment) {
		return await channelUploads({id: secondSegment});
	}
	if (firstSegment?.startsWith('@')) {
		return await channelUploads({handle: firstSegment});
	}

	return [];
}

const performPlaylistSearch = async (searchTerm?: string) => {
	if (!searchTerm) {
		return [];
	}

	const url = searchTerm.includes('youtube.com')
		? parseURL(searchTerm)
		: undefined;
	if (url) {
		const results = await lookUpURL(url);
		if (results.length > 0) {
			return results;
		}
	}

	if (searchTerm.startsWith('PL')) {
		const results = await playlistList(searchTerm);
		if (results.length > 0) {
			return results;
		}
	}

	if (CHANNEL_ID_REGEXP.test(searchTerm)) {
		const results = await channelUploads({id: searchTerm});
		if (results.length > 0) {
			return results;
		}
	}

	if (HANDLE_REGEXP.test(searchTerm)) {
		const results = await channelUploads({handle: searchTerm});
		if (results.length > 0) {
			return results;
		}
	}

	return await playlistSearch(searchTerm);
};

export const PlaylistSearchForm: FunctionalComponent = () => {
	const {
		handleSubscribe,
		handleUnsubscribe,
		isSubscribing,
		subscribedPlaylists,
	} = useQueries();
	const [searchTerm, setSearchTerm] = useState<string>();
	const [inputValue, setInputValue] = useState('');
	const search = useRef<HTMLInputElement>(null);

	const result = useQuery<Awaited<ReturnType<typeof performPlaylistSearch>>>({
		queryKey: ['searchResults', searchTerm],
		queryFn: () => performPlaylistSearch(searchTerm),
		enabled: Boolean(searchTerm),
	});
	const searchResults = result.data;

	const isSubscribed = (item: PlaylistItemLike) =>
		subscribedPlaylists.some(
			(subscribedItem) =>
				getPlaylistID(subscribedItem.playlistItem) === getPlaylistID(item),
		) || false;

	const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
		event.preventDefault();
		setSearchTerm(search.current?.value.trim());
	};

	const handleClear = () => {
		setInputValue('');
		search.current?.focus();
	};

	return (
		<>
			<header class="page-header">
				<h1>Find playlists</h1>
				<form class="search-form" onSubmit={handleSubmit}>
					<label class="visually-hidden" for="playlist-search">
						Search playlists and channels
					</label>
					<div class="search-field">
						<button aria-label="Search" class="icon-button" type="submit">
							<SearchIcon size={20} />
						</button>
						<input
							aria-describedby="playlist-search-hint"
							autocomplete="off"
							id="playlist-search"
							onInput={(event) => setInputValue(event.currentTarget.value)}
							ref={search}
							type="search"
							value={inputValue}
						/>
						{inputValue && (
							<button
								aria-label="Clear search"
								class="icon-button"
								onClick={handleClear}
								type="button"
							>
								<CloseIcon size={18} />
							</button>
						)}
					</div>
					<p class="hint" id="playlist-search-hint">
						Search by name, or paste a playlist or channel URL, a PL… ID, or an
						@handle.
					</p>
				</form>
			</header>
			<div class="page-body">
				{result.isFetching && <p class="status-text">Searching…</p>}
				{result.isError && (
					<p class="status-text">
						Sorry, an error occurred: {result.error.message}
					</p>
				)}
				{!result.isFetching && searchResults?.length === 0 && (
					<p class="status-text">No matching playlists or channels found.</p>
				)}
				{searchResults && searchResults.length > 0 && (
					<>
						<p class="section-label">
							{searchResults.length}{' '}
							{searchResults.length === 1 ? 'result' : 'results'}
						</p>
						<ul class="result-list">
							{searchResults.map((item) => (
								<li class="card result-row" key={getPlaylistID(item)}>
									<PlaylistThumbnail item={item} />
									<PlaylistDetails item={item} />
									{isSubscribed(item) ? (
										<button
											class="pill-button secondary"
											onClick={() => handleUnsubscribe(item)}
											title="Unfollow"
											type="button"
										>
											<CheckIcon size={16} />
											Following
										</button>
									) : (
										<button
											class="pill-button primary"
											disabled={isSubscribing(item)}
											onClick={() => handleSubscribe(item)}
											type="button"
										>
											{isSubscribing(item) ? 'Following…' : 'Follow'}
										</button>
									)}
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</>
	);
};
