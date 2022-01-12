import {createContext} from 'preact';
import {StateUpdater} from 'preact/hooks';

import {Value} from '../lib/idb';

export const SubscribedPlaylists = createContext<Value[] | undefined>(
  undefined,
);

export const SetSubscribedPlaylists = createContext<
  StateUpdater<Value[]> | undefined
>(undefined);
