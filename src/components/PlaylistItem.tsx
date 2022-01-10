import {getPlaylistItems, PlaylistSearch} from '../youtube';
import {addSubscribedPlaylist, setPlaylistItems} from '../idb';

export function PlaylistItem(item: PlaylistSearch.Item) {
  const handleClick = async () => {
    await addSubscribedPlaylist(item.id.playlistId);
    const playlistItems = await getPlaylistItems(item.id.playlistId);
    await setPlaylistItems(item.id.playlistId, playlistItems);
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
