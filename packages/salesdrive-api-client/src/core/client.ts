/**
 * SalesDrive API Client Core
 *
 * Factory function and plugin system for creating typed API clients.
 */

import type { TransportFunction } from '../http/transport.js';

/**
 * Client context passed to all service plugins
 */
export interface ClientContext {
  readonly transport: TransportFunction;
  readonly baseUrl: string;
  readonly apiKey: string;
}

/**
 * Service plugin function type
 */
export type ServicePlugin<T> = (ctx: ClientContext) => T;

/**
 * Base client type with extend capability
 */
export interface Client<API extends object = object> {
  /**
   * Extend client with additional service plugins
   */
  extend<T extends object>(plugin: ServicePlugin<T>): Client<API & T> & API & T;
}

/**
 * Create a new SalesDrive API client
 *
 * @param ctx - Client context with transport and configuration
 * @returns Client instance with extend capability
 *
 * @example
 * ```typescript
 * import { createClient, orderService, referenceService } from '@dannychirkov/salesdrive-api-client';
 * import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';
 *
 * const transport = createFetchTransport({
 *   baseUrl: 'https://demo.salesdrive.me',
 *   apiKey: 'your-api-key',
 * });
 *
 * const client = createClient({ transport, baseUrl: 'https://demo.salesdrive.me', apiKey: 'your-api-key' })
 *   .extend(orderService)
 *   .extend(referenceService);
 *
 * // Now you can use:
 * // client.orders.list()
 * // client.reference.getPaymentMethods()
 * ```
 */
export function createClient<API extends object = object>(
  ctx: ClientContext
): Client<API> & API {
  const api: Record<string, unknown> = {};

  const clientMethods = {
    extend<T extends object>(plugin: ServicePlugin<T>): Client<API & T> & API & T {
      const service = plugin(ctx);
      Object.assign(api, service);
      return proxy as Client<API & T> & API & T;
    },
  };

  // Create proxy that exposes both client methods and API services
  const proxy = new Proxy(clientMethods, {
    get(target, prop: string | symbol) {
      if (typeof prop === 'string') {
        // First check client methods
        if (prop in target) {
          return (target as Record<string, unknown>)[prop];
        }
        // Then check API services
        if (prop in api) {
          return api[prop];
        }
      }
      return undefined;
    },
    has(_target, prop: string | symbol) {
      if (typeof prop === 'string') {
        return prop in clientMethods || prop in api;
      }
      return false;
    },
  });

  return proxy as Client<API> & API;
}
