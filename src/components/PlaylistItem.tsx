import {FunctionalComponent} from 'preact';

import {decode} from '../lib/decode-html-entities.js';
import {
	getPlaylistID,
	isChannelUploads,
	PlaylistItemLike,
} from '../lib/youtube.js';

export function playlistHref(item: PlaylistItemLike) {
	return `https://www.youtube.com/playlist?list=${getPlaylistID(item)}`;
}

export const PlaylistThumbnail: FunctionalComponent<{
	item: PlaylistItemLike;
}> = ({item}) => {
	const thumbnail = item.snippet.thumbnails?.medium;
	const isChannel = isChannelUploads(item);

	return (
		<a
			aria-hidden="true"
			class={`playlist-thumb${isChannel ? ' channel' : ''}`}
			href={playlistHref(item)}
			tabIndex={-1}
		>
			{thumbnail && <img alt="" loading="lazy" src={thumbnail.url} />}
		</a>
	);
};

export const PlaylistDetails: FunctionalComponent<{
	item: PlaylistItemLike;
}> = ({item}) => {
	const channelHref = `https://www.youtube.com/channel/${item.snippet.channelId}`;

	return (
		<div class="playlist-details">
			<a class="title" href={playlistHref(item)}>
				{decode(item.snippet.title)}
			</a>
			{isChannelUploads(item) ? (
				<p class="meta">
					<span class="badge">All uploads</span>{' '}
					<a href={channelHref}>Channel</a>
				</p>
			) : (
				<p class="meta">
					<a href={channelHref}>{decode(item.snippet.channelTitle)}</a>
				</p>
			)}
		</div>
	);
};
