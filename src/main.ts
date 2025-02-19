#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { createInterface } from 'node:readline/promises';
import { config } from './config/config.js';
import { fetchPrompt } from './prompts/fetch.prompt.js';
import { fetchTool } from './tools/fetch.tool.js';

const server = new McpServer({
  name: 'mcp-fetch-node',
  version: '1.x.x',
});

server.tool(
  fetchTool.name,
  fetchTool.description,
  fetchTool.parameters,
  fetchTool.execute,
);

server.prompt(
  fetchPrompt.name,
  fetchPrompt.description,
  fetchPrompt.parameters,
  fetchPrompt.execute,
);

const app = express();

const transports = new Map<string, SSEServerTransport>();

app.get('/sse', async (_req, res) => {
  const transport = new SSEServerTransport(`/messages`, res);

  transports.set(transport.sessionId, transport);

  await server.connect(transport);

  res.on('close', () => {
    transport.close().catch((err: unknown) => {
      console.error(err);
    });
    transports.delete(transport.sessionId);
  });
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  const transport = transports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: 'Transport not found' });
    return;
  }

  await transport.handlePostMessage(req, res);
});

const expressServer = app.listen(config.port);

console.log(`Server is running on port ${config.port.toString()}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cleanup = async () => {
  expressServer.close();
  await server.close();
  rl.close();
};

await rl.question('Press enter to exit...\n');

await cleanup();
