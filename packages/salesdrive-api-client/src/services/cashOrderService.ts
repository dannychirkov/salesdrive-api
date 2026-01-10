/**
 * Cash Order Service (Касові ордери)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListCashOrdersRequest, ListCashOrdersResponse } from '../types/cashOrder.js';

/**
 * Cash order service API
 */
export interface CashOrderServiceApi {
  readonly cashOrders: {
    /**
     * List cash orders with filters
     */
    list(params?: ListCashOrdersRequest): Promise<ListCashOrdersResponse>;
  };
}

/**
 * Cash order service plugin
 */
export const cashOrderService: ServicePlugin<CashOrderServiceApi> = (ctx: ClientContext) => ({
  cashOrders: {
    async list(params?: ListCashOrdersRequest): Promise<ListCashOrdersResponse> {
      const result = await ctx.transport<ListCashOrdersResponse>({
        method: 'GET',
        endpoint: '/api/cash-order/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListCashOrdersResponse;
    },
  },
});
