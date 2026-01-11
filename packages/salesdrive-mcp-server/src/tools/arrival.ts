/**
 * Arrival Tools for MCP Server (Product Arrivals / Надходження товарів)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Arrival tool definitions
 */
export const arrivalTools: Tool[] = [
  {
    name: 'arrival_list',
    description: 'List product arrivals (Надходження товарів) from SalesDrive',
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
        warehouseId: {
          type: 'number',
          description: 'Filter by warehouse ID',
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
 * Handle arrival tool calls
 */
export async function handleArrivalTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'arrival_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.warehouseId) params['filter[warehouseId]'] = args.warehouseId;
        if (args.dateFrom) params['filter[date][from]'] = args.dateFrom;
        if (args.dateTo) params['filter[date][to]'] = args.dateTo;

        const result = await client.arrivals.list(params);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown arrival tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
