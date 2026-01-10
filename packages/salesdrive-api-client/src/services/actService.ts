/**
 * Act Service (Акти)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListActsRequest, ListActsResponse } from '../types/act.js';

/**
 * Act service API
 */
export interface ActServiceApi {
  readonly acts: {
    /**
     * List acts with filters
     */
    list(params?: ListActsRequest): Promise<ListActsResponse>;
  };
}

/**
 * Act service plugin
 */
export const actService: ServicePlugin<ActServiceApi> = (ctx: ClientContext) => ({
  acts: {
    async list(params?: ListActsRequest): Promise<ListActsResponse> {
      const result = await ctx.transport<ListActsResponse>({
        method: 'GET',
        endpoint: '/api/act/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListActsResponse;
    },
  },
});
