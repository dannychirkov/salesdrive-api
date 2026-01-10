/**
 * Category Service
 *
 * Handles category management.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { CategoryInput, CategoryActionResponse } from '../types/category.js';

/**
 * Category service API
 */
export interface CategoryServiceApi {
  readonly categories: {
    /**
     * Update or add categories
     */
    update(categories: CategoryInput[]): Promise<CategoryActionResponse>;

    /**
     * Delete categories by ID
     */
    delete(categoryIds: number[]): Promise<CategoryActionResponse>;
  };
}

/**
 * Category service plugin
 */
export const categoryService: ServicePlugin<CategoryServiceApi> = (ctx: ClientContext) => ({
  categories: {
    async update(categories: CategoryInput[]): Promise<CategoryActionResponse> {
      const result = await ctx.transport<CategoryActionResponse>({
        method: 'POST',
        endpoint: '/category-handler/',
        body: {
          action: 'update',
          category: categories,
        },
      });
      return result.data as CategoryActionResponse;
    },

    async delete(categoryIds: number[]): Promise<CategoryActionResponse> {
      const result = await ctx.transport<CategoryActionResponse>({
        method: 'POST',
        endpoint: '/category-handler/',
        body: {
          action: 'delete',
          category: categoryIds.map((id) => ({ id })),
        },
      });
      return result.data as CategoryActionResponse;
    },
  },
});
