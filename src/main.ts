import { FastMCP } from 'fastmcp';
import { fetchPrompt } from './prompts/fetch.prompt.js';
import { fetchTool } from './tools/fetch.tool.js';
import { parseArgs } from './utils/parse-args.js';

const args = parseArgs();

const userAgent = args['user-agent'] as string | undefined;

const ignoreRobotsTxt = args['ignore-robots-txt'] as boolean | undefined;

export async function serve() {
  const server = new FastMCP({
    name: 'mcp-fetch-node',
    version: '0.0.1',
  });

  server.addTool(fetchTool(userAgent, ignoreRobotsTxt));

  server.addPrompt(fetchPrompt(userAgent));

  await server.start({
    transportType: 'sse',
    sse: {
      endpoint: '/sse',
      port: 8080,
    },
  });
}

await serve();
