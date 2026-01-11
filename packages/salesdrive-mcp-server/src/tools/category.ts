/**
 * Category Tools for MCP Server
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { formatSuccess, formatError } from '../utils/error-handler.js';
import { logger } from '../utils/logger.js';

/**
 * Category tool definitions
 */
export const categoryTools: Tool[] = [
  {
    name: 'category_update',
    description: 'Add or update product categories in SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          description: 'Array of categories to add/update',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Category ID (for update, omit for create)',
              },
              name: {
                type: 'string',
                description: 'Category name',
              },
              parentId: {
                type: 'number',
                description: 'Parent category ID (0 for root)',
              },
              externalId: {
                type: 'string',
                description: 'External ID from your system',
              },
            },
            required: ['name'],
          },
        },
      },
      required: ['categories'],
    },
  },
  {
    name: 'category_delete',
    description: 'Delete product categories from SalesDrive',
    inputSchema: {
      type: 'object',
      properties: {
        categoryIds: {
          type: 'array',
          description: 'Array of category IDs to delete',
          items: {
            type: 'number',
          },
        },
      },
      required: ['categoryIds'],
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

/**
 * Handle category tool calls
 */
export async function handleCategoryTool(
  toolName: string,
  args: Record<string, unknown>,
  client: AnyClient
) {
  logger.debug(`Handling tool: ${toolName}`, args);

  try {
    switch (toolName) {
      case 'category_update': {
        const categories = args.categories as Array<{
          id?: number;
          name: string;
          parentId?: number;
          externalId?: string;
        }>;
        const result = await client.categories.update(categories);
        return formatSuccess(result);
      }

      case 'category_delete': {
        const categoryIds = args.categoryIds as number[];
        const result = await client.categories.delete(categoryIds);
        return formatSuccess(result);
      }

      default:
        return formatError(new Error(`Unknown category tool: ${toolName}`));
    }
  } catch (error) {
    return formatError(error);
  }
}
