import {PlaylistList, PlaylistSearch} from '../lib/youtube';

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
  const playlistHref = `https://www.youtube.com/playlist?list=${item.id.playlistId}`;
  const channelHref = `https://www.youtube.com/channel/${item.snippet.channelId}`;

  return (
    <div class="card">
      <span>
        <a class="title" href={playlistHref}>
          {item.snippet.title}
        </a>
        , curated by <a href={channelHref}>{item.snippet.channelTitle}</a>
      </span>
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </div>
  );
}
