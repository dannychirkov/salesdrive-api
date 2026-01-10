/**
 * Cash Order Types (Касові ордери)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  Counterparty,
  OrderReference,
  ContractReference,
  InvoiceReference,
  DocumentItem,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Full cash order entity
 */
export interface CashOrder {
  readonly id: number;
  readonly number: string;
  readonly date: string;
  readonly userId?: number;
  readonly comment?: string;
  readonly totalSum: number;
  readonly nds?: number;
  readonly payerTypeId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly responsibleId?: number;
  readonly type?: 'incoming' | 'outcoming';
  readonly token?: string;
  readonly documentItems?: DocumentItem[];
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly contract?: ContractReference;
  readonly invoice?: InvoiceReference;
  readonly order?: OrderReference;
}

/**
 * Parameters for listing cash orders
 */
export interface ListCashOrdersRequest extends ListRequestParams, DateFilterParams {
  readonly type?: 'all' | 'incoming' | 'outcoming';
}

/**
 * Response from list cash orders
 */
export interface ListCashOrdersResponse {
  readonly status: 'success' | 'error';
  readonly data?: CashOrder[];
  readonly pagination?: {
    readonly currentPage: number;
    readonly pageCount: number;
    readonly perPage: number;
  };
  readonly totals?: {
    readonly count: number;
    readonly sum?: number;
  };
}
