import { minify } from 'html-minifier';
import { parseHTML } from 'linkedom';
import sanitizeHtml from 'sanitize-html';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export class ExtractError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'ExtractError';
  }
}

export const preProcessHtml = (html: string) => {
  return html
    .replace(/<style[^>]*?\/?>([\S\s]*?)<\/style>/gim, '')
    .replace(/<script[^>]*?\/?>([\S\s]*?)<\/script>/gim, '')
    .replace(/<template[^>]*?\/?>([\S\s]*?)<\/template>/gim, '');
};

const nodesToRemove = [
  'template',
  'img',
  'svg',
  'nav',
  'footer',
  'header',
  'head',
  'button',
  'form',
  'input',
  'textarea',
  'select',
];

export function extract(html: string) {
  try {
    // Pre-sanitize the HTML
    let result = preProcessHtml(html);

    // Sanitize the HTML
    result = sanitizeHtml(result, {
      allowedTags: [
        'html',
        'body',
        ...sanitizeHtml.defaults.allowedTags,
        ...nodesToRemove,
      ],
      allowedAttributes: {
        '*': ['hidden', 'class', 'type', 'aria-hidden', 'href'],
      },
      disallowedTagsMode: 'completelyDiscard',
    });

    // Parse the HTML
    const { document } = parseHTML(result);

    // Remove unwanted elements
    document.body
      .querySelectorAll(
        [
          '[hidden]',
          '[aria-hidden]',
          '[type="button"]',
          '.hide-sm',
          '.sr-only',
          '.d-none',
          '.d-sm-none',
          // TODO check popular CSS frameworks classes
          ...nodesToRemove,
        ].join(', '),
      )
      ?.forEach((a: any) => a.remove());

    // Remove nav-liked lists
    document.querySelectorAll('ul, table, section').forEach((node: any) => {
      const list = node.cloneNode(true);
      list.querySelectorAll('a').forEach((a: any) => {
        a.innerHTML = '';
      });
      const htmlLength = list.innerHTML.length;
      const textLength = list.innerText.length;
      if (textLength / htmlLength < 0.2) node.remove();
    });

    // Remove empty links
    document.querySelectorAll('a').forEach((a: any) => {
      if (a.textContent.trim() === '') {
        a.remove();
      }
    });

    // Sanitize again
    result = sanitizeHtml(document.body.innerHTML as string, {
      allowedAttributes: { a: ['href'] },
    });

    // Minify
    result = minify(result, {
      collapseWhitespace: true,
      preserveLineBreaks: false,
      decodeEntities: true,
      conservativeCollapse: false,
      collapseInlineTagWhitespace: false,
      removeEmptyElements: true,
    });

    return result;
  } catch (error) {
    if (error instanceof ExtractError) {
      throw error;
    }
    throw new ExtractError('Failed to extract content', error);
  }
}
