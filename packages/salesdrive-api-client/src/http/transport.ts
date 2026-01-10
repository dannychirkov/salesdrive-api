/**
 * HTTP Transport Interface
 *
 * Defines the contract for HTTP transport implementations.
 */

import type { SalesDriveResponse } from '../types/base.js';

/**
 * HTTP request configuration
 */
export interface HttpRequestConfig {
  readonly method: 'GET' | 'POST';
  readonly endpoint: string;
  readonly params?: Record<string, unknown>;
  readonly body?: Record<string, unknown>;
  readonly signal?: AbortSignal;
}

/**
 * HTTP transport result
 */
export interface HttpTransportResult<T> {
  readonly status: number;
  readonly data: T;
}

/**
 * HTTP transport interface that all transport implementations must follow
 */
export interface HttpTransport {
  request<T>(config: HttpRequestConfig): Promise<HttpTransportResult<SalesDriveResponse<T>>>;
}

/**
 * Type for the raw transport function (used internally)
 */
export type TransportFunction = <T>(
  config: HttpRequestConfig
) => Promise<HttpTransportResult<SalesDriveResponse<T>>>;
