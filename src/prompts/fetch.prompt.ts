import { PromptCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DEFAULT_USER_AGENT_MANUAL } from '../constants.js';
import { cache } from '../utils/lru-cache.js';
import { processURL } from '../utils/process-url.js';
import { config } from '../config/config.js';

const name = 'fetch';

const description = 'Fetch a URL and extract its contents as markdown';

const parameters = {
  url: z.string().describe('URL to fetch.'),
};

const execute: PromptCallback<typeof parameters> = async ({ url }) => {
  const userAgent = config['user-agent'] ?? DEFAULT_USER_AGENT_MANUAL;

  const cacheKey = `${url}||${userAgent}||false`;

  const cached = cache.get(cacheKey);

  let content, prefix;

  if (cached) {
    [content, prefix] = cached;
  } else {
    [content, prefix] = await processURL(url, userAgent, false);

    cache.set(cacheKey, [content, prefix]);
  }

  const result = [prefix, content].join('\n').trim();

  return {
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: result },
      },
    ],
  };
};

export const fetchPrompt = {
  name,
  description,
  parameters,
  execute,
};
