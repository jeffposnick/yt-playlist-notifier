import {FunctionalComponent} from 'preact';

import {decode} from '../lib/decode-html-entities.js';
import {isNewSinceLastVisit} from '../lib/last-visit.js';
import {relativeTime} from '../lib/relative-time.js';
import {thumbnailSrcset} from '../lib/thumbnails.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {PlaylistIcon} from './Icons.js';

// The most columns the video grid shows at its maximum width.
const FIRST_ROW_SIZE = 4;

export const VideoItem: FunctionalComponent<{
	// The position in the grid. The first row is visible on load, so it isn't
	// lazy-loaded, and the first thumbnail is likely the largest paint.
	index: number;
	item: PlaylistItemList.Item;
	playlistTitle?: string;
}> = ({index, item, playlistTitle}) => {
	if (
		!(
			item.snippet.title &&
			item.snippet.videoOwnerChannelId &&
			item.snippet.videoOwnerChannelTitle &&
			item.snippet.thumbnails.medium &&
			item.snippet.thumbnails.medium.url
		)
	) {
		return null;
	}

	const videoHref = `https://youtu.be/${item.snippet.resourceId.videoId}`;
	const channelHref = `https://www.youtube.com/channel/${item.snippet.videoOwnerChannelId}`;
	const thumbnail = item.snippet.thumbnails.medium;

	return (
		<article class="card video-card">
			<a aria-hidden="true" class="video-thumb" href={videoHref} tabIndex={-1}>
				<img
					alt=""
					fetchpriority={index === 0 ? 'high' : undefined}
					loading={index < FIRST_ROW_SIZE ? undefined : 'lazy'}
					sizes="(max-width: 611px) calc(100vw - 32px), 440px"
					src={thumbnail.url}
					srcset={thumbnailSrcset(item.snippet.thumbnails)}
				/>
				{isNewSinceLastVisit(item.snippet.publishedAt) && (
					<span class="new-badge">New</span>
				)}
			</a>
			<div class="video-details">
				<a class="title" href={videoHref}>
					{decode(item.snippet.title)}
				</a>
				<p class="meta">
					<a href={channelHref}>
						{decode(item.snippet.videoOwnerChannelTitle)}
					</a>{' '}
					· {relativeTime(item.snippet.publishedAt)}
				</p>
				{playlistTitle && (
					<p class="meta playlist-name">
						<PlaylistIcon size={14} />
						{playlistTitle}
					</p>
				)}
			</div>
		</article>
	);
};
