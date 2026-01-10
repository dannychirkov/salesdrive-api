/**
 * Integration Tests for Reference Service
 *
 * These tests require real API credentials:
 * - SALESDRIVE_API_KEY
 * - SALESDRIVE_BASE_URL
 *
 * Run with: npm run test:integration
 */

import { createClient, referenceService } from '../../src/index';
import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';

// Skip if no credentials
const apiKey = process.env.SALESDRIVE_API_KEY;
const baseUrl = process.env.SALESDRIVE_BASE_URL;

const describeIf = apiKey && baseUrl ? describe : describe.skip;

describeIf('ReferenceService Integration', () => {
  const transport = createFetchTransport({
    apiKey: apiKey!,
    baseUrl: baseUrl!,
  });

  const client = createClient({
    transport,
    apiKey: apiKey!,
    baseUrl: baseUrl!,
  }).extend(referenceService);

  describe('getPaymentMethods', () => {
    it('should fetch real payment methods from API', async () => {
      const result = await client.reference.getPaymentMethods();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data && result.data.length > 0) {
        const method = result.data[0];
        expect(method).toHaveProperty('id');
        expect(method).toHaveProperty('name');
        console.log(`Found ${result.data.length} payment methods`);
      }
    });
  });

  describe('getDeliveryMethods', () => {
    it('should fetch real delivery methods from API', async () => {
      const result = await client.reference.getDeliveryMethods();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data && result.data.length > 0) {
        const method = result.data[0];
        expect(method).toHaveProperty('id');
        expect(method).toHaveProperty('name');
        console.log(`Found ${result.data.length} delivery methods`);
      }
    });
  });

  describe('getStatuses', () => {
    it('should fetch real order statuses from API', async () => {
      const result = await client.reference.getStatuses();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data && result.data.length > 0) {
        const status = result.data[0];
        expect(status).toHaveProperty('id');
        expect(status).toHaveProperty('name');
        console.log(`Found ${result.data.length} order statuses`);
      }
    });
  });
});
