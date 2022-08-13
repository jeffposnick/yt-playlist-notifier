// See https://github.com/microsoft/TypeScript/pull/46073/files#diff-e2f9169b6b66c0e336c413dec9b6df6b36a05051256073f8a9de542c08313126
declare global {
	interface RegExpExecArray {
		indices?: RegExpIndicesArray;
	}

	interface RegExpIndicesArray extends Array<[number, number]> {
		groups?: {
			[key: string]: [number, number];
		};
	}

	interface RegExp {
		readonly hasIndices: boolean;
	}
}

// See https://stackoverflow.com/a/3561711/385997
function escapeRegex(str: string) {
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function createRegexp({
	characters,
	size,
	before,
	after,
}: {
	characters: string;
	size: number;
	before: string;
	after: string;
}) {
	return new RegExp(
		`${escapeRegex(before)}(${characters}{${size}})${escapeRegex(after)}`,
		'd',
	);
}

export class ContentHashHelper {
	placeholder: string;
	regexps: Array<RegExp>;

	constructor({
		placeholder = '[hash]',
		regexps = [
			createRegexp({characters: '[0-9a-f]', size: 8, before: '.', after: '.'}),
			createRegexp({
				characters: '[0-9a-f]',
				size: 32,
				before: '__WB_REVISION__=',
				after: '',
			}),
		],
	}: {
		placeholder?: string;
		regexps?: Array<RegExp>;
	} = {}) {
		this.placeholder = placeholder;
		this.regexps = regexps;
	}

	removeHash(str: string) {
		for (const regexp of this.regexps) {
			if (!regexp.hasIndices) {
				throw new Error(
					`Match indices (https://v8.dev/features/regexp-match-indices) must ` +
						`be enabled on /${regexp.source}/`,
				);
			}

			const result = regexp.exec(str);
			if (result) {
				if (result.indices?.length !== 2) {
					throw new Error(
						`The matching regexp /${regexp.source}/ does not have exactly ` +
							`one capture group.`,
					);
				}

				const [start, end] = result.indices[1];
				return str.substring(0, start) + this.placeholder + str.substring(end);
			}
		}

		return str;
	}

	addHash(str: string, hash: string) {
		return str.replace(this.placeholder, hash);
	}
}
