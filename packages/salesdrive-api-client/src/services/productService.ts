/**
 * Product Service
 *
 * Handles product creation, updates, and deletion.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  ProductInput,
  ProductUpdateRequest,
  ProductDeleteRequest,
  ProductActionResponse,
} from '../types/product.js';

/**
 * Product service API
 */
export interface ProductServiceApi {
  readonly products: {
    /**
     * Update or add products (batch operation, up to 100 products)
     */
    update(
      products: ProductInput[],
      options?: { dontUpdateFields?: string[] }
    ): Promise<ProductActionResponse>;

    /**
     * Delete products by ID
     */
    delete(productIds: string[]): Promise<ProductActionResponse>;
  };
}

/**
 * Product service plugin
 */
export const productService: ServicePlugin<ProductServiceApi> = (ctx: ClientContext) => ({
  products: {
    async update(
      products: ProductInput[],
      options?: { dontUpdateFields?: string[] }
    ): Promise<ProductActionResponse> {
      const request: ProductUpdateRequest = {
        action: 'update',
        dontUpdateFields: options?.dontUpdateFields,
        product: products,
      };
      const result = await ctx.transport<ProductActionResponse>({
        method: 'POST',
        endpoint: '/product-handler/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as ProductActionResponse;
    },

    async delete(productIds: string[]): Promise<ProductActionResponse> {
      const request: ProductDeleteRequest = {
        action: 'delete',
        product: productIds.map((id) => ({ id })),
      };
      const result = await ctx.transport<ProductActionResponse>({
        method: 'POST',
        endpoint: '/product-handler/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as ProductActionResponse;
    },
  },
});
