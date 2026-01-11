/**
 * Check Tools for MCP Server (Fiscal Receipts / Чеки)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Check tool definitions
 */
export const checkTools: Tool[] = [
  {
    name: 'check_list',
    description: 'List fiscal receipts/checks (Чеки) from SalesDrive',
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
        orderId: {
          type: 'number',
          description: 'Filter by order ID',
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
 * Handle check tool calls
 */
export async function handleCheckTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'check_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.orderId) params['filter[orderId]'] = args.orderId;
        if (args.dateFrom) params['filter[date][from]'] = args.dateFrom;
        if (args.dateTo) params['filter[date][to]'] = args.dateTo;

        const result = await client.checks.list(params);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown check tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
