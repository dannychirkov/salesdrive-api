/**
 * Product Service Tests
 */

import { createClient, productService } from '../../src/index.js';
import { createMockTransport } from '../mocks/transport.js';

describe('ProductService', () => {
  const transport = createMockTransport();
  const client = createClient({
    transport,
    baseUrl: 'https://test.salesdrive.me',
    apiKey: 'test-api-key',
  }).extend(productService);

  describe('update', () => {
    it('should update products', async () => {
      const result = await client.products.update([
        {
          id: '101',
          name: 'Updated Product',
          costPerItem: 1000,
        },
      ]);

      expect(result.status).toBe('success');
      expect(result.message).toContain('successfully');
    });

    it('should update multiple products', async () => {
      const result = await client.products.update([
        { id: '101', name: 'Product 1', costPerItem: 500 },
        { id: '102', name: 'Product 2', costPerItem: 750 },
      ]);

      expect(result.status).toBe('success');
    });

    it('should support dontUpdateFields option', async () => {
      const result = await client.products.update(
        [{ id: '101', name: 'Product', costPerItem: 500 }],
        { dontUpdateFields: ['price', 'description'] }
      );

      expect(result.status).toBe('success');
    });
  });

  describe('delete', () => {
    it('should delete products by ID', async () => {
      const result = await client.products.delete(['101', '102']);

      expect(result.status).toBe('success');
    });
  });
});
