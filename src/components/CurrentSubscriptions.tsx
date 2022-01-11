import {useContext} from 'preact/hooks';

import {SubscribedPlaylists} from '../context';

export function CurrentSubscriptions() {
  const subscribedPlaylists = useContext(SubscribedPlaylists);

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
