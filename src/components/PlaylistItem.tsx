import {PlaylistSearch} from '../lib/youtube';

export function PlaylistItem({
  buttonText,
  item,
  clickCallback,
}: {
  buttonText: string;
  item: PlaylistSearch.Item;
  clickCallback: (item: PlaylistSearch.Item) => Promise<void>;
}) {
  const playlistHref = `https://www.youtube.com/playlist?list=${item.id.playlistId}`;
  const channelHref = `https://www.youtube.com/channel/${item.snippet.channelId}`;

  return (
    <div class="card">
      <h6>
        <a href={playlistHref}>{item.snippet.title}</a>
      </h6>
      <p>
        created by <a href={channelHref}>{item.snippet.channelTitle}</a>
      </p>
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </div>
  );
}
