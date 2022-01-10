import {Item} from '../types/PlaylistSearchResults';
import {get, set} from 'idb-keyval';

export function PlaylistItem(item: Item) {
  const handleClick = async () => {
    const currentSubscriptions =
      (await get<Array<string>>('subscriptions')) || [];
    currentSubscriptions.push(item.id.playlistId);
    await set('subscriptions', currentSubscriptions);
  };

  return (
    <li>
      <p dangerouslySetInnerHTML={{__html: item.snippet.title}}></p>
      <p
        dangerouslySetInnerHTML={{__html: `From ${item.snippet.channelTitle}`}}
      ></p>

      <button onClick={handleClick}>Notify</button>
    </li>
  );
}
