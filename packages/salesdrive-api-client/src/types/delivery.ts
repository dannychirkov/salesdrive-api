/**
 * Delivery Types
 *
 * Structures for different delivery providers supported by SalesDrive.
 */

/**
 * Nova Poshta delivery data
 */
export interface NovaPoshtaDelivery {
  readonly ServiceType?: 'Warehouse' | 'Doors';
  readonly payer?: 'sender' | 'recipient';
  readonly area?: string;
  readonly region?: string;
  readonly city?: string;
  readonly cityNameFormat?: 'short' | 'full';
  readonly WarehouseNumber?: string;
  readonly Street?: string;
  readonly BuildingNumber?: string;
  readonly Flat?: string;
  readonly ttn?: string;
}

/**
 * Ukrposhta delivery data
 */
export interface UkrposhtaDelivery {
  readonly ServiceType?: 'Warehouse' | 'Doors';
  readonly payer?: 'sender' | 'recipient';
  readonly type?: 'express' | 'standard';
  readonly city?: string;
  readonly WarehouseNumber?: string;
  readonly Street?: string;
  readonly BuildingNumber?: string;
  readonly Flat?: string;
  readonly ttn?: string;
}

/**
 * Meest Express delivery data
 */
export interface MeestDelivery {
  readonly ServiceType?: 'Warehouse' | 'Doors';
  readonly payer?: 'sender' | 'recipient';
  readonly area?: string;
  readonly city?: string;
  readonly WarehouseNumber?: string;
  readonly ttn?: string;
}

/**
 * Rozetka delivery data
 */
export interface RozetkaDelivery {
  readonly WarehouseNumber?: string;
  readonly payer?: 'sender' | 'recipient';
  readonly ttn?: string;
}

/**
 * Delivery data structure in order response
 */
export interface OrderDeliveryData {
  readonly senderId?: number;
  readonly idEntity?: number;
  readonly provider?: 'novaposhta' | 'ukrposhta' | 'meest' | 'rozetka';
  readonly type?: string;
  readonly parentTrackingNumber?: string | null;
  readonly trackingNumber?: string;
  readonly trackingNumberRef?: string;
  readonly statusCode?: number;
  readonly deliveryDateAndTime?: string;
  readonly areaName?: string;
  readonly regionName?: string;
  readonly cityName?: string;
  readonly cityType?: string;
  readonly cityRef?: string;
  readonly settlementRef?: string;
  readonly branchNumber?: number;
  readonly branchRef?: string;
  readonly streetName?: string;
  readonly house?: string;
  readonly flat?: string;
  readonly address?: string;
  readonly payer?: 'Sender' | 'Recipient';
  readonly hasPostpay?: number;
  readonly postpaySum?: number;
  readonly postpayPayer?: 'Sender' | 'Recipient';
  readonly paymentMethod?: 'Cash' | 'Card';
  readonly cargoType?: 'Parcel' | 'Cargo';
  readonly ukrposhtaType?: 'EXPRESS' | 'STANDARD';
}
