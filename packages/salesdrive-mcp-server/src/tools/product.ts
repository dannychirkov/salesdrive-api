/**
 * Product Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Product tool definitions
 */
export const productTools: Tool[] = [
  {
    name: 'product_update',
    description: 'Add or update products in SalesDrive (batch operation, up to 100 products)',
    inputSchema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          description: 'Products to add/update',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Product ID' },
              name: { type: 'string', description: 'Product name' },
              price: { type: 'number', description: 'Product price' },
              sku: { type: 'string', description: 'SKU code' },
              stockBalance: { type: 'number', description: 'Stock quantity' },
              description: { type: 'string', description: 'Product description' },
            },
            required: ['id'],
          },
        },
        dontUpdateFields: {
          type: 'array',
          description: 'Fields to skip during update (e.g., ["price", "description"])',
          items: { type: 'string' },
        },
      },
      required: ['products'],
    },
  },
  {
    name: 'product_delete',
    description: 'Delete products from SalesDrive by ID',
    inputSchema: {
      type: 'object',
      properties: {
        productIds: {
          type: 'array',
          description: 'Product IDs to delete',
          items: { type: 'string' },
        },
      },
      required: ['productIds'],
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle product tool calls
 */
export async function handleProductTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'product_update': {
        const products = (args.products as Array<{
          id: string;
          name?: string;
          price?: number;
          sku?: string;
          stockBalance?: number;
          description?: string;
        }>).map((p) => ({
          id: p.id,
          name: p.name,
          costPerItem: p.price,
          sku: p.sku,
          stockBalance: p.stockBalance,
          description: p.description,
        }));

        const result = await client.products.update(products, {
          dontUpdateFields: args.dontUpdateFields as string[] | undefined,
        });

        return formatSuccess(result);
      }

      case 'product_delete': {
        const result = await client.products.delete(args.productIds as string[]);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown product tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
