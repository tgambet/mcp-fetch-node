import { createLRU } from 'lru.min';

// TODO: make this configurable
export const cache = createLRU<string, [string, string]>({ max: 50 });
