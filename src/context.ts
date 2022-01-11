import {createContext} from 'preact';
import {StateUpdater} from 'preact/hooks';

import {Value} from './lib/idb';

export const SubscriptionsContext =
  // We don't need to provide a default value here.
  // @ts-expect-error
  createContext<[Value[], StateUpdater<Value[]>]>();
