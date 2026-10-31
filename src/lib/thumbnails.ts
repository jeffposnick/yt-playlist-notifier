interface Thumbnail {
	url: string;
	width: number;
}

type ThumbnailSet = Partial<
	Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', Thumbnail>
>;

// The 'high' and 'standard' sizes are 4:3 with letterboxing, which
// object-fit: cover crops back to 16:9, so every size works for a 16:9 slot.
const SIZES = ['medium', 'high', 'standard', 'maxres'] as const;

export function thumbnailSrcset(thumbnails: ThumbnailSet | undefined) {
	return SIZES.map((size) => thumbnails?.[size])
		.filter((thumbnail) => thumbnail !== undefined)
		.map(({url, width}) => `${url} ${width}w`)
		.join(', ');
}
