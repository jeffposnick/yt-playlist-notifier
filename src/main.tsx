if (import.meta.env.MODE === 'development') {
	// @ts-ignore
	import('preact/debug');
}

import {render} from 'preact';

import './index.css';
import {App} from './components/App.js';
import {initSW} from './lib/sw-helpers.js';

render(<App />, document.getElementById('app')!);

if (import.meta.env.MODE !== 'development') {
	initSW();
}
