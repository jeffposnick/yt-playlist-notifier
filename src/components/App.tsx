import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {LatestVideos} from './LatestVideos';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {SubscribedPlaylists, SetSubscribedPlaylists} from './context';

export function App() {
  const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
    [],
  );
  useEffect(() => {
    getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));
  }, []);

  return (
    <SetSubscribedPlaylists.Provider value={setSubscribedPlaylists}>
      <SubscribedPlaylists.Provider value={subscribedPlaylists}>
        <main>
          <Router>
            <LatestVideos path="/" />
            <PlaylistSearchForm path="/search" />
            <CurrentSubscriptions path="/current" />
          </Router>
        </main>
        <footer>
          <a href="/">Newest Videos</a>
          <a href="/search">Search for Playlists</a>
          <a href="/current">Current Subscriptions</a>
        </footer>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
