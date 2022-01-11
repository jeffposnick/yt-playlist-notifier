import {getSubscribedPlaylists} from '../lib/idb';
import {useAsync} from 'react-async-hook';

const getSubscriptions = async () => await getSubscribedPlaylists();

export function CurrentSubscriptions() {
  const subscriptions = useAsync(getSubscriptions, []);

  return (
    <>
      <p>You're currently getting updates to:</p>
      <ul>
        {subscriptions.result &&
          subscriptions.result.map(({playlistItem}) => (
            <li>{playlistItem.snippet.title}</li>
          ))}
      </ul>
    </>
  );
}
