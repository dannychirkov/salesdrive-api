/**
 * Payment Types
 *
 * Types for payment management in SalesDrive.
 */

import type {
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  OrderReference,
  InvoiceReference,
} from './base.js';
import type { ContactReference } from './contact.js';

/**
 * Request to add a payment
 */
export interface AddPaymentRequest {
  readonly organizationId?: number;
  readonly datetime?: string;
  readonly timezone?: string;
  readonly accountNumber?: string;
  readonly sum: number;
  readonly description?: string;
  readonly counterpartyName?: string;
  readonly counterpartyCode?: string;
  readonly counterpartyAccountNumber?: string;
  readonly counterpartyBankName?: string;
  readonly uniqueId?: string;
  readonly orderId?: number;
  readonly orderExternalId?: string | number;
  readonly formId?: number;
  readonly autoAttachToOrderType?: 'lastname_and_sum' | 'order_id' | 'none';
  readonly payerLastName?: string;
}

/**
 * Response from add payment
 */
export interface AddPaymentResponse {
  readonly success: boolean;
  readonly data?: {
    readonly paymentId: number;
  };
}

/**
 * Payment breakdown item
 */
export interface PaymentBreakdown {
  readonly sum: number;
  readonly invoice?: InvoiceReference;
  readonly order?: OrderReference;
}

/**
 * Full payment entity
 */
export interface Payment {
  readonly id: number;
  readonly date: string;
  readonly userId?: number;
  readonly comment?: string;
  readonly sum: number;
  readonly purpose?: string | null;
  readonly nds?: number;
  readonly payerTypeId?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly responsibleId?: number;
  readonly type?: 'incoming' | 'outcoming';
  readonly integrationTypeId?: number | null;
  readonly organizationAccount?: OrganizationAccount;
  readonly organization?: Organization;
  readonly paymentBreakdown?: PaymentBreakdown[];
  readonly contact?: ContactReference;
  readonly counterparty?: Counterparty;
}

/**
 * Parameters for listing payments
 */
export interface ListPaymentsRequest extends ListRequestParams, DateFilterParams {
  readonly type?: 'all' | 'incoming' | 'outcoming';
}

/**
 * Response from list payments
 */
export interface ListPaymentsResponse {
  readonly status: 'success' | 'error';
  readonly data?: Payment[];
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
