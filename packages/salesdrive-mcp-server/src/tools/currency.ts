/**
 * Currency Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Currency tool definitions
 */
export const currencyTools: Tool[] = [
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
          description: 'Array of currency rates to update',
          items: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'Currency code (e.g., USD, EUR)',
              },
              rate: {
                type: 'number',
                description: 'Exchange rate to UAH',
              },
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
 * Handle currency tool calls
 */
export async function handleCurrencyTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
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
        return formatError(new Error(`Unknown currency tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
