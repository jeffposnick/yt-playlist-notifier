import {FunctionalComponent, JSX} from 'preact';
import {useAsync} from 'react-async-hook';
import {useContext, useRef, useState} from 'preact/hooks';

import {getPlaylistItems, playlistSearch, PlaylistSearch} from '../lib/youtube';
import {getSubscribedPlaylists, setPlaylistItems} from '../lib/idb';
import {PlaylistItem} from './PlaylistItem';
import {requestPermission} from '../lib/notifications';
import {SetSubscribedPlaylists} from './context';

const performPlaylistSearch = async (searchTerm?: string) => {
  if (!searchTerm) {
    return;
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

  const handleClick = async (item: PlaylistSearch.Item) => {
    const playlistItems = await getPlaylistItems(item.id.playlistId);
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
    const subscribedPlaylists = await getSubscribedPlaylists();
    setSubscribedPlaylists?.(subscribedPlaylists);
    document.querySelector('#check-now')?.scrollIntoView();
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
      </div>
    </>
  );
};
