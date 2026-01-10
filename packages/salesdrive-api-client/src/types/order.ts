/**
 * Order Types
 *
 * Types for order management - the core of SalesDrive API.
 */

import type { Contact } from './contact.js';
import type {
  NovaPoshtaDelivery,
  UkrposhtaDelivery,
  MeestDelivery,
  RozetkaDelivery,
  OrderDeliveryData,
} from './delivery.js';
import type { OrderProduct } from './product.js';
import type { ListRequestParams, DateFilterParams } from './base.js';

/**
 * Product input for order creation
 */
export interface OrderProductInput {
  readonly id: string;
  readonly name?: string;
  readonly costPerItem: number;
  readonly amount: number;
  readonly description?: string;
  readonly discount?: string;
  readonly sku?: string;
  readonly commission?: string;
}

/**
 * Request to create a new order
 */
export interface CreateOrderRequest {
  // Result control
  readonly getResultData?: 0 | 1;

  // Customer info
  readonly lName?: string;
  readonly fName?: string;
  readonly mName?: string;
  readonly phone: string;
  readonly email?: string;
  readonly dateOfBirth?: string;

  // Products
  readonly products: OrderProductInput[];

  // Payment & Shipping
  readonly payment_method?: string;
  readonly shipping_method?: string;
  readonly shipping_address?: string;

  // Delivery providers
  readonly novaposhta?: NovaPoshtaDelivery;
  readonly ukrposhta?: UkrposhtaDelivery;
  readonly meest?: MeestDelivery;
  readonly rozetka_delivery?: RozetkaDelivery;

  // Contact comment
  readonly con_comment?: string;
  readonly con_telegram?: string;

  // Order metadata
  readonly comment?: string;
  readonly externalId?: string;
  readonly sajt?: string;
  readonly stockId?: number;
  readonly commission?: number;
  readonly costPrice?: number;
  readonly shipping_costs?: number;
  readonly organizationId?: number;
  readonly salesdrive_manager?: number;

  // UTM tracking
  readonly utmSourceFull?: string;
  readonly utmSource?: string;
  readonly utmMedium?: string;
  readonly utmCampaign?: string;
  readonly utmContent?: string;
  readonly utmTerm?: string;
  readonly utmPage?: string;
}

/**
 * Response from order creation
 */
export interface CreateOrderResponse {
  readonly success: boolean;
  readonly data?: {
    readonly orderId: number;
    readonly userId: number;
  };
}

/**
 * Data for order update
 */
export interface UpdateOrderData {
  readonly statusId?: number;
  readonly paymentDate?: string;
  readonly rejectionReasonId?: number;
  readonly salesdrive_manager?: number;
  readonly comment?: string;
  readonly payment_method?: string;
  readonly shipping_method?: string;
  readonly shipping_address?: string;
  readonly sajt?: string;
  readonly lName?: string;
  readonly fName?: string;
  readonly mName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly dateOfBirth?: string;
  readonly novaposhta?: { ttn?: string };
  readonly ukrposhta?: { ttn?: string };
  readonly meest?: { ttn?: string };
  readonly rozetka_delivery?: { ttn?: string };
}

/**
 * Request to update an order
 */
export interface UpdateOrderRequest {
  readonly id?: number;
  readonly externalId?: string;
  readonly data: UpdateOrderData;
}

/**
 * Response from order update
 */
export interface UpdateOrderResponse {
  readonly success: boolean;
}

/**
 * Parameters for listing orders
 */
export interface ListOrdersRequest extends ListRequestParams, DateFilterParams {
  readonly 'filter[orderTime][from]'?: string;
  readonly 'filter[orderTime][to]'?: string;
  readonly 'filter[statusId]'?: string;
  readonly 'filter[id][from]'?: number;
  readonly 'filter[id][to]'?: number;
  readonly 'filter[setStatusId][]'?: number[];
  readonly 'filter[setStatusTime][from]'?: string;
  readonly 'filter[setStatusTime][to]'?: string;
}

/**
 * Full order entity from API
 */
export interface Order {
  readonly id: number;
  readonly formId: number;
  readonly version?: number;
  readonly ord_delivery_data?: OrderDeliveryData[];
  readonly primaryContact?: Contact;
  readonly contacts?: Contact[];
  readonly products?: OrderProduct[];
  readonly shipping_method?: number;
  readonly payment_method?: string;
  readonly shipping_address?: string;
  readonly comment?: string;
  readonly organizationId?: number;
  readonly typeId?: number;
  readonly orderTime?: string;
  readonly updateAt?: string;
  readonly paymentDate?: string;
  readonly statusId?: number;
  readonly rejectionReason?: number | null;
  readonly userId?: number;
  readonly paymentAmount?: number;
  readonly costPriceAmount?: number;
  readonly shipping_costs?: number;
  readonly commissionAmount?: number;
  readonly expensesAmount?: number;
  readonly profitAmount?: number;
  readonly payedAmount?: number;
  readonly restPay?: number;
  readonly document_ord_check?: number;
  readonly discountAmount?: number;
  readonly sajt?: number;
  readonly externalId?: string;
  readonly utmPage?: string;
  readonly utmMedium?: string;
  readonly campaignId?: number;
  readonly utmSourceFull?: string;
  readonly utmSource?: string;
  readonly utmCampaign?: string;
  readonly utmContent?: string;
  readonly utmTerm?: string;
  readonly token?: string;
}

/**
 * Response from list orders endpoint
 */
export interface ListOrdersResponse {
  readonly status: 'success' | 'error';
  readonly data?: Order[];
  readonly meta?: {
    readonly fields?: Record<string, unknown>;
  };
  readonly pagination?: {
    readonly currentPage: number;
    readonly pageCount: number;
    readonly perPage: number;
  };
  readonly totals?: {
    readonly count: number;
    readonly paymentAmount?: number;
    readonly commission?: number;
    readonly expenses?: number;
  };
}
