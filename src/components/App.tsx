import {useState, useEffect} from 'preact/hooks';
import Router from 'preact-router';
import {Link} from 'preact-router/match';

import {About} from './About';
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
            <LatestVideos path={ROUTES.get('VIDEOS')?.path} default />
            <PlaylistSearchForm path={ROUTES.get('SEARCH')?.path} />
            <CurrentSubscriptions path={ROUTES.get('SUBSCRIPTIONS')?.path} />
            <About path={ROUTES.get('ABOUT')?.path} />
          </Router>
        </main>
        <footer>
          {Array.from(ROUTES.values()).map(({iconUrl, path, title}) => (
            <Link activeClassName="active" href={path}>
              <img class="svgIcon" src={iconUrl} alt={title}></img>
            </Link>
          ))}
        </footer>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
