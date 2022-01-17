import {decode} from '../lib/decode-html-entities';
import {getPlaylistID, PlaylistList, PlaylistSearch} from '../lib/youtube';

export function PlaylistItem({
  buttonText,
  item,
  clickCallback,
}: {
  buttonText: string;
  item: PlaylistSearch.Item | PlaylistList.Item;
  clickCallback: (
    item: PlaylistList.Item | PlaylistSearch.Item,
  ) => Promise<void>;
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
        , curated by{' '}
        <a href={channelHref}>{decode(item.snippet.channelTitle)}</a>
      </span>
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </div>
  );
}
