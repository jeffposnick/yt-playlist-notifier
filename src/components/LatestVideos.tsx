import {FunctionalComponent} from 'preact';
import {UseAsyncReturn} from 'react-async-hook';

import {Value} from '../lib/idb.js';
import {ROUTES} from '../constants.js';
import {PlaylistItemList} from '../lib/youtube.js';
import {VideoItem} from './VideoItem.js';

export const LatestVideos: FunctionalComponent<{
	asyncNewestVideos: UseAsyncReturn<Array<PlaylistItemList.Item>, Array<Array<Value>>>;
}> = ({asyncNewestVideos}) => {
	return (
		<>
			<h4>Videos from subscriptions:</h4>
			<div class="card-container">
				{asyncNewestVideos.result &&
					(asyncNewestVideos.result.length === 0 ? (
						<p>
							<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a playlist with videos
							to get started.
						</p>
					) : (
						asyncNewestVideos.result.map((item) => <VideoItem item={item} />)
					))}
			</div>
		</>
	);
};
