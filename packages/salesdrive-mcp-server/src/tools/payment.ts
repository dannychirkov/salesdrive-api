/**
 * Payment Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Payment tool definitions
 */
export const paymentTools: Tool[] = [
  {
    name: 'payment_add',
    description: 'Register a new payment in SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {
        sum: {
          type: 'number',
          description: 'Payment amount (required)',
        },
        orderId: {
          type: 'number',
          description: 'Order ID to attach payment to',
        },
        description: {
          type: 'string',
          description: 'Payment description',
        },
        datetime: {
          type: 'string',
          description: 'Payment date and time (YYYY-MM-DD HH:MM:SS)',
        },
        counterpartyName: {
          type: 'string',
          description: 'Name of the payer',
        },
      },
      required: ['sum'],
    },
  },
  {
    name: 'payment_list',
    description: 'List payments from SalesDrive with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number',
        },
        limit: {
          type: 'number',
          description: 'Results per page (max: 100)',
        },
        type: {
          type: 'string',
          enum: ['all', 'incoming', 'outcoming'],
          description: 'Payment type filter',
        },
        dateFrom: {
          type: 'string',
          description: 'Payment date from (YYYY-MM-DD HH:MM:SS)',
        },
        dateTo: {
          type: 'string',
          description: 'Payment date to (YYYY-MM-DD HH:MM:SS)',
        },
      },
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle payment tool calls
 */
export async function handlePaymentTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'payment_add': {
        const result = await client.payments.add({
          sum: args.sum as number,
          orderId: args.orderId as number | undefined,
          description: args.description as string | undefined,
          datetime: args.datetime as string | undefined,
          counterpartyName: args.counterpartyName as string | undefined,
        });

        return formatSuccess(result);
      }

      case 'payment_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.type) params.type = args.type;
        if (args.dateFrom) params['filter[date][from]'] = args.dateFrom;
        if (args.dateTo) params['filter[date][to]'] = args.dateTo;

        const result = await client.payments.list(params);
        return formatSuccess({
          payments: result.data,
          pagination: result.pagination,
          totals: result.totals,
        });
      }

      default:
        return formatError(new Error(`Unknown payment tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
