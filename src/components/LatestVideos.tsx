import {FunctionalComponent} from 'preact';
import {Signal} from '@preact/signals';

import {ROUTES} from '../constants.js';
import {PlaylistItemList} from '../lib/youtube.js';
import {VideoItem} from './VideoItem.js';

export const LatestVideos: FunctionalComponent<{
	newestVideos: Signal<Array<PlaylistItemList.Item>>;
}> = ({newestVideos}) => {
	return (
		<>
			<h4>Videos from subscriptions:</h4>
			<div class="card-container">
				{newestVideos.value.length === 0 ? (
					<p>
						<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
						playlist with videos to get started.
					</p>
				) : (
					newestVideos.value.map((item) => <VideoItem item={item} />)
				)}
			</div>
		</>
	);
};
