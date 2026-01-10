/**
 * SalesDrive API Base Types
 *
 * Core response structures used across all API endpoints.
 */

/**
 * Standard SalesDrive API response wrapper
 */
export interface SalesDriveResponse<T = unknown> {
  readonly success?: boolean;
  readonly status?: 'success' | 'error';
  readonly data?: T;
  readonly message?: string;
  readonly pagination?: PaginationInfo;
  readonly totals?: TotalsInfo;
  readonly meta?: MetaInfo;
}

/**
 * Pagination information returned with list endpoints
 */
export interface PaginationInfo {
  readonly currentPage: number;
  readonly pageCount: number;
  readonly perPage: number;
}

/**
 * Summary totals returned with list endpoints
 */
export interface TotalsInfo {
  readonly count: number;
  readonly sum?: number;
  readonly paymentAmount?: number;
  readonly commission?: number;
  readonly expenses?: number;
  readonly writeOffSum?: number;
}

/**
 * Metadata including custom fields
 */
export interface MetaInfo {
  readonly fields?: Record<string, unknown>;
  readonly contacts?: {
    readonly fields?: Record<string, unknown>;
  };
}

/**
 * Base parameters for list requests
 */
export interface ListRequestParams {
  readonly page?: number;
  readonly limit?: number;
}

/**
 * Common date filter parameters used by many list endpoints
 */
export interface DateFilterParams {
  readonly 'filter[updateAt][from]'?: string;
  readonly 'filter[updateAt][to]'?: string;
  readonly 'filter[updatedAt][from]'?: string;
  readonly 'filter[updatedAt][to]'?: string;
  readonly 'filter[date][from]'?: string;
  readonly 'filter[date][to]'?: string;
  readonly 'filter[createdAt][from]'?: string;
  readonly 'filter[createdAt][to]'?: string;
  readonly 'filter[organizationId][]'?: number;
}

/**
 * Organization entity
 */
export interface Organization {
  readonly id: number;
  readonly title: string;
  readonly egrpou?: string;
}

/**
 * Organization bank account
 */
export interface OrganizationAccount {
  readonly id: number;
  readonly title: string;
  readonly accountNumber: string;
}

/**
 * Counterparty entity (business partner)
 */
export interface Counterparty {
  readonly id: number;
  readonly egrpou?: string;
  readonly title?: string | null;
}

/**
 * Contract reference
 */
export interface ContractReference {
  readonly id: number;
  readonly number: string;
  readonly date: string;
}

/**
 * Invoice reference
 */
export interface InvoiceReference {
  readonly id: number;
  readonly number: string;
  readonly date: string;
}

/**
 * Order reference
 */
export interface OrderReference {
  readonly id: number;
  readonly formId: number;
}

/**
 * Unit of measurement
 */
export interface Unit {
  readonly id: number;
  readonly title: string;
}

/**
 * Document item (used in invoices, acts, etc.)
 */
export interface DocumentItem {
  readonly description: string;
  readonly price: string;
  readonly count: string;
  readonly percentDiscount?: number;
  readonly discount?: number;
  readonly product?: DocumentProduct;
  readonly unit?: Unit;
}

/**
 * Product reference in document
 */
export interface DocumentProduct {
  readonly id: number;
  readonly formId: number;
  readonly name: string;
  readonly nameTranslate?: string;
  readonly parameter?: string;
  readonly manufacturer?: string;
  readonly sku?: string;
  readonly barcode?: string;
  readonly documentName?: string;
}

/**
 * Success response for simple operations
 */
export interface SuccessResponse {
  readonly success: boolean;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  readonly success: false;
  readonly message: string;
}
