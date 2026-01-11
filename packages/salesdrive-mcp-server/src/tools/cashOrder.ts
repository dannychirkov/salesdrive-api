/**
 * Cash Order Tools for MCP Server (Касові ордери)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Cash Order tool definitions
 */
export const cashOrderTools: Tool[] = [
  {
    name: 'cash_order_list',
    description: 'List cash orders (Касові ордери) from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
        limit: {
          type: 'number',
          description: 'Results per page (default: 50, max: 100)',
        },
        type: {
          type: 'string',
          description: 'Order type: incoming or outgoing',
          enum: ['incoming', 'outgoing'],
        },
        dateFrom: {
          type: 'string',
          description: 'Filter from date (YYYY-MM-DD)',
        },
        dateTo: {
          type: 'string',
          description: 'Filter to date (YYYY-MM-DD)',
        },
      },
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle cash order tool calls
 */
export async function handleCashOrderTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'cash_order_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.type) params['filter[type]'] = args.type;
        if (args.dateFrom) params['filter[date][from]'] = args.dateFrom;
        if (args.dateTo) params['filter[date][to]'] = args.dateTo;

        const result = await client.cashOrders.list(params);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown cash order tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
