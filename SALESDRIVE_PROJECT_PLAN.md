# SalesDrive CRM API Client — Project Plan

## Overview

This document outlines the architecture and implementation plan for **@dannychirkov/salesdrive-api-client** — a TypeScript API client for the SalesDrive CRM system. The design follows a proven plugin-based architecture, adapted for SalesDrive's REST-style API.

### Goals

1. **Type-Safe Client**: Full TypeScript coverage with strict typing for all API endpoints
2. **Plugin Architecture**: Modular, tree-shakeable services
3. **Transport-Agnostic**: Works with fetch, axios, or custom HTTP clients
4. **MCP Server Ready**: Designed for seamless AI integration via Model Context Protocol

### License

**Apache License 2.0**

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Patent use granted
- ✅ Private use allowed
- ℹ️ License and copyright notice must be included
- ℹ️ Changes must be documented

---

## Project Structure

```
packages/
├── salesdrive-api-client/           # Core API client
│   ├── src/
│   │   ├── core/
│   │   │   └── client.ts            # Client factory & plugin system
│   │   ├── http/
│   │   │   └── transport.ts         # Transport interface definition
│   │   ├── services/
│   │   │   ├── orderService.ts      # Orders CRUD
│   │   │   ├── productService.ts    # Products management
│   │   │   ├── categoryService.ts   # Categories management
│   │   │   ├── paymentService.ts    # Payments management
│   │   │   ├── invoiceService.ts    # Invoices listing
│   │   │   ├── salesInvoiceService.ts
│   │   │   ├── cashOrderService.ts
│   │   │   ├── contractService.ts
│   │   │   ├── checkService.ts      # Fiscal receipts
│   │   │   ├── actService.ts
│   │   │   ├── arrivalService.ts    # Product arrivals
│   │   │   ├── callService.ts       # Call records
│   │   │   ├── currencyService.ts   # Currency rates
│   │   │   ├── referenceService.ts  # Payment/delivery methods, statuses
│   │   │   └── ymlExportService.ts  # YML product export
│   │   ├── types/
│   │   │   ├── base.ts              # Base types & response wrapper
│   │   │   ├── order.ts             # Order types
│   │   │   ├── product.ts           # Product types
│   │   │   ├── category.ts          # Category types
│   │   │   ├── payment.ts           # Payment types
│   │   │   ├── invoice.ts           # Invoice types
│   │   │   ├── salesInvoice.ts      # Sales invoice types
│   │   │   ├── cashOrder.ts         # Cash order types
│   │   │   ├── contract.ts          # Contract types
│   │   │   ├── check.ts             # Fiscal check types
│   │   │   ├── act.ts               # Act types
│   │   │   ├── arrival.ts           # Product arrival types
│   │   │   ├── call.ts              # Call types
│   │   │   ├── currency.ts          # Currency types
│   │   │   ├── reference.ts         # Reference data types
│   │   │   ├── contact.ts           # Contact types (shared)
│   │   │   ├── delivery.ts          # Delivery data types
│   │   │   ├── webhook.ts           # Webhook payload types
│   │   │   ├── enums.ts             # Enums and constants
│   │   │   └── errors.ts            # Error types
│   │   ├── utils/
│   │   │   ├── date.ts              # Date formatting utilities
│   │   │   └── validation.ts        # Request validation
│   │   └── index.ts                 # Public exports
│   ├── __tests__/
│   │   ├── services/
│   │   └── mocks/
│   ├── package.json
│   ├── tsconfig.json
│   ├── rollup.config.js
│   └── README.md
│
├── salesdrive-transport-fetch/      # Fetch-based transport
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── README.md
│
└── salesdrive-mcp-server/           # MCP server for AI integration
    ├── src/
    │   ├── cli/
    │   │   ├── index.ts
    │   │   ├── stdio.ts
    │   │   └── http.ts
    │   ├── tools/
    │   │   ├── index.ts             # Tool dispatcher
    │   │   ├── order.ts             # Order tools
    │   │   ├── product.ts           # Product tools
    │   │   ├── payment.ts           # Payment tools
    │   │   ├── reference.ts         # Reference data tools
    │   │   └── ...
    │   ├── types/
    │   │   └── mcp.ts
    │   ├── utils/
    │   │   ├── logger.ts
    │   │   ├── error-handler.ts
    │   │   ├── tool-response.ts
    │   │   └── validation.ts
    │   ├── config.ts
    │   └── server.ts
    ├── tests/
    ├── package.json
    └── README.md
```

