const formatter = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 365 * 24 * 60 * 60],
	['month', 30 * 24 * 60 * 60],
	['week', 7 * 24 * 60 * 60],
	['day', 24 * 60 * 60],
	['hour', 60 * 60],
	['minute', 60],
];

export function relativeTime(date: string | Date, now = Date.now()) {
	const seconds = (new Date(date).getTime() - now) / 1000;
	for (const [unit, unitSeconds] of UNITS) {
		if (Math.abs(seconds) >= unitSeconds) {
			return formatter.format(Math.round(seconds / unitSeconds), unit);
		}
	}
	return 'just now';
}
