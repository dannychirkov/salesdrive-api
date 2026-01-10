/**
 * Client Core Tests
 */

import { createClient, orderService, referenceService, paymentService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('createClient', () => {
  const transport = createMockTransport();
  const ctx = {
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  };

  it('should create a client', () => {
    const client = createClient(ctx);
    expect(client).toBeDefined();
    expect(typeof client.extend).toBe('function');
  });

  it('should extend with single service', () => {
    const client = createClient(ctx).extend(orderService);

    expect(client.orders).toBeDefined();
    expect(typeof client.orders.list).toBe('function');
    expect(typeof client.orders.create).toBe('function');
    expect(typeof client.orders.update).toBe('function');
  });

  it('should extend with multiple services', () => {
    const client = createClient(ctx)
      .extend(orderService)
      .extend(referenceService)
      .extend(paymentService);

    expect(client.orders).toBeDefined();
    expect(client.reference).toBeDefined();
    expect(client.payments).toBeDefined();
  });

  it('should allow chained service calls', async () => {
    const client = createClient(ctx).extend(orderService).extend(referenceService);

    const orders = await client.orders.list();
    const statuses = await client.reference.getStatuses();

    expect(orders.status).toBe('success');
    expect(statuses.success).toBe(true);
  });
});
