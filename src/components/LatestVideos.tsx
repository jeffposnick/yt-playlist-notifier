import {FunctionalComponent} from 'preact';

import {ROUTES} from '../constants.js';
import {VideoItem} from './VideoItem.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

export const LatestVideos: FunctionalComponent<{
	newestVideos: Array<PlaylistItemList.Item>;
}> = ({newestVideos}) => {
	return (
		<>
			<h4>Videos from subscriptions:</h4>
			<div class="card-container">
				{newestVideos.length === 0 ? (
					<p>
						<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
						playlist with videos to get started.
					</p>
				) : (
					newestVideos.map((item, id) => <VideoItem item={item} key={id} />)
				)}
			</div>
		</>
	);
};