---

## Phase 1: Core Types & Base Infrastructure

### 1.1 Base Types (`types/base.ts`)

SalesDrive uses a different response structure than Nova Poshta. Define base types:

```typescript
// SalesDrive API response wrapper
export interface SalesDriveResponse<T = unknown> {
  readonly success?: boolean;
  readonly status?: 'success' | 'error';
  readonly data?: T;
  readonly message?: string;
  readonly pagination?: PaginationInfo;
  readonly totals?: TotalsInfo;
  readonly meta?: MetaInfo;
}

export interface PaginationInfo {
  readonly currentPage: number;
  readonly pageCount: number;
  readonly perPage: number;
}

export interface TotalsInfo {
  readonly count: number;
  readonly sum?: number;
  readonly paymentAmount?: number;
  readonly commission?: number;
  readonly expenses?: number;
}

export interface MetaInfo {
  readonly fields?: Record<string, unknown>;
  readonly contacts?: {
    readonly fields?: Record<string, unknown>;
  };
}

// List request base
export interface ListRequestParams {
  readonly page?: number;
  readonly limit?: number;
}

// Date filter params (common pattern in SalesDrive)
export interface DateFilterParams {
  readonly 'filter[updateAt][from]'?: string;
  readonly 'filter[updateAt][to]'?: string;
  readonly 'filter[date][from]'?: string;
  readonly 'filter[date][to]'?: string;
  readonly 'filter[createdAt][from]'?: string;
  readonly 'filter[createdAt][to]'?: string;
  readonly 'filter[organizationId][]'?: number;
}
```

### 1.2 Transport Interface (`http/transport.ts`)

```typescript
export interface HttpTransport {
  request<T>(config: HttpRequestConfig): Promise<SalesDriveResponse<T>>;
}

export interface HttpRequestConfig {
  readonly method: 'GET' | 'POST';
  readonly endpoint: string;
  readonly params?: Record<string, unknown>;
  readonly body?: Record<string, unknown>;
  readonly signal?: AbortSignal;
}
```

### 1.3 Client Context & Factory (`core/client.ts`)

```typescript
export interface ClientContext {
  transport: HttpPostJsonTransport;
  baseUrl: string; // e.g., 'https://demo.salesdrive.me'
  apiKey: string;
}

// Same plugin pattern as Nova Poshta
export function createClient<API extends {} = {}>(ctx: ClientContext): Client<API>;
```

---

## Phase 2: Service Implementation

### 2.1 OrderService — Priority: **HIGH**

The most important service. Implements:

| Method     | Endpoint                     | HTTP | Description              |
| ---------- | ---------------------------- | ---- | ------------------------ |
| `create()` | `/handler/` or `/api/order/` | POST | Create new order         |
| `update()` | `/api/order/update/`         | POST | Update existing order    |
| `list()`   | `/api/order/list/`           | GET  | List orders with filters |

**Types to define:**

- `CreateOrderRequest` — full order creation payload
- `UpdateOrderRequest` — partial update payload
- `ListOrdersRequest` — filter/pagination params
- `Order` — complete order response object
- `OrderProduct` — product within order
- `OrderContact` — contact within order
- `DeliveryData` — Nova Poshta/Ukrposhta/Meest delivery info

### 2.2 ProductService — Priority: **HIGH**

Bulk product management:

