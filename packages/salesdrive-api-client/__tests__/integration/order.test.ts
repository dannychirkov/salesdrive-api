/**
 * Integration Tests for Order Service
 *
 * These tests require real API credentials:
 * - SALESDRIVE_API_KEY
 * - SALESDRIVE_BASE_URL
 *
 * Run with: npm run test:integration
 *
 * NOTE: Only READ operations are tested (list).
 * Create/Update operations require write permissions.
 */

import { createClient, orderService } from '../../src/index';
import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';

// Skip if no credentials
const apiKey = process.env.SALESDRIVE_API_KEY;
const baseUrl = process.env.SALESDRIVE_BASE_URL;

const describeIf = apiKey && baseUrl ? describe : describe.skip;

describeIf('OrderService Integration', () => {
  const transport = createFetchTransport({
    apiKey: apiKey!,
    baseUrl: baseUrl!,
  });

  const client = createClient({
    transport,
    apiKey: apiKey!,
    baseUrl: baseUrl!,
  }).extend(orderService);

  describe('list', () => {
    it('should fetch real orders from API', async () => {
      const result = await client.orders.list({
        limit: 5,
      });

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.totals).toBeDefined();

      console.log(`Total orders: ${result.totals?.count}`);
      console.log(`Fetched: ${result.data?.length} orders`);

      if (result.data && result.data.length > 0) {
        const order = result.data[0];
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('formId');
        console.log(`First order ID: ${order.id}`);
      }
    });

    it('should support pagination', async () => {
      const page1 = await client.orders.list({ limit: 2, page: 1 });
      const page2 = await client.orders.list({ limit: 2, page: 2 });

      expect(page1.status).toBe('success');
      expect(page2.status).toBe('success');

      if (page1.data && page2.data && page1.data.length > 0 && page2.data.length > 0) {
        // Orders should be different
        expect(page1.data[0].id).not.toBe(page2.data[0].id);
      }
    });

    it('should filter by status', async () => {
      const result = await client.orders.list({
        limit: 5,
        'filter[statusId]': '__NOTDELETED__',
      });

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
    });
  });
});
