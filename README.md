# Fetch MCP Server

A port of the official [Fetch MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) for Node.js. Please check the [key differences with original project](#key-differences-with-the-original-project) section for more details.

## Description

A [Model Context Protocol](https://modelcontextprotocol.io/) server that provides web content fetching capabilities. This server enables LLMs to retrieve and process content from web pages, converting HTML to markdown for easier consumption.

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

`mcp-fetch-node` exposes an SSE endpoint at `/sse` on port 8080 by default.

Node.js:

```bash
npx -y mcp-fetch-node
```

Docker:

```bash
docker run -it tgambet/mcp-fetch-node
```

### Customization - robots.txt

By default, the server will obey a websites robots.txt file if the request came from the model (via a tool), but not if the request was user initiated (via a prompt). This can be disabled by adding the argument `--ignore-robots-txt` to the run command.

### Customization - User-agent

By default, depending on if the request came from the model (via a tool), or was user initiated (via a prompt), the server will use either the user-agent

```
# Tool call
ModelContextProtocol/1.0 (Autonomous; +https://github.com/tgambet/mcp-fetch-node)

# Prompt
ModelContextProtocol/1.0 (User-Specified; +https://github.com/tgambet/mcp-fetch-node)
```

This can be customized by adding the argument `--user-agent=YourUserAgent` to the run command, which will override both.

## Key differences with the original project

- This implementation is written in TypeScript and targets the Node.js runtime.
  It is suited for situations where python is not available.

- This implementation provides an SSE interface instead of stdio.
  It is more suitable for deployment as a web service, increasing portability.

- This implementation does not rely on Readability.js library for content extraction.
  It uses a custom implementation that is more generic and suited for websites other that news-related ones.

The api and tool description is, however, the same as the original project so you can try `mcp-fetch-node` as a drop-in replacement for the original project.

Please report any issue to the [issue tracker](https://github.com/tgambet/mcp-fetch-node/issues).

## Features

- Fetch and extract relevant content from a URL
- Respect `robots.txt` (can be disabled)
- User-Agent customization
- Markdown conversion
- Pagination

## Development

```bash
pnpm install
pnpm dev
pnpm lint:fix
pnpm format
pnpm test
pnpm build
pnpm start
pnpm inspect
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## TODO

- [ ] Add user logs and progress
- [ ] Add documentation & examples
- [ ] Performance benchmarks and improvements
- [ ] Benchmarks for extraction quality: cf https://github.com/adbar/trafilatura/blob/master/tests/comparison_small.py
