import {get, set, values, del} from 'idb-keyval';
import {getPlaylistID, PlaylistItemLike, PlaylistItemList} from './youtube';

export interface Value {
  playlistItem: PlaylistItemLike;
  videos: Array<PlaylistItemList.Item>;
}

export async function getSubscribedPlaylists() {
  return await values<Value>();
}

export async function removeSubscribedPlaylist(playlistID: string) {
  await del(playlistID);
}

export async function setPlaylistItems(
  playlistItem: PlaylistItemLike,
  videos: Array<PlaylistItemList.Item>,
) {
  await set(getPlaylistID(playlistItem), {playlistItem, videos});
}

export async function getPlaylistInfo(playlistID: string) {
  return await get<Value>(playlistID);
}
