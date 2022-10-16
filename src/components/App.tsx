import {FunctionalComponent} from 'preact';
import {Link} from 'preact-router/match';
import {signal, effect} from '@preact/signals';
import {useEffect} from 'preact/hooks';
import Router from 'preact-router';

import {About} from './About.js';
import {CurrentSubscriptions} from './CurrentSubscriptions.js';
import {getNewVideos} from '../lib/get-new-videos.js';
import {getSubscribedPlaylists, Value} from '../lib/idb.js';
import {LatestVideos} from './LatestVideos.js';
import {NUMBER_OF_LATEST_VIDEOS, ROUTES} from '../constants.js';
import {PlaylistSearchForm} from './PlaylistSearchForm.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

function loadNewestVideosFromIDB(subscribedPlaylists: Array<Value>) {
	const allVideos: Array<PlaylistItemList.Item> = [];

	for (const playlist of subscribedPlaylists) {
		for (const video of playlist.videos) {
			allVideos.push(video);
		}
	}

	return allVideos
		.sort((a, b) => {
			return b.snippet.publishedAt.localeCompare(a.snippet.publishedAt);
		})
		.slice(0, NUMBER_OF_LATEST_VIDEOS);
}

export const App: FunctionalComponent = () => {
	const subscribedPlaylists = signal<Array<Value>>([]);
	const newestVideos = signal<
		Awaited<ReturnType<typeof loadNewestVideosFromIDB>>
	>([]);

	effect(() => {
		newestVideos.value = loadNewestVideosFromIDB(subscribedPlaylists.value);
	});

	useEffect(() => {
		void (async () => {
			subscribedPlaylists.value = await getSubscribedPlaylists();
			const newVideosFromYT = await getNewVideos();
			if (newVideosFromYT.length > 0) {
				newestVideos.value = loadNewestVideosFromIDB(subscribedPlaylists.value);
			}
		})();
	}, [newestVideos, subscribedPlaylists]);

	return (
		<>
			<main>
				<Router>
					<LatestVideos
						newestVideos={newestVideos}
						default
						path={ROUTES.get('VIDEOS')?.path}
					/>
					<PlaylistSearchForm
						path={ROUTES.get('SEARCH')?.path}
						subscribedPlaylists={subscribedPlaylists}
					/>
					<CurrentSubscriptions
						path={ROUTES.get('SUBSCRIPTIONS')?.path}
						subscribedPlaylists={subscribedPlaylists}
					/>
					<About path={ROUTES.get('ABOUT')?.path} />
				</Router>
			</main>
			<footer>
				{Array.from(ROUTES.values()).map(({iconUrl, path, title}, id) => (
					<Link activeClassName="active" href={path} key={id}>
						<img class="svgIcon" src={iconUrl} alt={title} />
					</Link>
				))}
			</footer>
		</>
	);
};
