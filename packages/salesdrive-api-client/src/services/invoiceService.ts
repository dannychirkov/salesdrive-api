/**
 * Invoice Service
 *
 * Handles invoice listing.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListInvoicesRequest, ListInvoicesResponse } from '../types/invoice.js';

/**
 * Invoice service API
 */
export interface InvoiceServiceApi {
  readonly invoices: {
    /**
     * List invoices with filters
     */
    list(params?: ListInvoicesRequest): Promise<ListInvoicesResponse>;
  };
}

/**
 * Invoice service plugin
 */
export const invoiceService: ServicePlugin<InvoiceServiceApi> = (ctx: ClientContext) => ({
  invoices: {
    async list(params?: ListInvoicesRequest): Promise<ListInvoicesResponse> {
      const result = await ctx.transport<ListInvoicesResponse>({
        method: 'GET',
        endpoint: '/api/invoice/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListInvoicesResponse;
    },
  },
});
