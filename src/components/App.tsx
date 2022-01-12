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
            <div path="/about">
              You can learn about this project at{' '}
              <a href="https://github.com/jeffposnick/yt-playlist-notifier">
                https://github.com/jeffposnick/yt-playlist-notifier
              </a>
            </div>
          </Router>
        </main>
        <footer>
          <a href="/">Videos</a>
          <a href="/search">Search</a>
          <a href="/current">Subscriptions</a>
          <a href="/about">About</a>
        </footer>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
