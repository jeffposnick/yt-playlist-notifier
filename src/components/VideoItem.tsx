import {FunctionalComponent} from 'preact';

import {decode} from '../lib/decode-html-entities.js';
import * as PlaylistItemList from '../types/PlaylistItemList.js';

export const VideoItem: FunctionalComponent<{
	item: PlaylistItemList.Item;
}> = ({item}) => {
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
		<div class="card">
			<span>
				<a class="title" href={videoHref}>
					{decode(item.snippet.title)}
				</a>
				<div>
					by{' '}
					<a href={channelHref}>
						{decode(item.snippet.videoOwnerChannelTitle)}
					</a>
				</div>
			</span>
			<img
				height={thumbnail.height / 3}
				src={thumbnail.url}
				width={thumbnail.width / 3}
			/>
		</div>
	);
};
