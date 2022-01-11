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
    <li>
      <b>{item.snippet.title}</b> from {item.snippet.channelTitle}
      <button onClick={() => clickCallback(item)}>{buttonText}</button>
    </li>
  );
}
