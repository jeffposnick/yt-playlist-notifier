import {render} from 'preact';

import './index.css';
import {App} from './components/App';
import {initSW} from './lib/sw-helpers';

render(<App />, document.getElementById('app')!);

if (import.meta.env.MODE !== 'development') {
  initSW();
}
