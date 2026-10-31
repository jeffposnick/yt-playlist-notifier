import {FunctionalComponent} from 'preact';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {useState} from 'preact/hooks';

import {Main} from './Main.js';
import {ROUTES} from '../constants.js';
import {InfoIcon, PlaylistIcon, SearchIcon, VideoIcon} from './Icons.js';

const queryClient = new QueryClient();

const ROUTE_ICONS: Record<string, FunctionalComponent> = {
	ABOUT: InfoIcon,
	SEARCH: SearchIcon,
	SUBSCRIPTIONS: PlaylistIcon,
	VIDEOS: VideoIcon,
};

export const App: FunctionalComponent = () => {
	const [currentPath, setCurrentPath] = useState<string>();

	return (
		<QueryClientProvider client={queryClient}>
			<Main onRouteChange={setCurrentPath} />
			<nav aria-label="Primary" class="tab-bar">
				{Array.from(ROUTES.entries()).map(([key, {label, path}]) => {
					const RouteIcon = ROUTE_ICONS[key];
					const isActive = path === currentPath;
					return (
						<a
							aria-current={isActive ? 'page' : undefined}
							class={isActive ? 'active' : undefined}
							href={path}
							key={key}
						>
							<span class="tab-icon">{RouteIcon && <RouteIcon />}</span>
							{label}
						</a>
					);
				})}
			</nav>
		</QueryClientProvider>
	);
};
