import {decode} from '../lib/decode-html-entities';
import {PlaylistItemList} from '../lib/youtube';

export function VideoItem({item}: {item: PlaylistItemList.Item}) {
  const videoHref = `https://youtu.be/${item.snippet.resourceId.videoId}`;
  const channelHref = `https://www.youtube.com/channel/${item.snippet.videoOwnerChannelId}`;

  return (
    <div class="card">
      <span>
        <a class="title" href={videoHref}>
          {decode(item.snippet.title)}
        </a>
        <div>
          by{' '}
          <a href={decode(channelHref)}>
            {item.snippet.videoOwnerChannelTitle}
          </a>
        </div>
      </span>
      <img
        height={item.snippet.thumbnails.medium.height / 2}
        src={item.snippet.thumbnails.medium.url}
        width={item.snippet.thumbnails.medium.width / 2}
      />
    </div>
  );
}
