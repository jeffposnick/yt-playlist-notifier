import {getPlaylistItems, PlaylistSearch} from '../lib/youtube';
import {requestPermission} from '../lib/notifications';
import {setPlaylistItems} from '../lib/idb';

export function PlaylistItem(item: PlaylistSearch.Item) {
  const handleClick = async () => {
    const playlistItems = await getPlaylistItems(item.id.playlistId);
    await setPlaylistItems(item, playlistItems);
    await requestPermission();
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
