/**
 * Call Types (Дзвінки)
 */

/**
 * Manager info from call response
 */
export interface CallManager {
  readonly name: string;
  readonly internal_number: string;
}

/**
 * Client info from call response
 */
export interface CallClient {
  readonly id: number;
  readonly fName: string;
  readonly lName: string;
  readonly mName: string;
  readonly company?: string;
}

/**
 * Response from call registration
 */
export interface CallResponse {
  readonly status: 'success' | 'error';
  readonly manager?: CallManager;
  readonly client?: CallClient;
}
