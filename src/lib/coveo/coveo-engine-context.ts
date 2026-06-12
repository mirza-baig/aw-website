import { SearchEngine } from '@coveo/headless';
import { createContext } from 'react';

export const CoveoEngineContext = createContext<SearchEngine | undefined>(undefined);
