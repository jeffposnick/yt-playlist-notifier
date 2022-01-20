import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';
import {Link} from 'preact-router/match';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {LatestVideos} from './LatestVideos';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {ROUTES} from '../constants';
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
            <LatestVideos path={ROUTES.get('Videos')} />
            <PlaylistSearchForm path={ROUTES.get('Search')} />
            <CurrentSubscriptions path={ROUTES.get('Subscriptions')} />
            <div path={ROUTES.get('About')}>
              You can learn about this project at{' '}
              <a href="https://github.com/jeffposnick/yt-playlist-notifier">
                https://github.com/jeffposnick/yt-playlist-notifier
              </a>
            </div>
          </Router>
        </main>
        <footer>
          {Array.from(ROUTES.entries()).map(([routeName, routeUrl]) => (
            <Link activeClassName="active" href={routeUrl}>
              {routeName}
            </Link>
          ))}
        </footer>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
