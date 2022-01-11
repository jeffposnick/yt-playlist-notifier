import {JSX} from 'preact';
import {playlistSearch} from '../lib/youtube';
import {PlaylistItem} from './PlaylistItem';
import {useRef, useState} from 'preact/hooks';
import {useAsync} from 'react-async-hook';

const performPlaylistSearch = async (searchTerm?: string) => {
  if (!searchTerm) {
    return;
  }
  return await playlistSearch(searchTerm);
};

export function PlaylistSearchForm() {
  const search = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const asyncSearchResults = useAsync(performPlaylistSearch, [searchTerm]);

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    event.preventDefault();
    setSearchTerm(search.current?.value || '');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="playlist-search">Search for playlists: </label>
        <input type="search" id="playlist-search" ref={search} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {asyncSearchResults.result &&
          asyncSearchResults.result.items.map((item) => (
            <PlaylistItem {...item} />
          ))}
      </ul>
    </>
  );
}
