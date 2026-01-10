/**
 * Payment Service
 *
 * Handles payment registration and listing.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  AddPaymentRequest,
  AddPaymentResponse,
  ListPaymentsRequest,
  ListPaymentsResponse,
} from '../types/payment.js';

/**
 * Payment service API
 */
export interface PaymentServiceApi {
  readonly payments: {
    /**
     * Register a new payment
     */
    add(request: AddPaymentRequest): Promise<AddPaymentResponse>;

    /**
     * List payments with filters
     */
    list(params?: ListPaymentsRequest): Promise<ListPaymentsResponse>;
  };
}

/**
 * Payment service plugin
 */
export const paymentService: ServicePlugin<PaymentServiceApi> = (ctx: ClientContext) => ({
  payments: {
    async add(request: AddPaymentRequest): Promise<AddPaymentResponse> {
      const result = await ctx.transport<AddPaymentResponse>({
        method: 'POST',
        endpoint: '/api/payment/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as AddPaymentResponse;
    },

    async list(params?: ListPaymentsRequest): Promise<ListPaymentsResponse> {
      const result = await ctx.transport<ListPaymentsResponse>({
        method: 'GET',
        endpoint: '/api/payment/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListPaymentsResponse;
    },
  },
});
