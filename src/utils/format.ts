import TurndownService from 'turndown';
// @ts-expect-error : missing types
import turndownPluginGfm from 'turndown-plugin-gfm';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

export class FormatError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'FormatError';
  }
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  hr: '\n',
});

const tables = turndownPluginGfm.tables as TurndownService.Plugin;

turndownService.use(tables);

turndownService.addRule('pre', {
  filter: 'pre',
  replacement: (content) => {
    return `\`\`\`\n${content}\n\`\`\``;
  },
});

turndownService.addRule('a', {
  filter: 'a',
  replacement: (_content, node) => {
    return node.href && node.innerText.trim()
      ? `[${node.innerText.trim()}](${node.href})`
      : '';
  },
});

export function format(html: string): string {
  try {
    return turndownService.turndown(html);
  } catch (error) {
    throw new FormatError('Failed to convert HTML to Markdown', error);
  }
}
