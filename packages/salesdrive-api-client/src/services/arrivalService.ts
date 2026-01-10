/**
 * Arrival Service (Product Arrivals / Надходження товарів)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListArrivalsRequest, ListArrivalsResponse } from '../types/arrival.js';

/**
 * Arrival service API
 */
export interface ArrivalServiceApi {
  readonly arrivals: {
    /**
     * List product arrivals with filters
     */
    list(params?: ListArrivalsRequest): Promise<ListArrivalsResponse>;
  };
}

/**
 * Arrival service plugin
 */
export const arrivalService: ServicePlugin<ArrivalServiceApi> = (ctx: ClientContext) => ({
  arrivals: {
    async list(params?: ListArrivalsRequest): Promise<ListArrivalsResponse> {
      const result = await ctx.transport<ListArrivalsResponse>({
        method: 'GET',
        endpoint: '/api/arrival-product/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListArrivalsResponse;
    },
  },
});
