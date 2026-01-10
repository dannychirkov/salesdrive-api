/**
 * Webhook Types
 *
 * Types for webhook payloads sent by SalesDrive.
 */

import type { Contact } from './contact.js';
import type { OrderDeliveryData } from './delivery.js';

/**
 * Webhook info header
 */
export interface WebhookInfo {
  readonly webhookType: string;
  readonly webhookEvent: 'new_order' | 'status_change' | string;
  readonly account: string;
}

/**
 * Product in webhook payload
 */
export interface WebhookProduct {
  readonly formId?: number;
  readonly productId?: number;
  readonly parameter?: string;
  readonly name?: string;
  readonly nameTranslate?: string;
  readonly documentName?: string;
  readonly sku?: string;
  readonly barcode?: string;
  readonly amount: number;
  readonly price: number;
  readonly costPrice?: number;
  readonly discount?: number;
  readonly percentDiscount?: number;
  readonly commission?: number;
  readonly percentCommission?: number;
  readonly description?: string;
  readonly stockId?: number;
  readonly mass?: number;
  readonly volume?: number;
  readonly length?: number;
  readonly width?: number;
  readonly height?: number;
  readonly restCount?: number;
  readonly manufacturer?: string;
  readonly keywords?: string;
  readonly preSale?: number;
  readonly isComplect?: number;
  readonly categoryId?: number;
  readonly categoryName?: string;
  readonly href?: string;
  readonly note?: string;
  readonly uktzed?: string;
  readonly exciseBarcodes?: string[];
}

/**
 * Order data in webhook payload
 */
export interface WebhookOrderData {
  readonly id: number;
  readonly formId: number;
  readonly version?: number;
  readonly externalId?: string;
  readonly orderTime?: string;
  readonly updateAt?: string;
  readonly statusId?: number;
  readonly paymentDate?: string;
  readonly rejectionReason?: number | null;
  readonly userId?: number;
  readonly ord_delivery_data?: OrderDeliveryData[];
  readonly contacts?: Contact[];
  readonly products?: WebhookProduct[];
  readonly payment_method?: number;
  readonly shipping_method?: number;
  readonly shipping_address?: string;
  readonly sajt?: number;
  readonly comment?: string;
  readonly typeId?: number;
  readonly paymentAmount?: number;
  readonly organizationId?: number;
  readonly document_ord_check?: number;
  readonly payedAmount?: number;
  readonly restPay?: number;
  readonly profitAmount?: number;
  readonly expensesAmount?: number;
  readonly discountAmount?: number;
  readonly campaignId?: number;
  readonly utmSourceFull?: string;
  readonly utmSource?: string;
  readonly utmCampaign?: string;
  readonly utmMedium?: string;
  readonly utmContent?: string;
  readonly utmTerm?: string;
  readonly utmPage?: string;
}

/**
 * Full webhook payload
 */
export interface WebhookPayload {
  readonly info: WebhookInfo;
  readonly data: WebhookOrderData;
  readonly meta?: {
    readonly fields?: Record<string, unknown>;
    readonly contacts?: {
      readonly fields?: Record<string, unknown>;
    };
  };
}
