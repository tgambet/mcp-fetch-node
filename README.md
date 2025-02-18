# Fetch MCP Server

A port of the official [Fetch MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) for Node.js.

> [!WARNING]
> This project is a work in progress and may present issues.
>
> Please report any to the [issue tracker](https://github.com/tgambet/mcp-fetch-node/issues).

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

```json
"mcpServers": {
  "fetch": {
    "command": "npx",
    "args": ["-y", "mcp-fetch-node"]
  }
}
```

<!-- ```json
"mcpServers": {
  "fetch": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "tgambet/mcp-fetch-node"]
  }
}
``` -->

### Customization - robots.txt

By default, the server will obey a websites robots.txt file if the request came from the model (via a tool), but not if the request was user initiated (via a prompt). This can be disabled by adding the argument `--ignore-robots-txt` to the `args` list in the configuration.

### Customization - User-agent

By default, depending on if the request came from the model (via a tool), or was user initiated (via a prompt), the server will use either the user-agent

```
ModelContextProtocol/1.0 (Autonomous; +https://github.com/tgambet/mcp-fetch-node)
```

or

```
ModelContextProtocol/1.0 (User-Specified; +https://github.com/tgambet/mcp-fetch-node)
```

This can be customized by adding the argument `--user-agent=YourUserAgent` to the `args` list in the configuration.

## Features

- [x] Fetch and extract content from a URL
- [x] Respect `robots.txt` (can be disabled)
- [x] User-Agent customization
- [x] Relevant content extraction
- [x] Raw content or markdown conversion
- [x] Pagination
- [x] In-memory cache for pagination
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
pnpm inspect
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## TODO

- [ ] Explain key differences with the original mcp/fetch tool
- [ ] Add user logs and progress
- [ ] Add tests
- [ ] Add documentation & examples
- [ ] Performance benchmarks and improvements
- [ ] Benchmarks for extraction quality: cf https://github.com/adbar/trafilatura/blob/master/tests/comparison_small.py
- [ ] Showcase on FastMCP and MCP repositories
