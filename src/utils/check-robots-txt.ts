import { URL } from 'url';
import robotsParser, { Robot } from 'robots-parser';

export class RobotsTxtError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'RobotsTxtError';
  }
}

export async function checkRobotsTxt(
  targetUrl: string,
  userAgent: string,
): Promise<void> {
  // TODO: check if the targetUrl is a valid URL
  const { protocol, host } = new URL(targetUrl);

  const robotsTxtUrl = `${protocol}//${host}/robots.txt`;

  try {
    const response = await fetch(robotsTxtUrl, {
      headers: { 'User-Agent': userAgent },
      redirect: 'follow',
    });

    if (response.status === 401 || response.status === 403) {
      throw new RobotsTxtError(
        `When fetching robots.txt (${robotsTxtUrl}), received status ${response.status.toString()} so assuming that autonomous fetching is not allowed, the user can try manually fetching by using the fetch prompt`,
      );
    } else if (response.status >= 400 && response.status < 500) {
      return;
    }

    const robotTxt = await response.text();

    const processedRobotTxt = robotTxt
      .split('\n')
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n');

    // @ts-expect-error : bad types
    const robotsTxt = robotsParser(robotsTxtUrl, processedRobotTxt) as Robot;

    if (robotsTxt.isDisallowed(targetUrl, userAgent)) {
      throw new RobotsTxtError(
        `The sites robots.txt (${robotsTxtUrl}), specifies that autonomous fetching of this page is not allowed, ` +
          `<useragent>${userAgent}</useragent>\n` +
          `<url>${targetUrl}</url>` +
          `<robots>\n${robotTxt}\n</robots>\n` +
          `The assistant must let the user know that it failed to view the page. The assistant may provide further guidance based on the above information.\n` +
          `The assistant can tell the user that they can try manually fetching the page by using the fetch prompt within their UI.`,
      );
    }
  } catch (error) {
    if (error instanceof RobotsTxtError) {
      throw error;
    }
    throw new RobotsTxtError(`Failed to verify ${robotsTxtUrl}`, {
      cause: error,
    });
  }
}
