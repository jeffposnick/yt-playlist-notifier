import {PlaylistItemList} from './youtube';

export async function requestPermission() {
  return await Notification.requestPermission();
}

export async function showNotification(video: PlaylistItemList.Item) {
  const notification = new Notification(video.snippet.title, {
    body: video.snippet.description,
    icon: video.snippet.thumbnails.high.url,
  });

  notification.addEventListener('click', () => {
    window.open(`https://youtu.be/${video.snippet.resourceId.videoId}`);
  });
}
