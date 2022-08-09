import {FunctionalComponent} from 'preact';
import {Link} from 'preact-router/match';
import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';

import {About} from './About';
import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {LatestVideos} from './LatestVideos';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {ROUTES} from '../constants';

export const App: FunctionalComponent = () => {
	const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
		[],
	);

	useEffect(() => {
		getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));
	}, []);

	return (
		<>
			<main>
				<Router>
					<LatestVideos
						default
						path={ROUTES.get('VIDEOS')?.path}
						subscribedPlaylists={subscribedPlaylists}
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
