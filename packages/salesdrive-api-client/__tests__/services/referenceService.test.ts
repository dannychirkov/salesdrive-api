/**
 * Reference Service Tests
 */

import { createClient, referenceService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('ReferenceService', () => {
  const transport = createMockTransport();
  const client = createClient({
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  }).extend(referenceService);

  describe('getPaymentMethods', () => {
    it('should return payment methods', async () => {
      const result = await client.reference.getPaymentMethods();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(result.data?.[0]).toHaveProperty('id');
      expect(result.data?.[0]).toHaveProperty('name');
    });
  });

  describe('getDeliveryMethods', () => {
    it('should return delivery methods', async () => {
      const result = await client.reference.getDeliveryMethods();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(result.data?.[0]).toHaveProperty('id');
      expect(result.data?.[0]).toHaveProperty('name');
    });
  });

  describe('getStatuses', () => {
    it('should return order statuses', async () => {
      const result = await client.reference.getStatuses();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(result.data?.[0]).toHaveProperty('id');
      expect(result.data?.[0]).toHaveProperty('name');
    });
  });
});
