/**
 * Contact Types
 *
 * Shared contact structure used in orders, payments, invoices, etc.
 */

/**
 * Full contact entity
 */
export interface Contact {
  readonly id: number;
  readonly formId: number;
  readonly version?: number;
  readonly active?: number;
  readonly lName?: string;
  readonly fName?: string;
  readonly mName?: string;
  readonly phone?: string[];
  readonly email?: string[];
  readonly counterpartyId?: number;
  readonly company?: string;
  readonly comment?: string;
  readonly userId?: number;
  readonly telegram?: string;
  readonly instagramNick?: string;
  readonly dateOfBirth?: string;
  readonly createTime?: string;
  readonly leadsCount?: number;
  readonly leadsSalesCount?: number;
  readonly leadsSalesAmount?: number;
}

/**
 * Short contact reference (used in documents)
 */
export interface ContactReference {
  readonly id: number;
  readonly formId: number;
  readonly fName?: string;
  readonly lName?: string;
  readonly mName?: string;
}
