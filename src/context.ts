import {createContext} from 'preact';
import {StateUpdater} from 'preact/hooks';

import {Value} from './lib/idb';

// @ts-ignore-error
export const SubscribedPlaylists = createContext<Value[]>();
// @ts-ignore-error
export const SetSubscribedPlaylists = createContext<StateUpdater<Value[]>>();
