import {FunctionalComponent} from 'preact';

import {ROUTES} from '../constants.js';
import {PlaylistIcon} from './Icons.js';

export const EmptyState: FunctionalComponent<{heading: string}> = ({
	heading,
}) => (
	<div class="empty-state">
		<span class="empty-icon">
			<PlaylistIcon size={28} />
		</span>
		<h2>{heading}</h2>
		<p>
			<a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a playlist
			or channel, and its newest videos will show up here.
		</p>
	</div>
);
