export async function requestPermission() {
	try {
		await navigator.permissions?.query({
			name: 'notifications',
		});
	} catch (e) {
		// Log error, but otherwise ignore.
		console.error(e);
	}
}
