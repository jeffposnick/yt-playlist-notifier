import {getPlaylistItems, PlaylistItemList} from './youtube';
import {getSubscribedPlaylists, getSavedPlaylistItems} from './idb';
import {showNotification} from './notifications';

function findNewItems(
  oldItems: Array<PlaylistItemList.Item>,
  latestItems: Array<PlaylistItemList.Item>,
) {
  const oldVideoIDs = new Set<string>();
  for (const item of oldItems) {
    oldVideoIDs.add(item.snippet.resourceId.videoId);
  }

  return latestItems.filter(
    (item) => !oldVideoIDs.has(item.snippet.resourceId.videoId),
  );
}

export async function update() {
  const subscribedPlaylists = await getSubscribedPlaylists();
  for (const playlistID of subscribedPlaylists) {
    const oldItems = await getSavedPlaylistItems(playlistID);
    const latestResults = await getPlaylistItems(playlistID);
    const newItems = findNewItems(oldItems, latestResults.items);
    for (const item of newItems) {
      showNotification(item);
    }
    // setPlaylistItems()
  }
}
