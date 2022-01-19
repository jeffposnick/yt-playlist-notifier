import {decode} from '../lib/decode-html-entities';
import {getPlaylistID, PlaylistItemLike} from '../lib/youtube';

export function PlaylistItem({
  buttonText,
  item,
  clickCallback,
}: {
  buttonText: string;
  item: PlaylistItemLike;
  clickCallback: (item: PlaylistItemLike) => Promise<void>;
}) {
  const playlistHref = `https://www.youtube.com/playlist?list=${getPlaylistID(
    item,
  )}`;
  const channelHref = `https://www.youtube.com/channel/${item.snippet.channelId}`;

  return (
    <div class="card">
      <span>
        <a class="title" href={playlistHref}>
          {decode(item.snippet.title)}
        </a>
        <div>
          curated by{' '}
          <a href={channelHref}>{decode(item.snippet.channelTitle)}</a>
        </div>
      </span>
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </div>
  );
}
