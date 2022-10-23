import {FunctionalComponent} from 'preact';

import {PlaylistItem} from './PlaylistItem.js';
import {ROUTES} from '../constants.js';
import {useQueries} from '../lib/use-queries.js';

export const CurrentSubscriptions: FunctionalComponent = () => {
	const {handleUnsubscribe, subscribedPlaylists} = useQueries();

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
