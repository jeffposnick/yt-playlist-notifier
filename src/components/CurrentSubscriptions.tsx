import {FunctionalComponent} from 'preact';

import {ROUTES} from '../constants.js';
import {
	NotificationStatus,
	useNotificationStatus,
} from '../lib/notifications.js';
import {relativeTime} from '../lib/relative-time.js';
import {getNewestVideos, useQueries} from '../lib/use-queries.js';
import {getPlaylistID} from '../lib/youtube.js';
import {EmptyState} from './EmptyState.js';
import {BellOffIcon, PlusIcon} from './Icons.js';
import {PlaylistDetails, PlaylistThumbnail} from './PlaylistItem.js';

const NOTIFICATION_STATUS_TEXT: Record<NotificationStatus, string> = {
	default: 'Notifications are off',
	denied: 'Notifications are blocked in your browser settings',
	granted: 'Notifications are on',
	unsupported: 'This browser doesn’t support notifications',
};

export const CurrentSubscriptions: FunctionalComponent = () => {
	const {handleUnsubscribe, subscribedPlaylists} = useQueries();
	const notifications = useNotificationStatus();

	return (
		<>
			<header class="page-header">
				<h1>Your playlists</h1>
				<p class="status-line">
					<span
						class={`status-dot ${notifications.status === 'granted' ? 'ok' : 'off'}`}
					/>
					{NOTIFICATION_STATUS_TEXT[notifications.status]}
					{notifications.status === 'default' && (
						<button
							class="link-button"
							onClick={() => void notifications.request()}
							type="button"
						>
							Turn on
						</button>
					)}
				</p>
			</header>
			<div class="page-body">
				{subscribedPlaylists.length === 0 ? (
					<EmptyState heading="You’re not following anything yet" />
				) : (
					<ul class="subscription-list">
						{subscribedPlaylists.map(({playlistItem, videos}) => {
							const [latestVideo] = getNewestVideos([{playlistItem, videos}]);
							return (
								<li
									class="card subscription-card"
									key={getPlaylistID(playlistItem)}
								>
									<div class="subscription-main">
										<PlaylistThumbnail item={playlistItem} />
										<PlaylistDetails item={playlistItem} />
									</div>
									<div class="subscription-footer">
										<p class="meta">
											{latestVideo
												? `Latest video ${relativeTime(latestVideo.snippet.publishedAt)}`
												: 'No videos yet'}
										</p>
										<button
											class="pill-button outline"
											onClick={() => handleUnsubscribe(playlistItem)}
											type="button"
										>
											<BellOffIcon size={16} />
											Unfollow
										</button>
									</div>
								</li>
							);
						})}
					</ul>
				)}
				<a class="add-link" href={ROUTES.get('SEARCH')?.path}>
					<PlusIcon size={18} />
					Follow another playlist or channel
				</a>
			</div>
		</>
	);
};
