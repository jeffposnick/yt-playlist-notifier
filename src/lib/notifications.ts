import {PlaylistSearch, PlaylistItemList} from './youtube';

export async function requestPermission() {
  return await Notification.requestPermission();
}

export async function showNotification(
  playlistItem: PlaylistSearch.Item,
  video: PlaylistItemList.Item,
) {
  const notification = new Notification(video.snippet.title, {
    body: `A new video was added to '${playlistItem.snippet.title}'`,
    icon: video.snippet.thumbnails.high.url,
  });

  notification.addEventListener('click', () => {
    window.open(`https://youtu.be/${video.snippet.resourceId.videoId}`);
  });
}
