import {FunctionalComponent} from 'preact';

import {decode} from '../lib/decode-html-entities.js';
import {isNewSinceLastVisit} from '../lib/last-visit.js';
import {relativeTime} from '../lib/relative-time.js';
import {thumbnailSrcset} from '../lib/thumbnails.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';
import {PlaylistIcon} from './Icons.js';

export const VideoItem: FunctionalComponent<{
	item: PlaylistItemList.Item;
	playlistTitle?: string;
}> = ({item, playlistTitle}) => {
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
					loading="lazy"
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
