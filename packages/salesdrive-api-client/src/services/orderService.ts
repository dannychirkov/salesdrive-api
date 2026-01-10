/**
 * Order Service
 *
 * Handles order creation, updates, and listing.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  ListOrdersRequest,
  ListOrdersResponse,
} from '../types/order.js';

/**
 * Order service API
 */
export interface OrderServiceApi {
  readonly orders: {
    /**
     * Create a new order
     */
    create(request: CreateOrderRequest): Promise<CreateOrderResponse>;

    /**
     * Update an existing order
     */
    update(request: UpdateOrderRequest): Promise<UpdateOrderResponse>;

    /**
     * List orders with filters
     */
    list(params?: ListOrdersRequest): Promise<ListOrdersResponse>;
  };
}

/**
 * Order service plugin
 */
export const orderService: ServicePlugin<OrderServiceApi> = (ctx: ClientContext) => ({
  orders: {
    async create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
      const result = await ctx.transport<CreateOrderResponse>({
        method: 'POST',
        endpoint: '/handler/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as CreateOrderResponse;
    },

    async update(request: UpdateOrderRequest): Promise<UpdateOrderResponse> {
      const result = await ctx.transport<UpdateOrderResponse>({
        method: 'POST',
        endpoint: '/api/order/update/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as UpdateOrderResponse;
    },

    async list(params?: ListOrdersRequest): Promise<ListOrdersResponse> {
      const result = await ctx.transport<ListOrdersResponse>({
        method: 'GET',
        endpoint: '/api/order/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListOrdersResponse;
    },
  },
});