| Method     | Endpoint            | HTTP | Description                 |
| ---------- | ------------------- | ---- | --------------------------- |
| `update()` | `/product-handler/` | POST | Add/update products (batch) |
| `delete()` | `/product-handler/` | POST | Delete products (batch)     |

**Types to define:**

- `ProductActionRequest` — action: 'update' | 'delete'
- `Product` — full product object
- `ProductDiscount` — discount structure
- `ProductParams` — custom parameters
- `AdditionalPrice` — wholesale/custom prices

### 2.3 CategoryService — Priority: **MEDIUM**

| Method     | Endpoint             | HTTP | Description                  |
| ---------- | -------------------- | ---- | ---------------------------- |
| `manage()` | `/category-handler/` | POST | Add/update/delete categories |

### 2.4 PaymentService — Priority: **HIGH**

| Method   | Endpoint             | HTTP | Description      |
| -------- | -------------------- | ---- | ---------------- |
| `add()`  | `/api/payment/`      | POST | Register payment |
| `list()` | `/api/payment/list/` | GET  | List payments    |

### 2.5 ReferenceService — Priority: **HIGH**

Static reference data needed for UI and validation:

| Method                 | Endpoint                 | HTTP | Description           |
| ---------------------- | ------------------------ | ---- | --------------------- |
| `getPaymentMethods()`  | `/api/payment-methods/`  | GET  | List payment methods  |
| `getDeliveryMethods()` | `/api/delivery-methods/` | GET  | List delivery methods |
| `getOrderStatuses()`   | `/api/statuses/`         | GET  | List order statuses   |

### 2.6 Other Services — Priority: **LOW-MEDIUM**

| Service               | Endpoint                     | Priority |
| --------------------- | ---------------------------- | -------- |
| `InvoiceService`      | `/api/invoice/list/`         | Medium   |
| `SalesInvoiceService` | `/api/sales-invoice/list/`   | Medium   |
| `CashOrderService`    | `/api/cash-order/list/`      | Low      |
| `ContractService`     | `/api/contract/list/`        | Low      |
| `CheckService`        | `/api/check/list/`           | Medium   |
| `ActService`          | `/api/act/list/`             | Low      |
| `ArrivalService`      | `/api/arrival-product/list/` | Medium   |
| `CallService`         | `/trumpets/call/`            | Low      |
| `CurrencyService`     | `/api/currencies/`           | Medium   |
| `YmlExportService`    | `/export/yml/export.yml`     | Low      |

---

## Phase 3: SalesDrive Transport Implementation

### 3.1 Fetch Transport (`salesdrive-transport-fetch`)

Key differences from Nova Poshta transport:

1. **Authentication**: Uses `X-Api-Key` header (not in body)
2. **Base URL**: Dynamic per account (`https://{account}.salesdrive.me`)
3. **Mixed HTTP Methods**: GET for lists, POST for mutations
4. **Query Params**: Lists use GET with query parameters

```typescript
export interface SalesDriveTransportConfig {
  apiKey: string;
  baseUrl: string;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export function createFetchHttpTransport(config: SalesDriveTransportConfig) {
  return async <TReq, TRes>({
    endpoint,
    method,
    body,
    params,
    signal,
  }: TransportRequest): Promise<{ status: number; data: TRes }> => {
    const url = new URL(endpoint, config.baseUrl);

    // Add query params for GET requests
    if (params && method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const res = await (config.fetch ?? fetch)(url.toString(), {
      method,
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
      signal,
    });

    return { status: res.status, data: await res.json() };
  };
}
```

---

## Phase 4: MCP Server Implementation

### 4.1 Tool Design

Design MCP tools based on SalesDrive API capabilities:

#### Order Tools

| Tool           | Description                                        |
| -------------- | -------------------------------------------------- |
| `order_create` | Create new order with products, contacts, delivery |
| `order_update` | Update order status, manager, TTN                  |
| `order_list`   | List orders with date/status filters               |
| `order_get`    | Get single order by ID or externalId               |

