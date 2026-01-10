# @dannychirkov/salesdrive-api-client

TypeScript API client for [SalesDrive CRM](https://salesdrive.ua).

## Installation

```bash
npm install @dannychirkov/salesdrive-api-client @dannychirkov/salesdrive-transport-fetch
```

## Quick Start

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

// List orders
const orders = await client.orders.list({ limit: 10 });
console.log(orders.data);
```

## Available Services

### Order Service

```typescript
import { orderService } from '@dannychirkov/salesdrive-api-client';

const client = createClient(ctx).extend(orderService);

// List orders
const orders = await client.orders.list({
  page: 1,
  limit: 50,
  'filter[statusId]': '2',
});

// Create order
const result = await client.orders.create({
  phone: '0501234567',
  fName: 'John',
  lName: 'Doe',
  products: [
    { id: '101', costPerItem: 500, amount: 2 },
  ],
  payment_method: 'card',
  shipping_method: 'novaposhta',
});

// Update order
await client.orders.update({
  id: 1001,
  data: {
    statusId: 3,
    comment: 'Updated',
  },
});
```

### Product Service

```typescript
import { productService } from '@dannychirkov/salesdrive-api-client';

const client = createClient(ctx).extend(productService);

// Update products (batch)
await client.products.update([
  { id: '101', name: 'Product 1', costPerItem: 500 },
  { id: '102', name: 'Product 2', costPerItem: 750 },
]);

// Delete products
await client.products.delete(['101', '102']);
```

### Payment Service

```typescript
import { paymentService } from '@dannychirkov/salesdrive-api-client';

const client = createClient(ctx).extend(paymentService);

// Add payment
await client.payments.add({
  sum: 500,
  orderId: 1001,
});

// List payments
const payments = await client.payments.list({
  type: 'incoming',
  page: 1,
});
```

### Reference Service

```typescript
import { referenceService } from '@dannychirkov/salesdrive-api-client';

const client = createClient(ctx).extend(referenceService);

// Get payment methods
const paymentMethods = await client.reference.getPaymentMethods();

// Get delivery methods
const deliveryMethods = await client.reference.getDeliveryMethods();

// Get order statuses
const statuses = await client.reference.getStatuses();
```

### Currency Service

```typescript
import { currencyService } from '@dannychirkov/salesdrive-api-client';

const client = createClient(ctx).extend(currencyService);

// Get rates
const rates = await client.currencies.get();

// Update rates
await client.currencies.update({
  currencies: [
    { code: 'USD', rate: 42 },
    { code: 'EUR', rate: 45 },
  ],
});
```

## All Available Services

- `orderService` - Orders management
- `productService` - Products management
- `categoryService` - Categories management
- `paymentService` - Payments management
- `referenceService` - Reference data (payment methods, delivery methods, statuses)
- `currencyService` - Currency rates
- `invoiceService` - Invoices listing
- `salesInvoiceService` - Sales invoices listing
- `cashOrderService` - Cash orders listing
- `contractService` - Contracts listing
- `checkService` - Fiscal receipts listing
- `actService` - Acts listing
- `arrivalService` - Product arrivals listing

## Types

All types are exported from the package:

```typescript
import type {
  Order,
  CreateOrderRequest,
  Product,
  Payment,
  PaymentMethod,
  DeliveryMethod,
  OrderStatus,
} from '@dannychirkov/salesdrive-api-client';
```

## Error Handling

```typescript
import { ApiError, RateLimitError, AuthenticationError } from '@dannychirkov/salesdrive-api-client';

try {
  await client.orders.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limited, try again later');
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof ApiError) {
    console.log('API error:', error.message);
  }
}
```

## License

[Apache License 2.0](../../LICENSE)
