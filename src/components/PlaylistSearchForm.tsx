import {JSX} from 'preact';
import {PlaylistSearchResults} from '../types/PlaylistSearchResults';
import {PlaylistItem} from './PlaylistItem';
import {useRef, useState} from 'preact/hooks';

export function PlaylistSearchForm() {
  const search = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<PlaylistSearchResults>();

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, Event>,
  ) => {
    event.preventDefault();
    const searchTerm = search.current?.value;
    if (!searchTerm) {
      return;
    }

    const url = new URL(`https://youtube.googleapis.com/youtube/v3/search`);
    url.searchParams.set('key', import.meta.env.VITE_YT_API_KEY);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', searchTerm);
    url.searchParams.set('type', 'playlist');

    const response = await fetch(url.href);
    const json = await response.json();
    setSearchResults(json as PlaylistSearchResults);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="playlist-search">Search for playlists: </label>
        <input type="search" id="playlist-search" ref={search} />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {searchResults?.items.map((item) => (
          <PlaylistItem {...item} />
        ))}
      </ul>
    </>
  );
}
