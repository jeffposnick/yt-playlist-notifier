export namespace PlaylistList {
  export interface Results {
    kind: string;
    etag: string;
    pageInfo: PageInfo;
    items: Item[];
  }

  export interface Item {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
  }

  export interface Snippet {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    localized: Localized;
  }

  export interface Localized {
    title: string;
    description: string;
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
    kind: string;
    etag: string;
    id: ID;
    snippet: Snippet;
  }

  export interface ID {
    kind: string;
    playlistId: string;
  }

  export interface Snippet {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: Date;
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
    title?: string;
    description?: string;
    thumbnails: Thumbnails;
    channelTitle?: string;
    playlistId: string;
    position: number;
    resourceId: ResourceID;
    videoOwnerChannelTitle?: string;
    videoOwnerChannelId?: string;
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

export type PlaylistItemLike = PlaylistList.Item | PlaylistSearch.Item;

const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/';
const PLAYLIST_LIST_URL = BASE_URL + 'playlists';
const SEARCH_URL = BASE_URL + 'search';
const PLAYLIST_ITEMS_URL = BASE_URL + 'playlistItems';

async function fetchAPI<T>(
  url: string,
  params: Record<string, string>,
): Promise<T> {
  const urlObj = new URL(url);
  urlObj.searchParams.set('key', import.meta.env.VITE_YT_API_KEY);
  urlObj.searchParams.set('maxResults', '50');
  urlObj.searchParams.set('part', 'snippet');
  for (const [key, value] of Object.entries(params)) {
    urlObj.searchParams.set(key, value);
  }

  const response = await fetch(urlObj.href);
  const json = await response.json();

  if (response.ok) {
    return json as T;
  }
  throw new Error(JSON.stringify(json, null, 2));
}

export async function playlistList(playlistID: string) {
  const results = await fetchAPI<PlaylistList.Results>(PLAYLIST_LIST_URL, {
    id: playlistID,
  });
  return results.items;
}

export async function playlistSearch(searchTerm: string) {
  const results = await fetchAPI<PlaylistSearch.Results>(SEARCH_URL, {
    q: searchTerm,
    type: 'playlist',
  });
  return results.items;
}

export async function getPlaylistItems(playlistID: string) {
  const results = await fetchAPI<PlaylistItemList.Results>(PLAYLIST_ITEMS_URL, {
    playlistId: playlistID,
  });
  return results.items;
}

export function getPlaylistID(item: PlaylistItemLike) {
  return typeof item.id === 'string' ? item.id : item.id.playlistId;
}
