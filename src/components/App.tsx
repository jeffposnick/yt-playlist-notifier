import {useState} from 'preact/hooks';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {update} from '../lib/update';
import {SubscriptionsContext} from '../context';

export function App() {
  const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
    [],
  );
  getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));

  return (
    <SubscriptionsContext.Provider
      value={[subscribedPlaylists, setSubscribedPlaylists]}
    >
      <h1>YT Playlist Notifier</h1>
      <CurrentSubscriptions />
      <button onClick={update}>Check for Updates</button>
      <PlaylistSearchForm />
    </SubscriptionsContext.Provider>
  );
}
