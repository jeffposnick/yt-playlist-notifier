import {decode} from '../lib/decode-html-entities';
import {PlaylistItemList} from '../lib/youtube';

export function VideoItem({item}: {item: PlaylistItemList.Item}) {
  const videoHref = `https://youtu.be/${item.snippet.resourceId.videoId}`;
  const channelHref = `https://www.youtube.com/channel/${item.snippet.videoOwnerChannelId}`;

  const thumbnail =
    item.snippet.thumbnails.medium || item.snippet.thumbnails.default;

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
        height={thumbnail.height / 3}
        src={thumbnail.url}
        width={thumbnail.width / 3}
      />
    </div>
  );
}
