#!/usr/bin/env node

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
    version: '0.0.0', // TODO: use package.json version?
  });

  server.on('connect', (event) => {
    console.log('Client connected');
    event.session.on('error', (event) => {
      console.error('Session error:', event.error);
    });
  });

  server.on('disconnect', () => {
    console.log('Client disconnected');
  });

  server.addTool(fetchTool(userAgent, ignoreRobotsTxt));

  server.addPrompt(fetchPrompt(userAgent));

  await server.start({
    transportType: 'sse',
    sse: {
      endpoint: '/sse',
      port: 8080, // TODO: make this configurable
    },
  });
}

await serve();
