/**
 * Reference Types
 *
 * Types for reference data (payment methods, delivery methods, statuses).
 */

/**
 * Payment method reference
 */
export interface PaymentMethod {
  readonly id: number;
  readonly name: string;
  readonly parameter?: string;
}

/**
 * Delivery method reference
 */
export interface DeliveryMethod {
  readonly id: number;
  readonly name: string;
  readonly parameter?: string;
}

/**
 * Order status reference
 */
export interface OrderStatus {
  readonly id: number;
  readonly name: string;
  readonly type?: number;
}

/**
 * Response for payment methods
 */
export interface PaymentMethodsResponse {
  readonly success: boolean;
  readonly data?: PaymentMethod[];
}

/**
 * Response for delivery methods
 */
export interface DeliveryMethodsResponse {
  readonly success: boolean;
  readonly data?: DeliveryMethod[];
}

/**
 * Response for order statuses
 */
export interface OrderStatusesResponse {
  readonly success: boolean;
  readonly data?: OrderStatus[];
}
