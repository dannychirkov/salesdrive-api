/**
 * Currency Service
 *
 * Handles currency rate management.
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type {
  GetCurrencyResponse,
  UpdateCurrencyRequest,
  UpdateCurrencyResponse,
} from '../types/currency.js';

/**
 * Currency service API
 */
export interface CurrencyServiceApi {
  readonly currencies: {
    /**
     * Get current currency rates
     */
    get(): Promise<GetCurrencyResponse>;

    /**
     * Update currency rates
     */
    update(request: UpdateCurrencyRequest): Promise<UpdateCurrencyResponse>;
  };
}

/**
 * Currency service plugin
 */
export const currencyService: ServicePlugin<CurrencyServiceApi> = (ctx: ClientContext) => ({
  currencies: {
    async get(): Promise<GetCurrencyResponse> {
      const result = await ctx.transport<GetCurrencyResponse>({
        method: 'GET',
        endpoint: '/api/currencies/',
      });
      return result.data as GetCurrencyResponse;
    },

    async update(request: UpdateCurrencyRequest): Promise<UpdateCurrencyResponse> {
      const result = await ctx.transport<UpdateCurrencyResponse>({
        method: 'POST',
        endpoint: '/api/currencies/',
        body: request as unknown as Record<string, unknown>,
      });
      return result.data as UpdateCurrencyResponse;
    },
  },
});
