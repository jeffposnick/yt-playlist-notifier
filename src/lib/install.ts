import {useEffect, useState} from 'preact/hooks';

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
}

// The beforeinstallprompt event can fire before any component that cares
// about it has mounted, so capture it at module load time.
let deferredPrompt: BeforeInstallPromptEvent | undefined;
const listeners = new Set<() => void>();

const notifyListeners = () => {
	for (const listener of listeners) {
		listener();
	}
};

window.addEventListener('beforeinstallprompt', (event) => {
	event.preventDefault();
	deferredPrompt = event as BeforeInstallPromptEvent;
	notifyListeners();
});

window.addEventListener('appinstalled', () => {
	deferredPrompt = undefined;
	notifyListeners();
});

export function useInstallState() {
	const [, setVersion] = useState(0);

	useEffect(() => {
		const listener = () => setVersion((version) => version + 1);
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}, []);

	const install = async () => {
		if (!deferredPrompt) {
			return;
		}
		await deferredPrompt.prompt();
		deferredPrompt = undefined;
		notifyListeners();
	};

	return {
		canInstall: deferredPrompt !== undefined,
		install,
		isInstalled: window.matchMedia('(display-mode: standalone)').matches,
	};
}
