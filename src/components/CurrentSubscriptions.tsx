import {FunctionalComponent} from 'preact';
import {useContext} from 'preact/hooks';

import {getPlaylistID, PlaylistItemLike} from '../lib/youtube';
import {getSubscribedPlaylists, removeSubscribedPlaylist} from '../lib/idb';
import {PlaylistItem} from './PlaylistItem';
import {ROUTES} from '../constants';
import {SetSubscribedPlaylists, SubscribedPlaylists} from './context';

export const CurrentSubscriptions: FunctionalComponent = () => {
  const subscribedPlaylists = useContext(SubscribedPlaylists);
  const setSubscribedPlaylists = useContext(SetSubscribedPlaylists);

  const handleClick = async (item: PlaylistItemLike) => {
    await removeSubscribedPlaylist(getPlaylistID(item));
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
  };

  return (
    <>
      <h4>You're getting updates to:</h4>
      <div class="card-container">
        {subscribedPlaylists?.length === 0 ? (
          <p>
            <a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
            playlist with videos to get started.
          </p>
        ) : (
          subscribedPlaylists?.map(({playlistItem}) => (
            <PlaylistItem
              buttonText="🚫"
              item={playlistItem}
              clickCallback={handleClick}
            />
          ))
        )}
      </div>
    </>
  );
};
