/**
 * Sales Invoice Tools for MCP Server (Видаткові накладні)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Sales Invoice tool definitions
 */
export const salesInvoiceTools: Tool[] = [
  {
    name: 'sales_invoice_list',
    description: 'List sales invoices (Видаткові накладні) from SalesDrive',
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
        contactId: {
          type: 'number',
          description: 'Filter by contact ID',
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
 * Handle sales invoice tool calls
 */
export async function handleSalesInvoiceTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'sales_invoice_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.orderId) params['filter[orderId]'] = args.orderId;
        if (args.contactId) params['filter[contactId]'] = args.contactId;
        if (args.dateFrom) params['filter[date][from]'] = args.dateFrom;
        if (args.dateTo) params['filter[date][to]'] = args.dateTo;

        const result = await client.salesInvoices.list(params);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown sales invoice tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
