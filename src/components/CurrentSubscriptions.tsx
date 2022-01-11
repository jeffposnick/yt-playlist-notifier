import {useContext} from 'preact/hooks';

import {SubscriptionsContext} from '../context';

export function CurrentSubscriptions() {
  const [subscribedPlaylists] = useContext(SubscriptionsContext);

  return (
    <>
      <p>You're currently getting updates to:</p>
      <ul>
        {subscribedPlaylists.map(({playlistItem}) => (
          <li>{playlistItem.snippet.title}</li>
        ))}
      </ul>
    </>
  );
}
