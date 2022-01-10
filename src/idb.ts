import {get, set} from 'idb-keyval';

const SUBSCRIPTIONS = 'subscriptions';

export async function getSubscribedPlaylists(): Promise<Set<string>> {
  return (await get<Set<string>>(SUBSCRIPTIONS)) || new Set<string>();
}

export async function addSubscribedPlaylist(playlistID: string): Promise<void> {
  const subscriptions = await getSubscribedPlaylists();
  subscriptions.add(playlistID);
  await set(SUBSCRIPTIONS, subscriptions);
}

export async function removeSubscribedPlaylist(
  playlistID: string,
): Promise<void> {
  const subscriptions = await getSubscribedPlaylists();
  subscriptions.delete(playlistID);
  await set(SUBSCRIPTIONS, subscriptions);
}

export async function setPlaylistItems(playlistID: string, playlistItems: any) {
  await set(playlistID, playlistItems);
}
