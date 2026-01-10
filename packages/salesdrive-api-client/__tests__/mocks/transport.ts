/**
 * Mock Transport for Unit Tests
 */

import type { HttpRequestConfig, HttpTransportResult } from '../../src/http/transport.js';
import type { SalesDriveResponse } from '../../src/types/base.js';

/**
 * Mock response data for different endpoints
 */
export const mockResponses: Record<string, SalesDriveResponse<unknown>> = {
  // Reference data
  '/api/payment-methods/': {
    success: true,
    data: [
      { id: 1, name: 'Cash', parameter: 'cash' },
      { id: 2, name: 'Card', parameter: 'card' },
      { id: 3, name: 'Bank Transfer', parameter: 'bank' },
    ],
  },
  '/api/delivery-methods/': {
    success: true,
    data: [
      { id: 1, name: 'Nova Poshta', parameter: 'novaposhta' },
      { id: 2, name: 'Ukrposhta', parameter: 'ukrposhta' },
      { id: 3, name: 'Pickup', parameter: 'pickup' },
    ],
  },
  '/api/statuses/': {
    success: true,
    data: [
      { id: 1, name: 'New', type: 1 },
      { id: 2, name: 'In Progress', type: 2 },
      { id: 3, name: 'Completed', type: 3 },
      { id: 4, name: 'Cancelled', type: 4 },
    ],
  },

  // Orders
  '/api/order/list/': {
    status: 'success',
    data: [
      {
        id: 1001,
        formId: 1,
        version: 5,
        orderTime: '2025-01-10 12:00:00',
        updateAt: '2025-01-10 14:30:00',
        statusId: 2,
        paymentAmount: 1500.0,
        products: [
          {
            productId: 101,
            text: 'Test Product',
            amount: 2,
            price: 750,
          },
        ],
        primaryContact: {
          id: 501,
          formId: 1,
          fName: 'John',
          lName: 'Doe',
          phone: ['0501234567'],
        },
      },
    ],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 50,
    },
    totals: {
      count: 1,
      paymentAmount: 1500.0,
    },
  },

  // Order create
  '/handler/': {
    success: true,
    data: {
      orderId: 1002,
      userId: 1,
    },
  },

  // Order update
  '/api/order/update/': {
    success: true,
  },

  // Products
  '/product-handler/': {
    status: 'success',
    message: 'product[101] successfully added.',
  },

  // Categories
  '/category-handler/': {
    status: 'success',
    message: 'category[1, 2, 3] successfully added.',
  },

  // Payments
  '/api/payment/': {
    success: true,
    data: {
      paymentId: 2001,
    },
  },
  '/api/payment/list/': {
    status: 'success',
    data: [
      {
        id: 2001,
        date: '2025-01-10 15:00:00',
        sum: 500,
        type: 'incoming',
      },
    ],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 30,
    },
    totals: {
      count: 1,
      sum: 500,
    },
  },

  // Currency
  '/api/currencies/': {
    baseCurrency: 'UAH',
    currencies: [
      { code: 'USD', abbreviation: '$', rate: 42 },
      { code: 'EUR', abbreviation: '€', rate: 45 },
    ],
  },

  // Invoices
  '/api/invoice/list/': {
    status: 'success',
    data: [
      {
        id: 61,
        number: '46',
        date: '2025-01-10',
        totalSum: 4860,
      },
    ],
    pagination: {
      currentPage: 1,
      pageCount: 1,
      perPage: 30,
    },
    totals: {
      count: 1,
      sum: 4860,
    },
  },

  // Other endpoints (empty success responses)
  '/api/sales-invoice/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
  '/api/cash-order/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
  '/api/contract/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
  '/api/check/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
  '/api/act/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
  '/api/arrival-product/list/': {
    status: 'success',
    data: [],
    pagination: { currentPage: 1, pageCount: 0, perPage: 30 },
    totals: { count: 0 },
  },
};

/**
 * Create a mock transport for testing
 */
export function createMockTransport(
  overrides?: Record<string, SalesDriveResponse<unknown>>
): <T>(config: HttpRequestConfig) => Promise<HttpTransportResult<SalesDriveResponse<T>>> {
  const responses = { ...mockResponses, ...overrides };

  return async <T>(
    config: HttpRequestConfig
  ): Promise<HttpTransportResult<SalesDriveResponse<T>>> => {
    const response = responses[config.endpoint];
    if (!response) {
      throw new Error(`No mock response for endpoint: ${config.endpoint}`);
    }
    return {
      status: 200,
      data: response as SalesDriveResponse<T>,
    };
  };
}

/**
 * Create a failing mock transport
 */
export function createFailingTransport(
  error: Error
): <T>(config: HttpRequestConfig) => Promise<HttpTransportResult<SalesDriveResponse<T>>> {
  return async <T>(): Promise<HttpTransportResult<SalesDriveResponse<T>>> => {
    throw error;
  };
}
