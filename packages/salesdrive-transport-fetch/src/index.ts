/**
 * SalesDrive Fetch Transport
 *
 * Fetch-based HTTP transport implementation for SalesDrive API.
 *
 * @packageDocumentation
 */

import type {
  HttpRequestConfig,
  HttpTransportResult,
  TransportFunction,
  SalesDriveResponse,
} from '@dannychirkov/salesdrive-api-client';

/**
 * Configuration for the fetch transport
 */
export interface FetchTransportConfig {
  /**
   * SalesDrive API key
   */
  readonly apiKey: string;

  /**
   * Base URL for the API (e.g., https://demo.salesdrive.me)
   */
  readonly baseUrl: string;

  /**
   * Additional headers to include in requests
   */
  readonly headers?: Record<string, string>;

  /**
   * Custom fetch implementation (useful for testing or Node.js < 18)
   */
  readonly fetch?: typeof fetch;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  readonly timeout?: number;
}

/**
 * Build URL with query parameters
 */
function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, unknown>): string {
  const url = new URL(endpoint, baseUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters like filter[setStatusId][]
          for (const item of value) {
            url.searchParams.append(key, String(item));
          }
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    }
  }

  return url.toString();
}

/**
 * Create a fetch-based HTTP transport for SalesDrive API
 *
 * @param config - Transport configuration
 * @returns Transport function compatible with SalesDrive client
 *
 * @example
 * ```typescript
 * import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';
 * import { createClient, orderService } from '@dannychirkov/salesdrive-api-client';
 *
 * const transport = createFetchTransport({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://demo.salesdrive.me',
 * });
 *
 * const client = createClient({
 *   transport,
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://demo.salesdrive.me',
 * }).extend(orderService);
 *
 * const orders = await client.orders.list();
 * ```
 */
export function createFetchTransport(config: FetchTransportConfig): TransportFunction {
  const { apiKey, baseUrl, headers = {}, timeout = 30000 } = config;
  const fetchFn = config.fetch ?? fetch;

  return async <T>(
    requestConfig: HttpRequestConfig
  ): Promise<HttpTransportResult<SalesDriveResponse<T>>> => {
    const { method, endpoint, params, body, signal } = requestConfig;

    // Build URL with query params for GET requests
    const url =
      method === 'GET'
        ? buildUrl(baseUrl, endpoint, params)
        : new URL(endpoint, baseUrl).toString();

    // Set up abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    // Combine external signal with timeout signal
    const combinedSignal = signal
      ? ((): AbortSignal => {
          const combined = new AbortController();
          signal.addEventListener('abort', () => combined.abort());
          abortController.signal.addEventListener('abort', () => combined.abort());
          return combined.signal;
        })()
      : abortController.signal;

    try {
      const response = await fetchFn(url, {
        method,
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
        body: method === 'POST' && body ? JSON.stringify(body) : undefined,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch {
          // Use default error message
        }

        if (response.status === 401) {
          const error = new Error(errorMessage) as Error & { name: string };
          error.name = 'AuthenticationError';
          throw error;
        }

        if (response.status === 429) {
          const error = new Error(errorMessage) as Error & { name: string };
          error.name = 'RateLimitError';
          throw error;
        }

        // Handle SalesDrive's non-standard rate limit response (400 with "limit" in message)
        if (response.status === 400 && errorMessage.toLowerCase().includes('limit')) {
          const error = new Error(errorMessage) as Error & { name: string };
          error.name = 'RateLimitError';
          throw error;
        }

        const error = new Error(errorMessage) as Error & { name: string; statusCode: number };
        error.name = 'ApiError';
        error.statusCode = response.status;
        throw error;
      }

      const data = (await response.json()) as SalesDriveResponse<T>;

      return {
        status: response.status,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        // Re-throw our custom errors
        if (
          error.name === 'AuthenticationError' ||
          error.name === 'RateLimitError' ||
          error.name === 'ApiError'
        ) {
          throw error;
        }

        // Handle abort/timeout
        if (error.name === 'AbortError') {
          const timeoutError = new Error('Request timeout') as Error & { name: string };
          timeoutError.name = 'NetworkError';
          throw timeoutError;
        }

        // Wrap network errors
        const networkError = new Error(`Network error: ${error.message}`) as Error & {
          name: string;
          cause: Error;
        };
        networkError.name = 'NetworkError';
        networkError.cause = error;
        throw networkError;
      }

      throw error;
    }
  };
}

/**
 * Create transport with automatic retry for rate limiting
 *
 * @param config - Transport configuration
 * @param retryConfig - Retry configuration
 * @returns Transport function with retry logic
 */
export function createFetchTransportWithRetry(
  config: FetchTransportConfig,
  retryConfig: {
    maxRetries?: number;
    retryDelay?: number;
    retryMultiplier?: number;
  } = {}
): TransportFunction {
  const baseTransport = createFetchTransport(config);
  const { maxRetries = 3, retryDelay = 1000, retryMultiplier = 2 } = retryConfig;

  return async <T>(
    requestConfig: HttpRequestConfig
  ): Promise<HttpTransportResult<SalesDriveResponse<T>>> => {
    let lastError: Error | undefined;
    let delay = retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await baseTransport<T>(requestConfig);
      } catch (error) {
        if (error instanceof Error && error.name === 'RateLimitError') {
          lastError = error;

          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= retryMultiplier;
            continue;
          }
        }

        throw error;
      }
    }

    throw lastError;
  };
}
