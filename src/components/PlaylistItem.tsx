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
  return (
    <div class="card">
      <h6>{item.snippet.title}</h6>
      <p>from {item.snippet.channelTitle}</p>
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </div>
  );
}
