/**
 * MCP Server Configuration
 */

/**
 * Server configuration interface
 */
export interface ServerConfig {
  /**
   * SalesDrive API key
   */
  apiKey: string;

  /**
   * Base URL for the API (e.g., https://demo.salesdrive.me)
   */
  baseUrl: string;

  /**
   * Log level
   */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): ServerConfig {
  const apiKey = process.env.SALESDRIVE_API_KEY;
  const baseUrl = process.env.SALESDRIVE_BASE_URL;
  const logLevel = (process.env.LOG_LEVEL || 'info') as ServerConfig['logLevel'];

  if (!apiKey) {
    throw new Error('SALESDRIVE_API_KEY environment variable is required');
  }

  if (!baseUrl) {
    throw new Error('SALESDRIVE_BASE_URL environment variable is required');
  }

  return {
    apiKey,
    baseUrl,
    logLevel,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: ServerConfig): void {
  if (!config.apiKey || config.apiKey.trim() === '') {
    throw new Error('API key cannot be empty');
  }

  if (!config.baseUrl || config.baseUrl.trim() === '') {
    throw new Error('Base URL cannot be empty');
  }

  try {
    new URL(config.baseUrl);
  } catch {
    throw new Error(`Invalid base URL: ${config.baseUrl}`);
  }
}
