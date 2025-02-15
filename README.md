# Fetch MCP Server

A port of [Fetch MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) for Node.js.

## Description

A Model Context Protocol server that provides web content fetching capabilities. This server enables LLMs to retrieve and process content from web pages, converting HTML to markdown for easier consumption.

The fetch tool will truncate the response, but by using the `start_index` argument, you can specify where to start the content extraction. This lets models read a webpage in chunks, until they find the information they need.

### Available Tools

- `fetch` - Fetches a URL from the internet and extracts its contents as markdown.
  - `url` (string, required): URL to fetch
  - `max_length` (integer, optional): Maximum number of characters to return (default: 5000)
  - `start_index` (integer, optional): Start content from this character index (default: 0)
  - `raw` (boolean, optional): Get raw content without markdown conversion (default: false)

### Available Prompts

- `fetch` - Fetch a URL and extract its contents as markdown
  - `url` (string, required): URL to fetch

## Usage

```json
"mcpServers": {
  "fetch": {
    "command": "npx",
    "args": ["mcp-fetch-node"]
  }
}
```

```json
"mcpServers": {
  "fetch": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "tgambet/mcp-fetch-node"]
  }
}
```

## Features

- [x] Fetch and extract content from a URL
- [x] Respect `robots.txt` (can be disabled)
- [x] User-Agent customization
- [x] Relevant content extraction
- [x] Raw content or markdown conversion
- [x] Pagination
- [ ] In-memory temporary cache for faster responses
- [ ] Logs and progress

## Development

```bash
pnpm install
pnpm dev
pnpm lint:fix
pnpm format
pnpm test
pnpm build
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## TODO

- [ ] Add LRU cache
- [ ] Publish to npm
- [ ] Dockerize and publish to docker hub
- [ ] Integrate semantic release
- [ ] Add user logs and progress
- [ ] Add tests
- [ ] Add documentation & examples
- [ ] Add benchmarks for extraction: cf https://github.com/adbar/trafilatura/blob/master/tests/comparison_small.py
