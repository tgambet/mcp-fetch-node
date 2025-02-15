import { UserError } from 'fastmcp';
import { DEFAULT_USER_AGENT_MANUAL } from '../constants.js';
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
    const [content, prefix] = await processURL(url, ua, false);
    return [prefix, content].join('\n');
  },
});
