import {FunctionalComponent} from 'preact';
import {StateUpdater} from 'preact/hooks';

import {getPlaylistID, PlaylistItemLike} from '../lib/youtube.js';
import {getSubscribedPlaylists, removeSubscribedPlaylist} from '../lib/idb.js';
import {PlaylistItem} from './PlaylistItem.js';
import {ROUTES} from '../constants.js';
import {Value} from '../lib/idb.js';

export const CurrentSubscriptions: FunctionalComponent<{
	setSubscribedPlaylists: StateUpdater<Array<Value>>;
	subscribedPlaylists: Value[];
}> = ({setSubscribedPlaylists, subscribedPlaylists}) => {
	const handleClick = async (item: PlaylistItemLike) => {
		await removeSubscribedPlaylist(getPlaylistID(item));
		const subscribedPlaylists = await getSubscribedPlaylists();
		setSubscribedPlaylists(subscribedPlaylists);
	};

	return (
		<>
			<h4>You're getting updates to:</h4>
			<div class="card-container">
				{subscribedPlaylists?.length === 0 ? (
					<p>
						<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a playlist with videos to
						get started.
					</p>
				) : (
					subscribedPlaylists?.map(({playlistItem}) => (
						<PlaylistItem buttonText="🚫" item={playlistItem} clickCallback={handleClick} />
					))
				)}
			</div>
		</>
	);
};
