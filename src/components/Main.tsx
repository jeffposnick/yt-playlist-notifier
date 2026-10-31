import {FunctionalComponent} from 'preact';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Router, RouterOnChangeArgs} from 'preact-router';

import {About} from '../components/About.js';
import {CurrentSubscriptions} from '../components/CurrentSubscriptions.js';
import {LatestVideos} from '../components/LatestVideos.js';
import {PlaylistSearchForm} from '../components/PlaylistSearchForm.js';
import {ROUTES} from '../constants.js';

const APP_TITLE = 'YT Playlist Notifier';

export const Main: FunctionalComponent<{
	onRouteChange: (path: string | undefined) => void;
}> = ({onRouteChange}) => {
	// Report the path of the route that actually rendered (rather than the
	// URL), so that the default route's tab is active for unknown URLs too.
	const handleChange = ({current}: RouterOnChangeArgs) => {
		const path = (current?.props as {path?: string} | undefined)?.path;
		onRouteChange(path);

		// Give each view its own title, for tabs, history, and screen readers.
		const route = [...ROUTES.values()].find((route) => route.path === path);
		document.title = route ? `${route.label} · ${APP_TITLE}` : APP_TITLE;
	};

	return (
		<main>
			<Router onChange={handleChange}>
				<LatestVideos default path={ROUTES.get('VIDEOS')?.path} />
				<PlaylistSearchForm path={ROUTES.get('SEARCH')?.path} />
				<CurrentSubscriptions path={ROUTES.get('SUBSCRIPTIONS')?.path} />
				<About path={ROUTES.get('ABOUT')?.path} />
			</Router>
			<ReactQueryDevtools initialIsOpen={false} />
		</main>
	);
};
