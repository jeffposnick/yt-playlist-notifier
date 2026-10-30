const STORAGE_KEY = 'last-visit';

// Read the previous visit's timestamp once, at startup, and then record this
// visit. Anything added to a playlist after the previous visit is "new".
function readAndUpdateLastVisit() {
	try {
		const previous = localStorage.getItem(STORAGE_KEY);
		localStorage.setItem(STORAGE_KEY, String(Date.now()));
		return previous ? Number(previous) : undefined;
	} catch {
		return undefined;
	}
}

const previousVisit = readAndUpdateLastVisit();

export function isNewSinceLastVisit(publishedAt: string) {
	return previousVisit !== undefined && Date.parse(publishedAt) > previousVisit;
}
