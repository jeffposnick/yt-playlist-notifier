import type {Page} from '@playwright/test';

import type {Value} from '../../src/lib/idb.js';

const DB_NAME = 'keyval-store';
const STORE_NAME = 'keyval';

/**
 * Writes directly into the same IndexedDB database/store that idb-keyval
 * uses under the hood, bypassing the UI so tests can set up subscription
 * state without exercising the search/subscribe flow every time.
 */
export async function seedSubscriptions(
	page: Page,
	entries: Record<string, Value>,
) {
	await page.evaluate(
		({dbName, storeName, entries}) => {
			return new Promise<void>((resolve, reject) => {
				const request = indexedDB.open(dbName);
				request.onupgradeneeded = () => {
					request.result.createObjectStore(storeName);
				};
				request.onsuccess = () => {
					const db = request.result;
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					for (const [key, value] of Object.entries(entries)) {
						store.put(value, key);
					}
					tx.oncomplete = () => {
						db.close();
						resolve();
					};
					tx.onerror = () =>
						reject(
							new Error(tx.error?.message ?? 'IndexedDB transaction failed'),
						);
				};
				request.onerror = () =>
					reject(new Error(request.error?.message ?? 'IndexedDB open failed'));
			});
		},
		{dbName: DB_NAME, storeName: STORE_NAME, entries},
	);
}
