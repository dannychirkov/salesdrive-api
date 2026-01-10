/**
 * Contract Types (Договори)
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  OrderReference,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Full contract entity
 */
export interface Contract {
  readonly id: number;
  readonly number: string;
  readonly date: string;
  readonly userId?: number;
  readonly comment?: string;
  readonly payerTypeId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly responsibleId?: number;
  readonly token?: string;
  readonly organizationAccount?: OrganizationAccount;
  readonly organization?: Organization;
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
  readonly order?: OrderReference;
}

/**
 * Parameters for listing contracts
 */
export interface ListContractsRequest extends ListRequestParams, DateFilterParams {}

/**
 * Response from list contracts
 */
export interface ListContractsResponse {
  readonly status: 'success' | 'error';
  readonly data?: Contract[];
  readonly pagination?: {
    readonly currentPage: number;
    readonly pageCount: number;
    readonly perPage: number;
  };
  readonly totals?: {
    readonly count: number;
  };
}
