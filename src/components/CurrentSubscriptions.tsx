import {FunctionalComponent} from 'preact';

import {PlaylistItemLike} from '../lib/youtube.js';
import {PlaylistItem} from './PlaylistItem.js';
import {ROUTES} from '../constants.js';
import {Value} from '../lib/idb.js';

export const CurrentSubscriptions: FunctionalComponent<{
	handleUnsubscribe: (item: PlaylistItemLike) => void;
	subscribedPlaylists: Array<Value>;
}> = ({handleUnsubscribe, subscribedPlaylists}) => {
	return (
		<>
			<h4>You're getting updates to:</h4>
			<div class="card-container">
				{subscribedPlaylists.length === 0 ? (
					<p>
						<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
						playlist with videos to get started.
					</p>
				) : (
					subscribedPlaylists.map(({playlistItem}, id) => (
						<PlaylistItem
							buttonText="🚫"
							item={playlistItem}
							clickCallback={handleUnsubscribe}
							key={id}
						/>
					))
				)}
			</div>
		</>
	);
};
