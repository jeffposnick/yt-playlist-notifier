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
        , by{' '}
        <a href={decode(channelHref)}>{item.snippet.videoOwnerChannelTitle}</a>
      </span>
      <img
        height={item.snippet.thumbnails.default.height}
        src={item.snippet.thumbnails.default.url}
        width={item.snippet.thumbnails.default.width}
      />
    </div>
  );
}
