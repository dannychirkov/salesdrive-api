/**
 * Currency Types
 *
 * Types for currency rate management.
 */

/**
 * Currency rate
 */
export interface CurrencyRate {
  readonly code: string;
  readonly abbreviation?: string;
  readonly rate: number;
}

/**
 * Request to update currency rates
 */
export interface UpdateCurrencyRequest {
  readonly currencies: Array<{
    readonly code: string;
    readonly rate: number;
  }>;
}

/**
 * Response from update currency rates
 */
export interface UpdateCurrencyResponse {
  readonly status: 'success' | 'error';
}

/**
 * Response from get currency rates
 */
export interface GetCurrencyResponse {
  readonly baseCurrency: string;
  readonly currencies: CurrencyRate[];
}
