/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import {getSubscribedPlaylists, setPlaylistItems} from '../lib/idb';
import {
  getPlaylistID,
  getPlaylistItems,
  PlaylistItemLike,
  PlaylistItemList,
} from '../lib/youtube';

async function showNotification(
  playlistItem: PlaylistItemLike,
  video: PlaylistItemList.Item,
) {
  self.registration.showNotification(video.snippet.title, {
    body: `A new video was added to '${playlistItem.snippet.title}'`,
    icon: video.snippet.thumbnails.high.url,
    tag: `https://youtu.be/${video.snippet.resourceId.videoId}`,
  });
}

function filterNewVideos(
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

async function getNewVideos() {
  const newVideos: Array<{
    playlistItem: PlaylistItemLike;
    video: PlaylistItemList.Item;
  }> = [];
  const playlists = await getSubscribedPlaylists();

  for (const {playlistItem, videos} of playlists) {
    const latestVideos = await getPlaylistItems(getPlaylistID(playlistItem));
    await setPlaylistItems(playlistItem, latestVideos);

    for (const video of filterNewVideos(videos, latestVideos)) {
      newVideos.push({playlistItem, video});
    }
  }

  return newVideos;
}

export async function checkForUpdates() {
  const newVideos = await getNewVideos();
  for (const {playlistItem, video} of newVideos) {
    showNotification(playlistItem, video);
  }
}
