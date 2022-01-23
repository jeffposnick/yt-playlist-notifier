/// <reference path="../../markdown.d.ts" />

import {FunctionalComponent} from 'preact';
import {ReactComponent} from '../../README.md';

export const About: FunctionalComponent = () => {
  return (
    <>
      <p>
        <a href="https://github.com/jeffposnick/yt-playlist-notifier">
          View on GitHub.
        </a>
      </p>
      <ReactComponent />
    </>
  );
};
