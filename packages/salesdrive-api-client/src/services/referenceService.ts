/**
 * Reference Service
 *
 * Handles reference data (payment methods, delivery methods, statuses).
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  PaymentMethodsResponse,
  DeliveryMethodsResponse,
  OrderStatusesResponse,
} from '../types/reference.js';

/**
 * Reference service API
 */
export interface ReferenceServiceApi {
  readonly reference: {
    /**
     * Get available payment methods
     */
    getPaymentMethods(): Promise<PaymentMethodsResponse>;

    /**
     * Get available delivery methods
     */
    getDeliveryMethods(): Promise<DeliveryMethodsResponse>;

    /**
     * Get order statuses
     */
    getStatuses(): Promise<OrderStatusesResponse>;
  };
}

/**
 * Reference service plugin
 */
export const referenceService: ServicePlugin<ReferenceServiceApi> = (ctx: ClientContext) => ({
  reference: {
    async getPaymentMethods(): Promise<PaymentMethodsResponse> {
      const result = await ctx.transport<PaymentMethodsResponse>({
        method: 'GET',
        endpoint: '/api/payment-methods/',
      });
      return result.data as PaymentMethodsResponse;
    },

    async getDeliveryMethods(): Promise<DeliveryMethodsResponse> {
      const result = await ctx.transport<DeliveryMethodsResponse>({
        method: 'GET',
        endpoint: '/api/delivery-methods/',
      });
      return result.data as DeliveryMethodsResponse;
    },

    async getStatuses(): Promise<OrderStatusesResponse> {
      const result = await ctx.transport<OrderStatusesResponse>({
        method: 'GET',
        endpoint: '/api/statuses/',
      });
      return result.data as OrderStatusesResponse;
    },
  },
});
