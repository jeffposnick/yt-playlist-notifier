if (import.meta.env.MODE === 'development') {
	import('preact/debug');
}

import {render} from 'preact';

import './index.css';
import {App} from './components/App.js';
import {initSW} from './lib/sw-helpers.js';

const appEl = document.getElementById('app');
if (!appEl) {
	throw new Error('Missing #app element in HTML.');
}
render(<App />, appEl);

if (import.meta.env.MODE !== 'development') {
	initSW();
}
