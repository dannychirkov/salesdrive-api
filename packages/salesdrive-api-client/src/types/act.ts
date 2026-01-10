/**
 * Act Types (Акти)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  OrderReference,
  ContractReference,
  InvoiceReference,
  DocumentItem,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Full act entity
 */
export interface Act {
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
  readonly token?: string;
  readonly documentItems?: DocumentItem[];
  readonly organizationAccount?: OrganizationAccount;
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly contract?: ContractReference;
  readonly invoice?: InvoiceReference;
  readonly order?: OrderReference;
}

/**
 * Parameters for listing acts
 */
export interface ListActsRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list acts
 */
export interface ListActsResponse {
  readonly status: 'success' | 'error';
  readonly data?: Act[];
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
