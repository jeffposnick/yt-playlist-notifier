import {get, set} from 'idb-keyval';
import {PlaylistItemList} from './youtube';

const SUBSCRIPTIONS = 'subscriptions';

export async function getSubscribedPlaylists() {
  return (await get<Set<string>>(SUBSCRIPTIONS)) || new Set<string>();
}

export async function addSubscribedPlaylist(playlistID: string) {
  const subscriptions = await getSubscribedPlaylists();
  subscriptions.add(playlistID);
  await set(SUBSCRIPTIONS, subscriptions);
}

export async function removeSubscribedPlaylist(playlistID: string) {
  const subscriptions = await getSubscribedPlaylists();
  subscriptions.delete(playlistID);
  await set(SUBSCRIPTIONS, subscriptions);
}

export async function setPlaylistItems(
  playlistID: string,
  playlistItems: Array<PlaylistItemList.Item>,
) {
  await set(playlistID, playlistItems);
}

export async function getSavedPlaylistItems(playlistID: string) {
  return (await get(playlistID)) as Array<PlaylistItemList.Item>;
}
