export interface Results {
	kind: string;
	etag: string;
	pageInfo: PageInfo;
	items?: Item[];
}

export interface Item {
	kind: string;
	etag: string;
	id: string;
	snippet: Snippet;
	contentDetails: ContentDetails;
}

export interface Snippet {
	title: string;
	description: string;
	customUrl?: string;
	publishedAt: Date;
	thumbnails: Thumbnails;
}

export interface ContentDetails {
	relatedPlaylists: RelatedPlaylists;
}

export interface RelatedPlaylists {
	likes: string;
	uploads: string;
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
