import {FunctionalComponent} from 'preact';
import {useState} from 'preact/hooks';

import {UPDATE_CHECK} from '../constants.js';
import {decode} from '../lib/decode-html-entities.js';
import {getNewestVideos, useQueries} from '../lib/use-queries.js';
import {getPlaylistID} from '../lib/youtube.js';
import {EmptyState} from './EmptyState.js';
import {BellIcon, RefreshIcon} from './Icons.js';
import {VideoItem} from './VideoItem.js';

const checkForUpdates = () => {
	navigator.serviceWorker?.controller?.postMessage(UPDATE_CHECK);
};

export const LatestVideos: FunctionalComponent = () => {
	const {subscribedPlaylists} = useQueries();
	const [filterID, setFilterID] = useState<string>();

	const selectedPlaylist = subscribedPlaylists.find(
		({playlistItem}) => getPlaylistID(playlistItem) === filterID,
	);
	const newestVideos = getNewestVideos(
		selectedPlaylist ? [selectedPlaylist] : subscribedPlaylists,
	);
	const playlistTitles = new Map(
		subscribedPlaylists.map(({playlistItem}) => [
			getPlaylistID(playlistItem),
			decode(playlistItem.snippet.title),
		]),
	);

	return (
		<>
			<header class="page-header app-bar">
				<div class="brand">
					<span class="brand-mark">
						<BellIcon size={18} />
					</span>
					<h1>Playlist Notifier</h1>
				</div>
				{navigator.serviceWorker?.controller && (
					<button
						aria-label="Check for new videos"
						class="icon-button"
						onClick={checkForUpdates}
						title="Check for new videos"
						type="button"
					>
						<RefreshIcon />
					</button>
				)}
			</header>
			{subscribedPlaylists.length > 1 && (
				<div aria-label="Filter by playlist" class="chips" role="group">
					<button
						aria-pressed={!selectedPlaylist}
						class="chip"
						onClick={() => setFilterID(undefined)}
						type="button"
					>
						All
					</button>
					{subscribedPlaylists.map(({playlistItem}) => {
						const id = getPlaylistID(playlistItem);
						return (
							<button
								aria-pressed={id === filterID}
								class="chip"
								key={id}
								onClick={() => setFilterID(id)}
								type="button"
							>
								{playlistTitles.get(id)}
							</button>
						);
					})}
				</div>
			)}
			<div class="page-body">
				{newestVideos.length === 0 ? (
					<EmptyState heading="No videos yet" />
				) : (
					<div class="video-grid">
						{newestVideos.map((item) => (
							<VideoItem
								item={item}
								key={item.id}
								playlistTitle={
									selectedPlaylist
										? undefined
										: playlistTitles.get(item.snippet.playlistId)
								}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};
