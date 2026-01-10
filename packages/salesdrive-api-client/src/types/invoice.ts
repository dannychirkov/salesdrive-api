/**
 * Invoice Types
 *
 * Types for invoice listing.
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  OrderReference,
  ContractReference,
  DocumentItem,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Full invoice entity
 */
export interface Invoice {
  readonly id: number;
  readonly number: string;
  readonly date: string;
  readonly payerTypeId?: number;
  readonly maxPaymentDate?: string;
  readonly userId?: number;
  readonly totalSum: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly nds?: number;
  readonly comment?: string;
  readonly responsibleId?: number;
  readonly token?: string;
  readonly documentItems?: DocumentItem[];
  readonly organizationAccount?: OrganizationAccount;
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly contract?: ContractReference;
  readonly order?: OrderReference;
  readonly payed?: number;
}

/**
 * Parameters for listing invoices
 */
export interface ListInvoicesRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list invoices
 */
export interface ListInvoicesResponse {
  readonly status: 'success' | 'error';
  readonly data?: Invoice[];
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
