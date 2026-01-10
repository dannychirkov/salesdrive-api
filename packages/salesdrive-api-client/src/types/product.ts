/**
 * Product Types
 *
 * Types for product management in SalesDrive.
 */

/**
 * Product discount structure
 */
export interface ProductDiscount {
  readonly value: string;
  readonly date_start?: string;
  readonly date_end?: string;
}

/**
 * Product parameter (custom attribute)
 */
export interface ProductParam {
  readonly name: string;
  readonly type?: 'select' | 'text' | 'number';
  readonly value: string;
}

/**
 * Additional price tier (e.g., wholesale)
 */
export interface AdditionalPrice {
  readonly priceType: string;
  readonly priceValue: number;
  readonly priceCurrency?: string;
  readonly priceDiscount?: string;
}

/**
 * Product image
 */
export interface ProductImage {
  readonly fullsize: string;
}

/**
 * Product category reference
 */
export interface ProductCategory {
  readonly id?: number;
  readonly name?: string;
}

/**
 * Product set item (for bundle products)
 */
export interface ProductSetItem {
  readonly id: string;
  readonly quantity: number;
}

/**
 * Product input for create/update operations
 */
export interface ProductInput {
  readonly id: string;
  readonly name?: string;
  readonly nameTranslate?: string;
  readonly nameForDocuments?: string;
  readonly description?: string;
  readonly descriptionTranslate?: string;
  readonly costPerItem?: number;
  readonly sku?: string;
  readonly manufacturer?: string;
  readonly currency?: string;
  readonly discount?: ProductDiscount;
  readonly weight?: number;
  readonly volume?: number;
  readonly length?: number;
  readonly width?: number;
  readonly height?: number;
  readonly barcode?: string;
  readonly stockBalance?: number;
  readonly stockBalanceByStock?: Record<string, number>;
  readonly expenses?: number;
  readonly currencyExpenses?: string;
  readonly category?: ProductCategory;
  readonly url?: string;
  readonly note?: string;
  readonly supplier?: string;
  readonly keywords?: string;
  readonly parentProductId?: string | null;
  readonly set?: ProductSetItem[];
  readonly images?: ProductImage[];
  readonly params?: ProductParam[];
  readonly additionalPrices?: AdditionalPrice[];
  readonly label?: string[];
  readonly labelMode?: 'replace' | 'append';
}

/**
 * Request to update/add products
 */
export interface ProductUpdateRequest {
  readonly action: 'update';
  readonly dontUpdateFields?: string[];
  readonly product: ProductInput[];
}

/**
 * Request to delete products
 */
export interface ProductDeleteRequest {
  readonly action: 'delete';
  readonly product: Array<{ id: string }>;
}

/**
 * Combined product action request
 */
export type ProductActionRequest = ProductUpdateRequest | ProductDeleteRequest;

/**
 * Product action response
 */
export interface ProductActionResponse {
  readonly status: 'success' | 'error';
  readonly message: string;
}

/**
 * Product in order (full details)
 */
export interface OrderProduct {
  readonly parameter?: string;
  readonly productId?: number;
  readonly text?: string;
  readonly documentName?: string;
  readonly sku?: string;
  readonly barcode?: string;
  readonly manufacturer?: string;
  readonly description?: string;
  readonly amount: number;
  readonly price: number;
  readonly discount?: number;
  readonly percentDiscount?: number;
  readonly commission?: number;
  readonly percentCommission?: number;
  readonly costPrice?: number;
  readonly preSale?: number;
  readonly stockId?: number;
  readonly uktzed?: string;
}
