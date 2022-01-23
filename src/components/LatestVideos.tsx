import {FunctionalComponent} from 'preact';
import {useContext} from 'preact/hooks';
import {useAsync} from 'react-async-hook';

import {getSubscribedPlaylists} from '../lib/idb';
import {NUMBER_OF_LATEST_VIDEOS, ROUTES} from '../constants';
import {PlaylistItemList} from '../lib/youtube';
import {SubscribedPlaylists} from './context';
import {VideoItem} from './VideoItem';

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
    .slice(0, NUMBER_OF_LATEST_VIDEOS);
}

export const LatestVideos: FunctionalComponent = () => {
  const subscribedPlaylists = useContext(SubscribedPlaylists);
  const asyncNewestVideos = useAsync(getNewestVideos, [subscribedPlaylists]);

  return (
    <>
      <h4>Videos from subscriptions:</h4>
      <div class="card-container">
        {asyncNewestVideos.result &&
          (asyncNewestVideos.result.length === 0 ? (
            <p>
              <a href={ROUTES.get('SEARCH')?.path}>Find and subscribe</a> to a
              playlist with videos to get started.
            </p>
          ) : (
            asyncNewestVideos.result.map((item) => <VideoItem item={item} />)
          ))}
      </div>
    </>
  );
};
