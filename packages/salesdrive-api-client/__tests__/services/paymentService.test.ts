/**
 * Payment Service Tests
 */

import { createClient, paymentService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('PaymentService', () => {
  const transport = createMockTransport();
  const client = createClient({
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  }).extend(paymentService);

  describe('add', () => {
    it('should add a payment', async () => {
      const result = await client.payments.add({
        sum: 500,
        orderId: 1001,
      });

      expect(result.success).toBe(true);
      expect(result.data?.paymentId).toBeDefined();
    });

    it('should add payment with full details', async () => {
      const result = await client.payments.add({
        sum: 1000,
        organizationId: 1,
        datetime: '2025-01-10 15:30:00',
        timezone: 'Europe/Kiev',
        description: 'Payment for order #1001',
        orderId: 1001,
        counterpartyName: 'Test Company',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('list', () => {
    it('should return payments list', async () => {
      const result = await client.payments.list();

      expect(result.status).toBe('success');
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.totals).toBeDefined();
    });

    it('should filter by type', async () => {
      const result = await client.payments.list({
        type: 'incoming',
      });

      expect(result.status).toBe('success');
    });
  });
});
