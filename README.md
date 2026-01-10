# SalesDrive API

TypeScript client and MCP server for [SalesDrive CRM](https://salesdrive.ua) API.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

## Packages

| Package | Description | NPM |
|---------|-------------|-----|
| [@dannychirkov/salesdrive-api-client](packages/salesdrive-api-client) | TypeScript API client | [![npm](https://img.shields.io/npm/v/@dannychirkov/salesdrive-api-client)](https://www.npmjs.com/package/@dannychirkov/salesdrive-api-client) |
| [@dannychirkov/salesdrive-transport-fetch](packages/salesdrive-transport-fetch) | Fetch-based HTTP transport | [![npm](https://img.shields.io/npm/v/@dannychirkov/salesdrive-transport-fetch)](https://www.npmjs.com/package/@dannychirkov/salesdrive-transport-fetch) |
| [@dannychirkov/salesdrive-mcp-server](packages/salesdrive-mcp-server) | MCP server for AI assistants | [![npm](https://img.shields.io/npm/v/@dannychirkov/salesdrive-mcp-server)](https://www.npmjs.com/package/@dannychirkov/salesdrive-mcp-server) |

## Quick Start

### Using the API Client

```bash
npm install @dannychirkov/salesdrive-api-client @dannychirkov/salesdrive-transport-fetch
```

```typescript
import { createClient, orderService, referenceService } from '@dannychirkov/salesdrive-api-client';
import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';

// Create transport
const transport = createFetchTransport({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-account.salesdrive.me',
});

// Create client with services
const client = createClient({
  transport,
  apiKey: 'your-api-key',
  baseUrl: 'https://your-account.salesdrive.me',
})
  .extend(orderService)
  .extend(referenceService);

// Use the client
const orders = await client.orders.list({ limit: 10 });
console.log(orders.data);

const statuses = await client.reference.getStatuses();
console.log(statuses.data);
```

### Using with Claude (MCP Server)

Add to your Claude Desktop configuration (`~/.config/claude/mcp.json` or equivalent):

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me"
      }
    }
  }
}
```

Now you can ask Claude:
- "Show me the last 10 orders"
- "Create a new order for customer John Doe"
- "What payment methods are available?"
- "Update order #123 status to completed"

## Features

- **Full TypeScript Support** - Complete type definitions for all API endpoints
- **Plugin Architecture** - Only import the services you need
- **Transport Agnostic** - Use fetch, axios, or your own HTTP client
- **MCP Integration** - Ready-to-use server for AI assistants
- **Rate Limit Handling** - Built-in retry logic for rate limits

## API Coverage

| Feature | Client | MCP |
|---------|--------|-----|
| Orders (create, update, list) | ✅ | ✅ |
| Products (update, delete) | ✅ | ✅ |
| Categories | ✅ | - |
| Payments (add, list) | ✅ | ✅ |
| Payment Methods | ✅ | ✅ |
| Delivery Methods | ✅ | ✅ |
| Order Statuses | ✅ | ✅ |
| Currency Rates | ✅ | ✅ |
| Invoices | ✅ | - |
| Sales Invoices | ✅ | - |
| Cash Orders | ✅ | - |
| Contracts | ✅ | - |
| Checks (Fiscal) | ✅ | - |
| Acts | ✅ | - |
| Product Arrivals | ✅ | - |

## Development

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Run tests
yarn test

# Type check
yarn type-check
```

## License

[Apache License 2.0](LICENSE)

## Author

Danny Chirkov ([@dannychirkov](https://github.com/dannychirkov))
