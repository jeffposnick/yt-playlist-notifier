import {FunctionalComponent, JSX} from 'preact';
import {route} from 'preact-router';
import {useAsync} from 'react-async-hook';
import {useContext, useRef, useState} from 'preact/hooks';

import {
  getPlaylistID,
  getPlaylistItems,
  playlistList,
  playlistSearch,
  PlaylistList,
  PlaylistSearch,
} from '../lib/youtube';
import {getSubscribedPlaylists, setPlaylistItems} from '../lib/idb';
import {PlaylistItem} from './PlaylistItem';
import {requestPermission} from '../lib/notifications';
import {SetSubscribedPlaylists} from './context';

const performPlaylistSearch = async (searchTerm?: string) => {
  if (!searchTerm) {
    return;
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

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    event.preventDefault();
    setSearchTerm(search.current?.value || '');
  };

  const handleClick = async (item: PlaylistList.Item | PlaylistSearch.Item) => {
    const playlistItems = await getPlaylistItems(getPlaylistID(item));
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
    route('/current');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="playlist-search">
          <h4>Find playlists:</h4>
        </label>
        <div class="form-controls">
          <input type="search" id="playlist-search" ref={search} />
          <button type="submit">Search</button>
        </div>
      </form>
      <div class="card-container">
        {asyncSearchResults.result &&
          asyncSearchResults.result.map((item) => (
            <PlaylistItem
              buttonText="Notify 🔔"
              item={item}
              clickCallback={handleClick}
            />
          ))}
        {asyncSearchResults.error && (
          <p>
            Could not load search results: {asyncSearchResults.error.message}
          </p>
        )}
      </div>
    </>
  );
};
