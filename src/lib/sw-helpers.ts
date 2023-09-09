import {UPDATE_CHECK} from '../constants.js';

interface PeriodicSyncManager {
	register(tag: string, options?: {minInterval: number}): Promise<void>;
}

declare global {
	interface ServiceWorkerRegistration {
		readonly periodicSync: PeriodicSyncManager;
	}
}

export function initSW() {
	window.addEventListener('load', () => {
		if ('serviceWorker' in navigator) {
			void navigator.serviceWorker.register('/sw.js');

			if (navigator.serviceWorker.controller) {
				navigator.serviceWorker.addEventListener('controllerchange', () => {
					window.location.reload();
				});
			}

			void navigator.serviceWorker.ready.then(async (registration) => {
				if ('periodicSync' in registration) {
					const status = await navigator.permissions.query({
						// @ts-expect-error periodicsync is not included in the default SW interface.
						name: 'periodic-background-sync',
					});

					if (status.state === 'granted') {
						await registration.periodicSync.register(UPDATE_CHECK, {
							minInterval: 24 * 60 * 60 * 1000,
						});
					}
				}

				document.addEventListener('visibilitychange', () => {
					console.debug({
						visibiltyChange: JSON.stringify(document.visibilityState),
					});
					if (document.visibilityState !== 'hidden') {
						navigator.serviceWorker.controller?.postMessage(UPDATE_CHECK);
						void registration.update();
					}
				});
			});
		}
	});
}
