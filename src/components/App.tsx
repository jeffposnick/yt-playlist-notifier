import {FunctionalComponent} from 'preact';
import {Link} from 'preact-router/match';
import {useAsync} from 'react-async-hook';
import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';

import {About} from './About.js';
import {CurrentSubscriptions} from './CurrentSubscriptions.js';
import {getNewVideos} from '../lib/get-new-videos.js';
import {getSubscribedPlaylists, Value} from '../lib/idb.js';
import {LatestVideos} from './LatestVideos.js';
import {NUMBER_OF_LATEST_VIDEOS, ROUTES} from '../constants.js';
import {PlaylistItemList} from '../lib/youtube.js';
import {PlaylistSearchForm} from './PlaylistSearchForm.js';

async function loadNewestVideosFromIDB(subscribedPlaylists: Array<Value>) {
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
	const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
		[],
	);
	const asyncNewestVideos = useAsync(loadNewestVideosFromIDB, [
		subscribedPlaylists,
	]);

	useEffect(() => {
		const initData = async () => {
			const subscribedPlaylistsFromIDB = await getSubscribedPlaylists();
			setSubscribedPlaylists(subscribedPlaylistsFromIDB);
			const newVideosFromYT = await getNewVideos();
			if (newVideosFromYT.length > 0) {
				await asyncNewestVideos.execute(subscribedPlaylistsFromIDB);
			}
		};

		initData();
	}, []);

	return (
		<>
			<main>
				<Router>
					<LatestVideos
						asyncNewestVideos={asyncNewestVideos}
						default
						path={ROUTES.get('VIDEOS')?.path}
					/>
					<PlaylistSearchForm
						path={ROUTES.get('SEARCH')?.path}
						setSubscribedPlaylists={setSubscribedPlaylists}
						subscribedPlaylists={subscribedPlaylists}
					/>
					<CurrentSubscriptions
						path={ROUTES.get('SUBSCRIPTIONS')?.path}
						setSubscribedPlaylists={setSubscribedPlaylists}
						subscribedPlaylists={subscribedPlaylists}
					/>
					<About path={ROUTES.get('ABOUT')?.path} />
				</Router>
			</main>
			<footer>
				{Array.from(ROUTES.values()).map(({iconUrl, path, title}) => (
					<Link activeClassName="active" href={path}>
						<img class="svgIcon" src={iconUrl} alt={title}></img>
					</Link>
				))}
			</footer>
		</>
	);
};