#### Product Tools

| Tool             | Description                    |
| ---------------- | ------------------------------ |
| `product_update` | Add or update products (batch) |
| `product_delete` | Delete products by ID          |

#### Payment Tools

| Tool           | Description                |
| -------------- | -------------------------- |
| `payment_add`  | Register incoming payment  |
| `payment_list` | List payments with filters |

#### Reference Tools

| Tool                             | Description                |
| -------------------------------- | -------------------------- |
| `reference_get_payment_methods`  | Get payment methods        |
| `reference_get_delivery_methods` | Get delivery methods       |
| `reference_get_statuses`         | Get order statuses         |
| `currency_get`                   | Get current exchange rates |
| `currency_update`                | Update exchange rates      |

### 4.2 Server Configuration

```typescript
export interface ServerConfig {
  apiKey: string;
  baseUrl: string; // Required: account-specific URL
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Environment variables
// SALESDRIVE_API_KEY
// SALESDRIVE_BASE_URL (e.g., https://demo.salesdrive.me)
// LOG_LEVEL
```

---

## Implementation Roadmap

### MVP (Minimum Viable Product)

| Week | Deliverable                                                        |
| ---- | ------------------------------------------------------------------ |
| 1    | Core infrastructure: types/base.ts, client.ts, transport interface |
| 2    | OrderService + OrderTypes (create, update, list)                   |
| 3    | ProductService + CategoryService                                   |
| 4    | PaymentService + ReferenceService                                  |
| 5    | Transport implementation + basic tests                             |
| 6    | MCP Server (order & product tools)                                 |

### Post-MVP

| Phase | Deliverable                               |
| ----- | ----------------------------------------- |
| 2.1   | Invoice, SalesInvoice, CashOrder services |
| 2.2   | Contract, Check, Act services             |
| 2.3   | Arrival, Call, Currency services          |
| 2.4   | YML Export service                        |
| 2.5   | Full MCP tool coverage                    |

---

## API Differences: SalesDrive vs Nova Poshta

| Aspect           | Nova Poshta                 | SalesDrive                                     |
| ---------------- | --------------------------- | ---------------------------------------------- |
| Auth             | `apiKey` in request body    | `X-Api-Key` header                             |
| Base URL         | Fixed: `api.novaposhta.ua`  | Dynamic: `{account}.salesdrive.me`             |
| Request Format   | Always POST with JSON body  | GET for reads, POST for writes                 |
| Response Wrapper | `{ success, data, errors }` | `{ success/status, data, pagination, totals }` |
| Error Format     | `errors: string[]`          | `message: string`                              |
| Rate Limits      | None documented             | 10/min, 100/hr, 1000/day for lists             |
| Batch Operations | Some methods                | Products support batch (100 max)               |

---

## Key Types Reference

### Order Types (from API.md)

```typescript
export interface CreateOrderRequest {
  // Result control
  getResultData?: 0 | 1;

  // Customer info
  lName?: string;
  fName?: string;
  mName?: string;
  phone: string;
  email?: string;
  dateOfBirth?: string; // DD.MM.YYYY

  // Products
  products: OrderProductInput[];

  // Payment & Shipping
  payment_method?: string;
  shipping_method?: string;
  shipping_address?: string;

  // Delivery providers (Nova Poshta, Ukrposhta, Meest, Rozetka)
  novaposhta?: NovaPoshtaDelivery;
  ukrposhta?: UkrposhtaDelivery;
  meest?: MeestDelivery;
  rozetka_delivery?: RozetkaDelivery;

  // Order metadata
  comment?: string;
  externalId?: string;
  sajt?: string;
  stockId?: number;
  commission?: number;
  costPrice?: number;
  shipping_costs?: number;
  organizationId?: number;
  salesdrive_manager?: number;

  // UTM tracking
  utmSourceFull?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  utmPage?: string;
}

export interface OrderProductInput {
  id: string;
  name?: string;
  costPerItem: number;
  amount: number;
  description?: string;
  discount?: string; // "10" or "10%"
  sku?: string;
  commission?: string;
}
```

