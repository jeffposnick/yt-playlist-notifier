import {getPlaylistItems, PlaylistItemList} from './youtube';
import {getSubscribedPlaylists, setPlaylistItems} from './idb';
import {showNotification} from './notifications';

function findNewVideos(
  previousItems: Array<PlaylistItemList.Item>,
  latestItems: Array<PlaylistItemList.Item>,
) {
  const oldVideoIDs = new Set<string>();
  for (const item of previousItems) {
    oldVideoIDs.add(item.snippet.resourceId.videoId);
  }

  return latestItems.filter(
    (item) => !oldVideoIDs.has(item.snippet.resourceId.videoId),
  );
}

export async function update() {
  const playlists = await getSubscribedPlaylists();
  for (const {playlistItem, videos} of playlists) {
    const latestVideos = await getPlaylistItems(playlistItem.id.playlistId);
    await setPlaylistItems(playlistItem, latestVideos);

    for (const video of findNewVideos(videos, latestVideos)) {
      showNotification(playlistItem, video);
    }
  }
}
