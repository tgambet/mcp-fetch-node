import { extract } from './extract.js';
import { format } from './format.js';
import { fetch } from './fetch.js';

function isHTML(content: string, contentType?: string | null): boolean {
  return contentType?.includes('text/html') ?? content.includes('<html');
}

export async function processURL(url: string, userAgent: string, raw: boolean) {
  const { content, contentType } = await fetch(url, userAgent);

  if (!raw && isHTML(content, contentType)) {
    const extracted = extract(content);
    const formatted = format(extracted);
    if (!formatted) {
      return ['<error>Page failed to be simplified from HTML</error>', ''];
    }
    return [formatted, ''];
  }

  if (raw) {
    return [content, `Here is the raw ${contentType ?? 'unknown'} content:`];
  }

  return [
    content,
    `Content type ${contentType ?? 'unknown'} cannot be simplified to markdown, but here is the raw content:`,
  ];
}
