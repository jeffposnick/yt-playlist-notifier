import {useState} from 'preact/hooks';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {update} from '../lib/update';

export function App() {
  const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
    [],
  );
  getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));

  return (
    <>
      <h1>YT Playlist Notifier</h1>
      <CurrentSubscriptions
        subscribedPlaylists={subscribedPlaylists}
        setSubscribedPlaylists={setSubscribedPlaylists}
      />
      <button onClick={update}>Check for Updates</button>
      <PlaylistSearchForm setSubscribedPlaylists={setSubscribedPlaylists} />
    </>
  );
}
