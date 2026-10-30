import {useState} from 'preact/hooks';

export type NotificationStatus = NotificationPermission | 'unsupported';

export function getNotificationStatus(): NotificationStatus {
	return 'Notification' in window ? Notification.permission : 'unsupported';
}

export async function requestPermission(): Promise<NotificationStatus> {
	if (getNotificationStatus() !== 'default') {
		return getNotificationStatus();
	}

	try {
		return await Notification.requestPermission();
	} catch (e) {
		// Log error, but otherwise ignore.
		console.error(e);
		return getNotificationStatus();
	}
}

export function useNotificationStatus() {
	const [status, setStatus] = useState(getNotificationStatus);

	const request = async () => {
		setStatus(await requestPermission());
	};

	return {request, status};
}
