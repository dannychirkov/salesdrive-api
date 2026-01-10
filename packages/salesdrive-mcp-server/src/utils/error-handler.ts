/**
 * Error Handler Utility
 */

import { logger } from './logger.js';

/**
 * Format error for MCP response
 */
export function formatError(error: unknown): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} {
  let message: string;

  if (error instanceof Error) {
    message = error.message;

    // Log the full error for debugging
    logger.error('Tool error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    message = String(error);
    logger.error('Unknown error', { error });
  }

  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `Error: ${message}`,
      },
    ],
  };
}

/**
 * Format success response for MCP
 */
export function formatSuccess(data: unknown): {
  content: Array<{ type: 'text'; text: string }>;
} {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}
