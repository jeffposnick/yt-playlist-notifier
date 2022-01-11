import {useState, useEffect} from 'preact/hooks';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {update} from '../lib/update';
import {SubscribedPlaylists, SetSubscribedPlaylists} from '../context';

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
        <h1>YT Playlist Notifier</h1>
        <CurrentSubscriptions />
        <button onClick={update}>Check for Updates</button>
        <hr></hr>
        <PlaylistSearchForm />
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
