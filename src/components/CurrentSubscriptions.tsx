import {Value} from '../lib/idb';

export function CurrentSubscriptions({
  subscribedPlaylists,
}: {
  subscribedPlaylists: Array<Value>;
}) {
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
