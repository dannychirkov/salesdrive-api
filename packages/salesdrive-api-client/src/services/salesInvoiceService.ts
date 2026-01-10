/**
 * Sales Invoice Service (Видаткові накладні)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  ListSalesInvoicesRequest,
  ListSalesInvoicesResponse,
} from '../types/salesInvoice.js';

/**
 * Sales invoice service API
 */
export interface SalesInvoiceServiceApi {
  readonly salesInvoices: {
    /**
     * List sales invoices with filters
     */
    list(params?: ListSalesInvoicesRequest): Promise<ListSalesInvoicesResponse>;
  };
}

/**
 * Sales invoice service plugin
 */
export const salesInvoiceService: ServicePlugin<SalesInvoiceServiceApi> = (
  ctx: ClientContext
) => ({
  salesInvoices: {
    async list(params?: ListSalesInvoicesRequest): Promise<ListSalesInvoicesResponse> {
      const result = await ctx.transport<ListSalesInvoicesResponse>({
        method: 'GET',
        endpoint: '/api/sales-invoice/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListSalesInvoicesResponse;
    },
  },
});
