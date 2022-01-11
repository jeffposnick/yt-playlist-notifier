import {useContext} from 'preact/hooks';

import {getPlaylistItems, PlaylistSearch} from '../lib/youtube';
import {getSubscribedPlaylists, setPlaylistItems} from '../lib/idb';
import {requestPermission} from '../lib/notifications';
import {SetSubscribedPlaylists} from '../context';

export function PlaylistItem({item}: {item: PlaylistSearch.Item}) {
  const setSubscribedPlaylists = useContext(SetSubscribedPlaylists);

  const handleClick = async () => {
    const playlistItems = await getPlaylistItems(item.id.playlistId);
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
  };

  return (
    <li>
      <b>{item.snippet.title}</b> from {item.snippet.channelTitle}
      <button onClick={handleClick}>Notify</button>
    </li>
  );
}
