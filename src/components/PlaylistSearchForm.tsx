import {FunctionalComponent, JSX} from 'preact';
import {useAsync} from 'react-async-hook';
import {useContext, useRef, useState} from 'preact/hooks';

import {
  getPlaylistID,
  getPlaylistItems,
  playlistList,
  playlistSearch,
  PlaylistItemLike,
} from '../lib/youtube';
import {
  getSubscribedPlaylists,
  removeSubscribedPlaylist,
  setPlaylistItems,
} from '../lib/idb';
import {PlaylistItem} from './PlaylistItem';
import {requestPermission} from '../lib/notifications';
import {SetSubscribedPlaylists, SubscribedPlaylists} from './context';

const performPlaylistSearch = async (searchTerm?: string) => {
  if (!searchTerm) {
    return;
  }

  try {
    const url = new URL(searchTerm);
    const listParam = url.searchParams.get('list');
    if (listParam) {
      const results = await playlistList(listParam);
      if (results.length > 0) {
        return results;
      }
    }
  } catch (error: unknown) {
    // no-op
  }

  if (searchTerm.startsWith('PL')) {
    const results = await playlistList(searchTerm);
    if (results.length > 0) {
      return results;
    }
  }
  return await playlistSearch(searchTerm);
};

export const PlaylistSearchForm: FunctionalComponent = () => {
  const search = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const asyncSearchResults = useAsync(performPlaylistSearch, [searchTerm]);
  const setSubscribedPlaylists = useContext(SetSubscribedPlaylists);
  const subscribedPlaylists = useContext(SubscribedPlaylists);

  const isSubscribed = (item: PlaylistItemLike) =>
    subscribedPlaylists?.some(
      (subscribedItem) =>
        getPlaylistID(subscribedItem.playlistItem) === getPlaylistID(item),
    ) || false;

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    event.preventDefault();
    setSearchTerm(search.current?.value || '');
  };

  const handleUnsubscribeClick = async (item: PlaylistItemLike) => {
    await removeSubscribedPlaylist(getPlaylistID(item));
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
  };

  const handleSubscribeClick = async (item: PlaylistItemLike) => {
    const playlistItems = await getPlaylistItems(getPlaylistID(item));
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="playlist-search">
          <h4>Subscribe to playlists:</h4>
        </label>
        <div class="form-controls">
          <input type="search" id="playlist-search" ref={search} />
          <button type="submit">Search</button>
        </div>
      </form>
      <p>Tip: You can also search for a "PL..." ID, or playlist page URL!</p>
      <div class="card-container">
        {asyncSearchResults.result &&
          (asyncSearchResults.result.length === 0 ? (
            <p>No matching playlists found.</p>
          ) : (
            asyncSearchResults.result.map((item) => {
              return isSubscribed(item) ? (
                <PlaylistItem
                  buttonText="🚫"
                  item={item}
                  clickCallback={handleUnsubscribeClick}
                />
              ) : (
                <PlaylistItem
                  buttonText="🔔"
                  item={item}
                  clickCallback={handleSubscribeClick}
                />
              );
            })
          ))}
        {asyncSearchResults.error && (
          <>
            <p>Could not load search results:</p>
            <pre>{asyncSearchResults.error.message}</pre>
          </>
        )}
      </div>
    </>
  );
};
