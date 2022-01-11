import {StateUpdater} from 'preact/hooks';

import {getPlaylistItems, PlaylistSearch} from '../lib/youtube';
import {getSubscribedPlaylists, setPlaylistItems, Value} from '../lib/idb';
import {requestPermission} from '../lib/notifications';

export function PlaylistItem({
  item,
  setSubscribedPlaylists,
}: {
  item: PlaylistSearch.Item;
  setSubscribedPlaylists: StateUpdater<Value[]>;
}) {
  const handleClick = async () => {
    const playlistItems = await getPlaylistItems(item.id.playlistId);
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists(subscribedPlaylists);
  };

  return (
    <li>
      <b>{item.snippet.title}</b> from {item.snippet.channelTitle}
      <button onClick={handleClick}>Notify</button>
    </li>
  );
}
