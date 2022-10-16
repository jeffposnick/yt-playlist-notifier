import {FunctionalComponent} from 'preact';
import {Signal} from '@preact/signals';

import {getPlaylistID, PlaylistItemLike} from '../lib/youtube.js';
import {getSubscribedPlaylists, removeSubscribedPlaylist} from '../lib/idb.js';
import {PlaylistItem} from './PlaylistItem.js';
import {ROUTES} from '../constants.js';
import {Value} from '../lib/idb.js';

export const CurrentSubscriptions: FunctionalComponent<{
	subscribedPlaylists: Signal<Array<Value>>;
}> = ({subscribedPlaylists}) => {
	const handleClick = (item: PlaylistItemLike) => {
		void (async () => {
			await removeSubscribedPlaylist(getPlaylistID(item));
			subscribedPlaylists.value = await getSubscribedPlaylists();
		})();
	};

	return (
		<>
			<h4>You're getting updates to:</h4>
			<div class="card-container">
				{subscribedPlaylists.value.length === 0 ? (
					<p>
						<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
						playlist with videos to get started.
					</p>
				) : (
					subscribedPlaylists.value.map(({playlistItem}, id) => (
						<PlaylistItem
							buttonText="🚫"
							item={playlistItem}
							clickCallback={handleClick}
							key={id}
						/>
					))
				)}
			</div>
		</>
	);
};
