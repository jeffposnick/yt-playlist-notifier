import {render} from 'preact';
import {App} from './components/App';
import './index.css';

render(<App />, document.getElementById('app')!);

if (import.meta.env.MODE === 'production') {
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  });
}
