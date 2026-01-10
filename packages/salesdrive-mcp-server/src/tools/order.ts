/**
 * Order Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Order tool definitions
 */
export const orderTools: Tool[] = [
  {
    name: 'order_list',
    description: 'List orders from SalesDrive CRM with optional filters',
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
        statusId: {
          type: 'string',
          description: 'Filter by status ID. Special values: __NOTDELETED__ (all except deleted), __ALL__ (all)',
        },
        orderTimeFrom: {
          type: 'string',
          description: 'Order creation date from (YYYY-MM-DD HH:MM:SS)',
        },
        orderTimeTo: {
          type: 'string',
          description: 'Order creation date to (YYYY-MM-DD HH:MM:SS)',
        },
      },
    },
  },
  {
    name: 'order_create',
    description: 'Create a new order in SalesDrive CRM',
    inputSchema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'Customer phone number (required)',
        },
        firstName: {
          type: 'string',
          description: 'Customer first name',
        },
        lastName: {
          type: 'string',
          description: 'Customer last name',
        },
        email: {
          type: 'string',
          description: 'Customer email',
        },
        products: {
          type: 'array',
          description: 'Products in the order',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Product ID' },
              name: { type: 'string', description: 'Product name' },
              price: { type: 'number', description: 'Price per item' },
              quantity: { type: 'number', description: 'Quantity' },
            },
            required: ['id', 'price', 'quantity'],
          },
        },
        paymentMethod: {
          type: 'string',
          description: 'Payment method (e.g., cash, card)',
        },
        shippingMethod: {
          type: 'string',
          description: 'Shipping method (e.g., novaposhta, pickup)',
        },
        comment: {
          type: 'string',
          description: 'Order comment',
        },
      },
      required: ['phone', 'products'],
    },
  },
  {
    name: 'order_update',
    description: 'Update an existing order in SalesDrive CRM',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Order ID (internal)',
        },
        externalId: {
          type: 'string',
          description: 'External order ID (from your system)',
        },
        statusId: {
          type: 'number',
          description: 'New status ID',
        },
        comment: {
          type: 'string',
          description: 'Updated comment',
        },
        trackingNumber: {
          type: 'string',
          description: 'Nova Poshta tracking number (TTN)',
        },
      },
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle order tool calls
 */
export async function handleOrderTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'order_list': {
        const params: Record<string, unknown> = {};
        if (args.page) params.page = args.page;
        if (args.limit) params.limit = args.limit;
        if (args.statusId) params['filter[statusId]'] = args.statusId;
        if (args.orderTimeFrom) params['filter[orderTime][from]'] = args.orderTimeFrom;
        if (args.orderTimeTo) params['filter[orderTime][to]'] = args.orderTimeTo;

        const result = await client.orders.list(params);
        return formatSuccess({
          orders: result.data,
          pagination: result.pagination,
          totals: result.totals,
        });
      }

      case 'order_create': {
        const products = (args.products as Array<{ id: string; name?: string; price: number; quantity: number }>)
          .map((p) => ({
            id: p.id,
            name: p.name,
            costPerItem: p.price,
            amount: p.quantity,
          }));

        const result = await client.orders.create({
          phone: args.phone as string,
          fName: args.firstName as string | undefined,
          lName: args.lastName as string | undefined,
          email: args.email as string | undefined,
          products,
          payment_method: args.paymentMethod as string | undefined,
          shipping_method: args.shippingMethod as string | undefined,
          comment: args.comment as string | undefined,
          getResultData: 1,
        });

        return formatSuccess(result);
      }

      case 'order_update': {
        const result = await client.orders.update({
          id: args.id as number | undefined,
          externalId: args.externalId as string | undefined,
          data: {
            statusId: args.statusId as number | undefined,
            comment: args.comment as string | undefined,
            novaposhta: args.trackingNumber
              ? { ttn: args.trackingNumber as string }
              : undefined,
          },
        });

        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown order tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
