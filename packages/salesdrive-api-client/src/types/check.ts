/**
 * Check Types (Fiscal Receipts / Чеки)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  Counterparty,
  OrderReference,
  DocumentItem,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Cashier reference
 */
export interface Cashier {
  readonly id: number;
  readonly name: string;
}

/**
 * Cash register reference
 */
export interface CashRegister {
  readonly id: number;
  readonly name: string;
  readonly code: string;
}

/**
 * Full check (fiscal receipt) entity
 */
export interface Check {
  readonly id: number;
  readonly date: string;
  readonly fiscalizationUserId?: number;
  readonly fiscalizationStatus?: 'done' | 'pending' | 'error';
  readonly responsibleId?: number;
  readonly payerTypeId?: number;
  readonly documentPaymentTypeId?: number;
  readonly userId?: number;
  readonly totalSum: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly comment?: string;
  readonly type?: number;
  readonly fiscalCode?: string;
  readonly return?: unknown | null;
  readonly hasReturn?: unknown | null;
  readonly cashier?: Cashier;
  readonly cashRegister?: CashRegister;
  readonly documentItems?: DocumentItem[];
  readonly discount?: number;
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly order?: OrderReference;
}

/**
 * Parameters for listing checks
 */
export interface ListChecksRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list checks
 */
export interface ListChecksResponse {
  readonly status: 'success' | 'error';
  readonly data?: Check[];
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
