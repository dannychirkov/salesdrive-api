/**
 * Order Service Tests
 */

import { createClient, orderService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('OrderService', () => {
  const transport = createMockTransport();
  const client = createClient({
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  }).extend(orderService);

  describe('list', () => {
    it('should return orders list', async () => {
      const result = await client.orders.list();

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.totals).toBeDefined();
    });

    it('should include order details', async () => {
      const result = await client.orders.list();
      const order = result.data?.[0];

      expect(order).toBeDefined();
      expect(order?.id).toBeDefined();
      expect(order?.formId).toBeDefined();
      expect(order?.products).toBeDefined();
    });

    it('should accept filter parameters', async () => {
      const result = await client.orders.list({
        page: 1,
        limit: 10,
        'filter[statusId]': '2',
      });

      expect(result.status).toBe('success');
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const result = await client.orders.create({
        phone: '0501234567',
        products: [
          {
            id: '101',
            name: 'Test Product',
            costPerItem: 500,
            amount: 2,
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.data?.orderId).toBeDefined();
      expect(result.data?.userId).toBeDefined();
    });

    it('should create order with full customer info', async () => {
      const result = await client.orders.create({
        phone: '0501234567',
        fName: 'John',
        lName: 'Doe',
        email: 'john@example.com',
        products: [
          {
            id: '101',
            costPerItem: 500,
            amount: 1,
          },
        ],
        payment_method: 'card',
        shipping_method: 'novaposhta',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an existing order', async () => {
      const result = await client.orders.update({
        id: 1001,
        data: {
          statusId: 3,
          comment: 'Updated via API',
        },
      });

      expect(result.success).toBe(true);
    });

    it('should update order by externalId', async () => {
      const result = await client.orders.update({
        externalId: 'EXT-123',
        data: {
          statusId: 2,
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
