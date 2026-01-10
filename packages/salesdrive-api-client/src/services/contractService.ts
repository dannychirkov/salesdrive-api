/**
 * Contract Service (Договори)
 */

import type { ClientContext, ServicePlugin } from '../core/client.js';
import type { ListContractsRequest, ListContractsResponse } from '../types/contract.js';

/**
 * Contract service API
 */
export interface ContractServiceApi {
  readonly contracts: {
    /**
     * List contracts with filters
     */
    list(params?: ListContractsRequest): Promise<ListContractsResponse>;
  };
}

/**
 * Contract service plugin
 */
export const contractService: ServicePlugin<ContractServiceApi> = (ctx: ClientContext) => ({
  contracts: {
    async list(params?: ListContractsRequest): Promise<ListContractsResponse> {
      const result = await ctx.transport<ListContractsResponse>({
        method: 'GET',
        endpoint: '/api/contract/list/',
        params: params as unknown as Record<string, unknown>,
      });
      return result.data as ListContractsResponse;
    },
  },
});
