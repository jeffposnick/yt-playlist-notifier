export namespace PlaylistSearch {
  export interface Results {
    kind: string;
    etag: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
  }

  export interface Item {
    kind: ItemKind;
    etag: string;
    id: ID;
    snippet: Snippet;
  }

  export interface ID {
    kind: IDKind;
    playlistId: string;
  }

  export enum IDKind {
    YoutubePlaylist = 'youtube#playlist',
  }

  export enum ItemKind {
    YoutubeSearchResult = 'youtube#searchResult',
  }

  export interface Snippet {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: LiveBroadcastContent;
    publishTime: Date;
  }

  export enum LiveBroadcastContent {
    None = 'none',
  }

  export interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
  }

  export interface Default {
    url: string;
    width: number;
    height: number;
  }

  export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }
}

export namespace PlaylistItemList {
  export interface Results {
    kind: string;
    etag: string;
    items: Item[];
    pageInfo: PageInfo;
  }

  export interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
  }

  export interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: ResourceID;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  }

  export interface ResourceID {
    kind: string;
    videoId: string;
  }

  export interface Thumbnails {
    default: Default;
    medium: Default;
    high: Default;
    standard: Default;
    maxres: Default;
  }

  export interface Default {
    url: string;
    width: number;
    height: number;
  }

  export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }
}

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';
const SEARCH_URL = BASE_URL + 'search';
const PLAYLIST_ITEMS_URL = BASE_URL + 'playlistItems';

export async function playlistSearch(searchTerm: string) {
  const url = new URL(SEARCH_URL);
  url.searchParams.set('key', import.meta.env.VITE_YT_API_KEY);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', searchTerm);
  url.searchParams.set('type', 'playlist');

  const response = await fetch(url.href);
  const results = (await response.json()) as PlaylistSearch.Results;
  return results.items;
}

export async function getPlaylistItems(playlistID: string) {
  const url = new URL(PLAYLIST_ITEMS_URL);
  url.searchParams.set('key', import.meta.env.VITE_YT_API_KEY);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', playlistID);

  const response = await fetch(url.href);
  const results = (await response.json()) as PlaylistItemList.Results;
  return results.items;
}
