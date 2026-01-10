/**
 * Check Service (Fiscal Receipts / Чеки)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListChecksRequest, ListChecksResponse } from '../types/check.js';

/**
 * Check service API
 */
export interface CheckServiceApi {
  readonly checks: {
    /**
     * List fiscal receipts/checks with filters
     */
    list(params?: ListChecksRequest): Promise<ListChecksResponse>;
  };
}

/**
 * Check service plugin
 */
export const checkService: ServicePlugin<CheckServiceApi> = (ctx: ClientContext) => ({
  checks: {
    async list(params?: ListChecksRequest): Promise<ListChecksResponse> {
      const result = await ctx.transport<ListChecksResponse>({
        method: 'GET',
        endpoint: '/api/check/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListChecksResponse;
    },
  },
});
