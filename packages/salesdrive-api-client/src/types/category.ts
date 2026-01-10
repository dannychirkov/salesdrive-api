/**
 * Category Types
 *
 * Types for category management.
 */

/**
 * Category input for create/update
 */
export interface CategoryInput {
  readonly id: number;
  readonly name: string;
  readonly parentId?: number | null;
}

/**
 * Request to manage categories
 */
export interface CategoryActionRequest {
  readonly action: 'update' | 'delete';
  readonly category: CategoryInput[];
}

/**
 * Response from category actions
 */
export interface CategoryActionResponse {
  readonly status: 'success' | 'error';
  readonly message: string;
}
