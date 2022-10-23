import {FunctionalComponent} from 'preact';
import {Link} from 'preact-router/match';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

import {Main} from './Main.js';
import {ROUTES} from '../constants.js';

const queryClient = new QueryClient();

export const App: FunctionalComponent = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Main />
			<footer>
				{Array.from(ROUTES.values()).map(({iconUrl, path, title}, id) => (
					<Link activeClassName="active" href={path} key={id}>
						<img class="svgIcon" src={iconUrl} alt={title} />
					</Link>
				))}
			</footer>
		</QueryClientProvider>
	);
};
