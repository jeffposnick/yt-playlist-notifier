import {CurrentSubscriptions} from './CurrentSubscriptions';
import {PlaylistSearchForm} from './PlaylistSearchForm';
import {update} from '../update';

export function App() {
  return (
    <>
      <h1>YT Playlist Notifier</h1>
      <CurrentSubscriptions />
      <button onClick={update}>Check for Updates</button>
      <PlaylistSearchForm />
    </>
  );
}
