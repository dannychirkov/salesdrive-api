# @dannychirkov/salesdrive-transport-fetch

Fetch-based HTTP transport for SalesDrive API client.

## Installation

```bash
npm install @dannychirkov/salesdrive-api-client @dannychirkov/salesdrive-transport-fetch
```

## Usage

```typescript
import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';
import { createClient, orderService } from '@dannychirkov/salesdrive-api-client';

const transport = createFetchTransport({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-account.salesdrive.me',
});

const client = createClient({
  transport,
  apiKey: 'your-api-key',
  baseUrl: 'https://your-account.salesdrive.me',
}).extend(orderService);

const orders = await client.orders.list();
```

## Configuration

```typescript
interface FetchTransportConfig {
  // SalesDrive API key (required)
  apiKey: string;

  // Base URL for the API (required)
  // Example: https://demo.salesdrive.me
  baseUrl: string;

  // Additional headers to include in requests
  headers?: Record<string, string>;

  // Custom fetch implementation
  // Useful for testing or Node.js < 18
  fetch?: typeof fetch;

  // Request timeout in milliseconds (default: 30000)
  timeout?: number;
}
```

## With Retry Logic

For automatic retry on rate limit errors:

```typescript
import { createFetchTransportWithRetry } from '@dannychirkov/salesdrive-transport-fetch';

const transport = createFetchTransportWithRetry(
  {
    apiKey: 'your-api-key',
    baseUrl: 'https://your-account.salesdrive.me',
  },
  {
    maxRetries: 3,
    retryDelay: 1000,
    retryMultiplier: 2,
  }
);
```

## Custom Fetch Implementation

```typescript
import nodeFetch from 'node-fetch';

const transport = createFetchTransport({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-account.salesdrive.me',
  fetch: nodeFetch as unknown as typeof fetch,
});
```

## License

[Apache License 2.0](../../LICENSE)
