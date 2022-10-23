import {FunctionalComponent} from 'preact';

import {ROUTES} from '../constants.js';
import {useQueries} from '../lib/use-queries.js';
import {VideoItem} from './VideoItem.js';

export const LatestVideos: FunctionalComponent = () => {
	const {newestVideos} = useQueries();

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
