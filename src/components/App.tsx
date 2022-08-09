import {FunctionalComponent} from 'preact';
import {Link} from 'preact-router/match';
import {useAsync} from 'react-async-hook';
import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';

import {About} from './About';
import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getNewVideos} from '../lib/get-new-videos';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {LatestVideos} from './LatestVideos';
import {NUMBER_OF_LATEST_VIDEOS, ROUTES} from '../constants';
import {PlaylistItemList} from '../lib/youtube';
import {PlaylistSearchForm} from './PlaylistSearchForm';

async function getNewestVideos(subscribedPlaylists: Array<Value>) {
	const allVideos: Array<PlaylistItemList.Item> = [];
	if (subscribedPlaylists.length === 0) {
		return allVideos;
	}

	await getNewVideos();

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
	const asyncNewestVideos = useAsync(getNewestVideos, [subscribedPlaylists]);

	useEffect(() => {
		getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));
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