### Product Types

```typescript
export interface ProductUpdateRequest {
  action: 'update' | 'delete';
  dontUpdateFields?: string[];
  product: ProductInput[];
}

export interface ProductInput {
  id: string;
  name?: string;
  nameTranslate?: string;
  nameForDocuments?: string;
  description?: string;
  descriptionTranslate?: string;
  costPerItem?: number;
  sku?: string;
  manufacturer?: string;
  currency?: string;
  discount?: ProductDiscount;
  weight?: number;
  volume?: number;
  length?: number;
  width?: number;
  height?: number;
  barcode?: string;
  stockBalance?: number;
  stockBalanceByStock?: Record<string, number>;
  expenses?: number;
  currencyExpenses?: string;
  category?: { id?: number; name?: string };
  url?: string;
  note?: string;
  supplier?: string;
  keywords?: string;
  parentProductId?: string | null;
  set?: { id: string; quantity: number }[];
  images?: { fullsize: string }[];
  params?: ProductParam[];
  additionalPrices?: AdditionalPrice[];
  label?: string[];
  labelMode?: 'replace' | 'append';
}
```

---

## Configuration Examples

### .mcp.json for SalesDrive MCP Server

```json
{
  "mcpServers": {
    "salesdrive": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "-p", "@dannychirkov/salesdrive-mcp-server", "salesdrive-mcp"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://yourcompany.salesdrive.me",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

## Success Criteria

### API Client

- [ ] 100% TypeScript coverage
- [ ] All documented endpoints implemented
- [ ] Unit tests for all services
- [ ] Integration tests with sandbox
- [ ] Documentation with examples

### MCP Server

- [ ] All CRUD tools implemented
- [ ] Error handling matches Nova Poshta quality
- [ ] stdio and HTTP transports
- [ ] Published to MCP Registry

---

## Notes

1. **Rate Limits**: SalesDrive enforces strict rate limits on list endpoints. Implement exponential backoff.

2. **Date Format**: SalesDrive uses `DD.MM.YYYY` for dates and `YYYY-MM-DD HH:MM:SS` for datetime filters.

3. **Partial Updates**: Order updates support partial data — only send fields you want to change.

4. **External IDs**: Orders can be identified by `id` (internal) or `externalId` (your system's ID).

5. **Delivery Integration**: SalesDrive natively supports Nova Poshta, Ukrposhta, Meest, and Rozetka delivery data structures.

---

## Publishing

### NPM Packages

| Package    | NPM Name                                   | Description                |
| ---------- | ------------------------------------------ | -------------------------- |
| API Client | `@dannychirkov/salesdrive-api-client`      | Core TypeScript client     |
| Transport  | `@dannychirkov/salesdrive-transport-fetch` | Fetch-based HTTP transport |
| MCP Server | `@dannychirkov/salesdrive-mcp-server`      | AI integration via MCP     |

### GitHub Repository

**Repository**: `github.com/dannychirkov/salesdrive-api`

```
salesdrive-api/
├── packages/
│   ├── salesdrive-api-client/
│   ├── salesdrive-transport-fetch/
│   └── salesdrive-mcp-server/
├── LICENSE                  # Apache 2.0
├── README.md
└── package.json
```

### MCP Registry

Publish to [MCP Registry](https://registry.modelcontextprotocol.io/) for discoverability:

- Server ID: `io.github.dannychirkov/salesdrive`
- Category: CRM / E-commerce

### Release Workflow

1. **Versioning**: Semantic versioning (semver)
   - `0.x.x` — Development phase
   - `1.0.0` — First stable release

2. **Changelog**: Maintain `CHANGELOG.md` with all changes

3. **CI/CD**: GitHub Actions for
   - Lint + Type check
   - Unit tests
   - Build
   - Publish to npm (on tag)
