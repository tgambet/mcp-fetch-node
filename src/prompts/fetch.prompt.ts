import { UserError } from 'fastmcp';
import { DEFAULT_USER_AGENT_MANUAL } from '../constants.js';
import { cache } from '../utils/lru-cache.js';
import { processURL } from '../utils/process-url.js';

export const fetchPrompt = (userAgent?: string) => ({
  name: 'fetch',
  description: 'Fetch a URL and extract its contents as markdown',
  arguments: [
    {
      name: 'url',
      description: 'URL to fetch',
      required: true,
    },
  ],
  load: async ({ url }: { url?: string }) => {
    if (!url) {
      throw new UserError('Missing required argument: url');
    }

    const ua = userAgent ?? DEFAULT_USER_AGENT_MANUAL;

    const cacheKey = `${url}||${ua}||false`;

    const cached = cache.get(cacheKey);

    let content, prefix;

    if (cached) {
      [content, prefix] = cached;
    } else {
      [content, prefix] = await processURL(url, ua, false);

      cache.set(cacheKey, [content, prefix]);
    }

    return [prefix, content].join('\n').trim();
  },
});
