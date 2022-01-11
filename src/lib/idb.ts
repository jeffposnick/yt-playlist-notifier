import {get, set, values, del} from 'idb-keyval';
import {PlaylistItemList, PlaylistSearch} from './youtube';

export interface Value {
  playlistItem: PlaylistSearch.Item;
  videos: Array<PlaylistItemList.Item>;
}

export async function getSubscribedPlaylists() {
  return await values<Value>();
}

export async function removeSubscribedPlaylist(playlistID: string) {
  await del(playlistID);
}

export async function setPlaylistItems(
  playlistItem: PlaylistSearch.Item,
  videos: Array<PlaylistItemList.Item>,
) {
  await set(playlistItem.id.playlistId, {playlistItem, videos});
}

export async function getPlaylistInfo(playlistID: string) {
  return await get<Value>(playlistID);
}
