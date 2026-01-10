/**
 * Currency Service Tests
 */

import { createClient, currencyService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('CurrencyService', () => {
  const transport = createMockTransport();
  const client = createClient({
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  }).extend(currencyService);

  describe('get', () => {
    it('should return currency rates', async () => {
      const result = await client.currencies.get();

      expect(result.baseCurrency).toBe('UAH');
      expect(result.currencies).toBeDefined();
      expect(Array.isArray(result.currencies)).toBe(true);
      expect(result.currencies.length).toBeGreaterThan(0);
    });

    it('should include currency details', async () => {
      const result = await client.currencies.get();
      const usd = result.currencies.find((c) => c.code === 'USD');

      expect(usd).toBeDefined();
      expect(usd?.rate).toBeDefined();
      expect(usd?.abbreviation).toBe('$');
    });
  });
});
