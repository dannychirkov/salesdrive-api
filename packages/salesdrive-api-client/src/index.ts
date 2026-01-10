/**
 * SalesDrive API Client
 *
 * TypeScript client for SalesDrive CRM API.
 *
 * @packageDocumentation
 */

// Core
export { createClient } from './core/client.js';
export type { Client, ClientContext, ServicePlugin } from './core/client.js';

// HTTP Transport
export type {
  HttpTransport,
  HttpRequestConfig,
  HttpTransportResult,
  TransportFunction,
} from './http/transport.js';

// Services
export { orderService } from './services/orderService.js';
export type { OrderServiceApi } from './services/orderService.js';

export { productService } from './services/productService.js';
export type { ProductServiceApi } from './services/productService.js';

export { categoryService } from './services/categoryService.js';
export type { CategoryServiceApi } from './services/categoryService.js';

export { paymentService } from './services/paymentService.js';
export type { PaymentServiceApi } from './services/paymentService.js';

export { referenceService } from './services/referenceService.js';
export type { ReferenceServiceApi } from './services/referenceService.js';

export { currencyService } from './services/currencyService.js';
export type { CurrencyServiceApi } from './services/currencyService.js';

export { invoiceService } from './services/invoiceService.js';
export type { InvoiceServiceApi } from './services/invoiceService.js';

export { salesInvoiceService } from './services/salesInvoiceService.js';
export type { SalesInvoiceServiceApi } from './services/salesInvoiceService.js';

export { cashOrderService } from './services/cashOrderService.js';
export type { CashOrderServiceApi } from './services/cashOrderService.js';

export { contractService } from './services/contractService.js';
export type { ContractServiceApi } from './services/contractService.js';

export { checkService } from './services/checkService.js';
export type { CheckServiceApi } from './services/checkService.js';

export { actService } from './services/actService.js';
export type { ActServiceApi } from './services/actService.js';

export { arrivalService } from './services/arrivalService.js';
export type { ArrivalServiceApi } from './services/arrivalService.js';

// Types - Base
export type {
  SalesDriveResponse,
  PaginationInfo,
  TotalsInfo,
  MetaInfo,
  ListRequestParams,
  DateFilterParams,
  Organization,
  OrganizationAccount,
  Counterparty,
  ContractReference,
  InvoiceReference,
  OrderReference,
  Unit,
  DocumentItem,
  DocumentProduct,
  SuccessResponse,
  ErrorResponse,
} from './types/base.js';

// Types - Contact
export type { Contact, ContactReference } from './types/contact.js';

// Types - Delivery
export type {
  NovaPoshtaDelivery,
  UkrposhtaDelivery,
  MeestDelivery,
  RozetkaDelivery,
  OrderDeliveryData,
} from './types/delivery.js';

// Types - Order
export type {
  OrderProductInput,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderData,
  UpdateOrderRequest,
  UpdateOrderResponse,
  ListOrdersRequest,
  Order,
  ListOrdersResponse,
} from './types/order.js';

// Types - Product
export type {
  ProductDiscount,
  ProductParam,
  AdditionalPrice,
  ProductImage,
  ProductCategory,
  ProductSetItem,
  ProductInput,
  ProductUpdateRequest,
  ProductDeleteRequest,
  ProductActionRequest,
  ProductActionResponse,
  OrderProduct,
} from './types/product.js';

// Types - Payment
export type {
  AddPaymentRequest,
  AddPaymentResponse,
  PaymentBreakdown,
  Payment,
  ListPaymentsRequest,
  ListPaymentsResponse,
} from './types/payment.js';

// Types - Reference
export type {
  PaymentMethod,
  DeliveryMethod,
  OrderStatus,
  PaymentMethodsResponse,
  DeliveryMethodsResponse,
  OrderStatusesResponse,
} from './types/reference.js';

// Types - Currency
export type {
  CurrencyRate,
  UpdateCurrencyRequest,
  UpdateCurrencyResponse,
  GetCurrencyResponse,
} from './types/currency.js';

// Types - Category
export type {
  CategoryInput,
  CategoryActionRequest,
  CategoryActionResponse,
} from './types/category.js';

// Types - Invoice
export type { Invoice, ListInvoicesRequest, ListInvoicesResponse } from './types/invoice.js';

// Types - Sales Invoice
export type {
  SalesInvoice,
  ListSalesInvoicesRequest,
  ListSalesInvoicesResponse,
} from './types/salesInvoice.js';

// Types - Cash Order
export type {
  CashOrder,
  ListCashOrdersRequest,
  ListCashOrdersResponse,
} from './types/cashOrder.js';

// Types - Contract
export type { Contract, ListContractsRequest, ListContractsResponse } from './types/contract.js';

// Types - Check
export type {
  Cashier,
  CashRegister,
  Check,
  ListChecksRequest,
  ListChecksResponse,
} from './types/check.js';

// Types - Act
export type { Act, ListActsRequest, ListActsResponse } from './types/act.js';

// Types - Arrival
export type {
  ArrivalDocumentItem,
  ProductArrival,
  ListArrivalsRequest,
  ListArrivalsResponse,
} from './types/arrival.js';

// Types - Call
export type { CallManager, CallClient, CallResponse } from './types/call.js';

// Types - Webhook
export type {
  WebhookInfo,
  WebhookProduct,
  WebhookOrderData,
  WebhookPayload,
} from './types/webhook.js';

// Errors
export {
  SalesDriveError,
  ApiError,
  RateLimitError,
  AuthenticationError,
  NetworkError,
} from './types/errors.js';
