import {FunctionalComponent} from 'preact';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Router} from 'preact-router';

import {About} from '../components/About.js';
import {CurrentSubscriptions} from '../components/CurrentSubscriptions.js';
import {LatestVideos} from '../components/LatestVideos.js';
import {PlaylistSearchForm} from '../components/PlaylistSearchForm.js';
import {ROUTES} from '../constants.js';

export const Main: FunctionalComponent = () => {
	return (
		<main>
			<Router>
				<LatestVideos default path={ROUTES.get('VIDEOS')?.path} />
				<PlaylistSearchForm path={ROUTES.get('SEARCH')?.path} />
				<CurrentSubscriptions path={ROUTES.get('SUBSCRIPTIONS')?.path} />
				<About path={ROUTES.get('ABOUT')?.path} />
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</main>
	);
};
