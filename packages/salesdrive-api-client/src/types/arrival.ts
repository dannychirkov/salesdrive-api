/**
 * Product Arrival Types (Надходження товарів)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  Counterparty,
  DocumentProduct,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Arrival document item
 */
export interface ArrivalDocumentItem {
  readonly price: string;
  readonly count: string;
  readonly product?: DocumentProduct;
}

/**
 * Full product arrival entity
 */
export interface ProductArrival {
  readonly id: number;
  readonly date: string;
  readonly userId?: number;
  readonly comment?: string | null;
  readonly totalSum: number;
  readonly totalCount: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly formId?: number;
  readonly responsibleId?: number;
  readonly stockId?: number;
  readonly sourceStockId?: number;
  readonly type?: string;
  readonly inventoryId?: number;
  readonly organization?: Organization;
  readonly documentItems?: ArrivalDocumentItem[];
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
}

/**
 * Parameters for listing product arrivals
 */
export interface ListArrivalsRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list product arrivals
 */
export interface ListArrivalsResponse {
  readonly status: 'success' | 'error';
  readonly data?: ProductArrival[];
  readonly pagination?: {
    readonly currentPage: number;
    readonly pageCount: number;
    readonly perPage: number;
  };
  readonly totals?: {
    readonly count: number;
    readonly sum?: number;
    readonly writeOffSum?: number;
  };
}
