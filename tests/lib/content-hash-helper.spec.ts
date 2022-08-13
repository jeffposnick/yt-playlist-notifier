import {test, expect} from '@playwright/test';

import {ContentHashHelper} from '../../lib/content-hash-helper';

test('Adding a hash works with defaults', async () => {
	const helper = new ContentHashHelper();

	const withHash = helper.addHash(
		`http://localhost:3000/main.[hash].js?willnotreplace=[hash]`,
		'abcd1234',
	);
	expect(withHash).toBe(
		'http://localhost:3000/main.abcd1234.js?willnotreplace=[hash]',
	);
});

test('Adding a hash works with explicit config', async () => {
	const helper = new ContentHashHelper({placeholder: '[custom-placeholder]'});

	const withHash = helper.addHash(
		`http://localhost:3000/main.[custom-placeholder].js?willnotreplace=[hash]`,
		'abcd1234',
	);
	expect(withHash).toBe(
		'http://localhost:3000/main.abcd1234.js?willnotreplace=[hash]',
	);
});

test('Removing a hash works with defaults', async () => {
	const helper = new ContentHashHelper();

	const noHash = helper.removeHash('http://localhost:3000/main.abcd1234.js');
	expect(noHash).toBe('http://localhost:3000/main.[hash].js');

	const noHashWBRevision = helper.removeHash(
		'http://localhost:3000/index.html?__WB_REVISION__=abb15c1ff1c0eaa557d218a26bf9b1b5',
	);
	expect(noHashWBRevision).toBe(
		'http://localhost:3000/index.html?__WB_REVISION__=[hash]',
	);
});

test('Removing a hash works with custom regexps', async () => {
	const helper = new ContentHashHelper({
		regexps: [new RegExp('~([A-Z]{4})~', 'd')],
	});

	const noHash = helper.removeHash(
		'http://localhost:3000/ignore.abcd1234.this/main~WXYZ~js',
	);
	expect(noHash).toBe(
		'http://localhost:3000/ignore.abcd1234.this/main~[hash]~js',
	);
});

test('Removing a hash works with custom regexps and placeholders', async () => {
	const helper = new ContentHashHelper({
		placeholder: '(custom-placeholder)',
		regexps: [new RegExp('~([A-Z]{4})~', 'd')],
	});

	const noHash = helper.removeHash(
		'http://localhost:3000/ignore.abcd1234.this/main~WXYZ~js',
	);
	expect(noHash).toBe(
		'http://localhost:3000/ignore.abcd1234.this/main~(custom-placeholder)~js',
	);
});

test('removeHash() throws an exception when the matching RegExp does not have match indices enabled', async () => {
	const helper = new ContentHashHelper({
		regexps: [new RegExp('\\.([0-9a-f]{4})\\.')],
	});

	expect(() =>
		helper.removeHash('http://localhost:3000/main.abcd.js'),
	).toThrow();
});

test('removeHash() throws an exception when the matching RegExp does not have any capture groups', async () => {
	const helper = new ContentHashHelper({
		regexps: [new RegExp('\\.[0-9a-f]{4}\\.', 'd')],
	});

	expect(() =>
		helper.removeHash('http://localhost:3000/main.abcd.js'),
	).toThrow();
});
