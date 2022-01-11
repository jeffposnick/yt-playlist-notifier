import {useContext} from 'preact/hooks';

import {PlaylistItem} from './PlaylistItem';
import {PlaylistSearch} from '../lib/youtube';
import {getSubscribedPlaylists, removeSubscribedPlaylist} from '../lib/idb';
import {SetSubscribedPlaylists, SubscribedPlaylists} from '../context';

export function CurrentSubscriptions() {
  const subscribedPlaylists = useContext(SubscribedPlaylists);
  const setSubscribedPlaylists = useContext(SetSubscribedPlaylists);

  const handleClick = async (item: PlaylistSearch.Item) => {
    await removeSubscribedPlaylist(item.id.playlistId);
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
  };

  return (
    <>
      <p>You're currently getting updates to:</p>
      <ul>
        {subscribedPlaylists?.map(({playlistItem}) => (
          <PlaylistItem
            buttonText="Remove"
            item={playlistItem}
            clickCallback={handleClick}
          />
        ))}
      </ul>
    </>
  );
}
