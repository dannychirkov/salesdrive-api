/**
 * Reference Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Reference tool definitions
 */
export const referenceTools: Tool[] = [
  {
    name: 'reference_get_payment_methods',
    description: 'Get available payment methods from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reference_get_delivery_methods',
    description: 'Get available delivery methods from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'reference_get_statuses',
    description: 'Get order statuses from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'currency_get',
    description: 'Get current currency exchange rates from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'currency_update',
    description: 'Update currency exchange rates in SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {
        currencies: {
          type: 'array',
          description: 'Currency rates to update',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Currency code (e.g., USD, EUR)' },
              rate: { type: 'number', description: 'Exchange rate' },
            },
            required: ['code', 'rate'],
          },
        },
      },
      required: ['currencies'],
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle reference tool calls
 */
export async function handleReferenceTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'reference_get_payment_methods': {
        const result = await client.reference.getPaymentMethods();
        return formatSuccess(result.data);
      }

      case 'reference_get_delivery_methods': {
        const result = await client.reference.getDeliveryMethods();
        return formatSuccess(result.data);
      }

      case 'reference_get_statuses': {
        const result = await client.reference.getStatuses();
        return formatSuccess(result.data);
      }

      case 'currency_get': {
        const result = await client.currencies.get();
        return formatSuccess(result);
      }

      case 'currency_update': {
        const currencies = args.currencies as Array<{ code: string; rate: number }>;
        const result = await client.currencies.update({ currencies });
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown reference tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
