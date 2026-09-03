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
				{Array.from(ROUTES.values()).map(({iconUrl, path, title}, id) => {
					// preact-router's `LinkProps` type doesn't include `href`, even
					// though it's forwarded to the underlying anchor element. Passing
					// it via a spread (rather than inline) sidesteps the excess
					// property check.
					const linkProps = {activeClassName: 'active', href: path};
					return (
						<Link {...linkProps} key={id}>
							<img class="svgIcon" src={iconUrl} alt={title} />
						</Link>
					);
				})}
			</footer>
		</QueryClientProvider>
	);
};
