/**
 * Sales Invoice Types (Видаткові накладні)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  OrderReference,
  DocumentItem,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Full sales invoice entity
 */
export interface SalesInvoice {
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
  readonly addressDelivery?: string;
  readonly base?: string;
  readonly token?: string;
  readonly documentItems?: DocumentItem[];
  readonly organizationAccount?: OrganizationAccount;
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly order?: OrderReference;
}

/**
 * Parameters for listing sales invoices
 */
export interface ListSalesInvoicesRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list sales invoices
 */
export interface ListSalesInvoicesResponse {
  readonly status: 'success' | 'error';
  readonly data?: SalesInvoice[];
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
