import {useAsync} from 'react-async-hook';

import {VideoItem} from './VideoItem';
import {getSubscribedPlaylists} from '../lib/idb';
import {PlaylistItemList} from '../lib/youtube';

async function getNewestVideos() {
  const allVideos: Array<PlaylistItemList.Item> = [];
  const subscribedPlaylists = await getSubscribedPlaylists();
  for (const playlist of subscribedPlaylists) {
    for (const video of playlist.videos) {
      allVideos.push(video);
    }
  }

  return allVideos
    .sort((a, b) => {
      return b.snippet.publishedAt.localeCompare(a.snippet.publishedAt);
    })
    .slice(0, 5);
}

export function LatestVideos() {
  const asyncNewestVideos = useAsync(getNewestVideos, []);

  return (
    <>
      <h4>Newest videos:</h4>
      <div class="card-container">
        {asyncNewestVideos.result &&
          asyncNewestVideos.result.map((item) => <VideoItem item={item} />)}
      </div>
    </>
  );
}
