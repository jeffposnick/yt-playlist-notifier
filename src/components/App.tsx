import {useState, useEffect} from 'preact/hooks';

import {CurrentSubscriptions} from './CurrentSubscriptions';
import {getSubscribedPlaylists, Value} from '../lib/idb';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {SubscribedPlaylists, SetSubscribedPlaylists} from '../context';

export function App() {
  const [subscribedPlaylists, setSubscribedPlaylists] = useState<Array<Value>>(
    [],
  );

  useEffect(() => {
    getSubscribedPlaylists().then((value) => setSubscribedPlaylists(value));
  }, []);

  const handleClick = async () => {
    navigator.serviceWorker.controller?.postMessage('update-check');
  };

  return (
    <SetSubscribedPlaylists.Provider value={setSubscribedPlaylists}>
      <SubscribedPlaylists.Provider value={subscribedPlaylists}>
        <h2>YT Playlist Notifier</h2>
        <PlaylistSearchForm />
        <hr></hr>
        <CurrentSubscriptions />
        <button onClick={handleClick}>Check Now</button>
      </SubscribedPlaylists.Provider>
    </SetSubscribedPlaylists.Provider>
  );
}
