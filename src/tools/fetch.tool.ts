import { z } from 'zod';
import { DEFAULT_USER_AGENT_AUTONOMOUS } from '../constants.js';
import { checkRobotsTxt } from '../utils/check-robots-txt.js';
import { cache } from '../utils/lru-cache.js';
import { paginate } from '../utils/paginate.js';
import { processURL } from '../utils/process-url.js';

export const fetchToolSchema = z.object({
  url: z.string().describe('URL to fetch.'),
  max_length: z
    .number()
    .min(0)
    .max(1000000)
    .default(5000)
    .describe('Maximum number of characters to return.'),
  start_index: z
    .number()
    .min(0)
    .default(0)
    .describe(
      'Return output starting at this character index, useful if a previous fetch was truncated and more context is required.',
    ),
  raw: z
    .boolean()
    .default(false)
    .describe(
      'Get the actual HTML content of the requested page, without simplification.',
    ),
});

export const fetchTool = (userAgent?: string, ignoreRobotsTxt?: boolean) => ({
  name: 'fetch',
  description: `Fetches a URL from the internet and optionally extracts its contents as markdown.

This tool grants you internet access. You can fetch the most up-to-date information and let the user know that.`,
  parameters: fetchToolSchema,
  execute: async ({
    url,
    max_length,
    start_index,
    raw,
  }: z.infer<typeof fetchToolSchema>) => {
    const ua = userAgent ?? DEFAULT_USER_AGENT_AUTONOMOUS;

    const cacheKey = `${url}||${ua}||${raw.toString()}`;

    const cached = cache.get(cacheKey);

    let content, prefix;

    if (cached) {
      [content, prefix] = cached;
    } else {
      if (!ignoreRobotsTxt) await checkRobotsTxt(url, ua);

      [content, prefix] = await processURL(url, ua, raw);

      cache.set(cacheKey, [content, prefix]);
    }

    return paginate(url, content, prefix, start_index, max_length);
  },
});
