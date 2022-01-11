import {JSX} from 'preact';
import {PlaylistItem} from './PlaylistItem';
import {playlistSearch} from '../lib/youtube';
import {useAsync} from 'react-async-hook';
import {useRef, useState} from 'preact/hooks';

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
          asyncSearchResults.result.map((item) => <PlaylistItem {...item} />)}
      </ul>
    </>
  );
}
