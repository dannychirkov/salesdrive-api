# SalesDrive CRM API Documentation

This documentation provides comprehensive details on how to interact with the SalesDrive CRM API. It covers endpoints for managing orders, products, payments, and other core CRM entities.

## General Information

### Base URL
All API requests are made to your specific SalesDrive account domain. Replace `{your-account}` with your actual account name.

```
https://{your-account}.salesdrive.me
```

**Production Example:** `https://demo.salesdrive.me`

### Authentication
The API uses API Key authentication. You must include your API key in the `X-Api-Key` header for every request.

**Header:**
```http
X-Api-Key: your-api-key
```

> **How to obtain your API Key:**
> Navigate to **Settings** → **General Settings and Integrations** → **Other Services** → **API**.

### Rate Limits
Certain "List" endpoints (e.g., Orders, Payments, Invoices) enforce the following rate limits:
- **10** requests per minute
- **100** requests per hour
- **1000** requests per 24 hours

---

## Table of Contents
1. [Orders](#orders)
2. [Products](#products)
3. [Categories](#categories)
4. [YML Export](#yml-export)
5. [Currency Rates](#currency-rates)
6. [Order Fields](#order-fields)
7. [Payments](#payments)
8. [Invoices](#invoices)
9. [Sales Invoices](#sales-invoices)
10. [Cash Orders](#cash-orders)
11. [Calls](#calls)
12. [Product Arrivals](#product-arrivals)
13. [Acts](#acts)
14. [Contracts](#contracts)
15. [Checks (Fiscal Receipts)](#checks-fiscal-receipts)
16. [Webhooks](#webhooks)
17. [Support](#support)

---

## Orders

### Create Order
Create a new order in the system.

- **Endpoint:** `/handler/` or `/api/order/`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body Example
```json
{
  "getResultData": 1,
  "lName": "Shevchuk",
  "fName": "Petro",
  "mName": "Ivanovych",
  "phone": "0501112233",
  "email": "user@example.com",
  "dateOfBirth": "28.02.1986",
  "products": [
    {
      "id": "123",
      "name": "Lenovo Laptop",
      "costPerItem": 500,
      "amount": 2,
      "description": "Discounted item",
      "discount": "10%",
      "sku": "ABC-123",
      "commission": "10%"
    }
  ],
  "payment_method": "Cash on delivery",
  "shipping_method": "novaposhta",
  "shipping_address": "Trostyanets (Gaisyn district, Vinnytsia region), branch #1",
  "comment": "comment",
  "externalId": "804155451",
  "sajt": "website.com",
  "novaposhta": {
    "ServiceType": "Warehouse",
    "payer": "sender",
    "area": "Vinnytsia",
    "region": "Gaisyn",
    "city": "Trostyanets",
    "cityNameFormat": "short",
    "WarehouseNumber": "511fd009-e1c2-11e3-8c4a-0050568002cf",
    "Street": "Volodymyr Ivasiuk Avenue",
    "BuildingNumber": "15A",
    "Flat": "68",
    "ttn": "string"
  },
  "ukrposhta": {
    "ServiceType": "Warehouse",
    "payer": "sender",
    "type": "express",
    "city": "29713",
    "WarehouseNumber": "04210",
    "Street": "63812",
    "BuildingNumber": "15A",
    "Flat": "68",
    "ttn": "string"
  },
  "meest": {
    "ServiceType": "Warehouse",
    "payer": "sender",
    "area": "Zakarpattia",
    "city": "Uzhhorod",
    "WarehouseNumber": "3",
    "ttn": "string"
  },
  "rozetka_delivery": {
    "WarehouseNumber": "e12c91f8-52c1-4697-b926-9c59bcb34d9e",
    "payer": "sender",
    "ttn": "string"
  },
  "con_comment": "string",
  "con_telegram": "string",
  "stockId": 0,
  "commission": 12.5,
  "costPrice": 1000,
  "shipping_costs": 150,
  "organizationId": 1,
  "salesdrive_manager": 2,
  "utmSourceFull": "string",
  "utmSource": "google",
  "utmMedium": "organic",
  "utmCampaign": "string",
  "utmContent": "string",
  "utmTerm": "string",
  "utmPage": "string"
}
```

#### Response Example
```json
{
  "success": true,
  "data": {
    "orderId": 42952,
    "userId": 2
  }
}
```

### Update Order
Update an existing order.
- **Can update:** Status, manager, tracking number (TTN), and editable contact/order fields.
- **Cannot update:** Product items, linked contact data, Nova Poshta/Ukrposhta city/branch addresses.
- **Identification:** Orders can be identified by `id` (internal ID) or `externalId`.
- **Partial Updates:** Only pass the fields you wish to update.

- **Endpoint:** `/api/order/update/`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body Example
```json
{
  "id": 42957,
  "externalId": "AX1234567890",
  "data": {
    "statusId": 1065,
    "paymentDate": "25.08.2025",
    "rejectionReasonId": 393,
    "salesdrive_manager": 3,
    "comment": "comment",
    "payment_method": "card",
    "shipping_method": "novaposhta",
    "shipping_address": "Trostyanets, branch #1",
    "sajt": "test.salesdrive.me",
    "lName": "Shevchuk",
    "fName": "Petro",
    "mName": "Ivanovych",
    "phone": "0501112233",
    "email": "user@example.com",
    "dateOfBirth": "28.02.1986",
    "novaposhta": { "ttn": "string" },
    "ukrposhta": { "ttn": "string" },
    "meest": { "ttn": "string" },
    "rozetka_delivery": { "ttn": "string" }
  }
}
```

#### Response Example
```json
{
  "success": true
}
```

### List Orders
Retrieve a list of orders with filtering and pagination options.
- **Permission Required:** API key must have "Orders - read" permission at the order database level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/order/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 50, max: 100). |
| `filter[updateAt][from]` | Datetime | Order update date from (YYYY-MM-DD HH:MM:SS). |
| `filter[updateAt][to]` | Datetime | Order update date to. |
| `filter[orderTime][from]` | Datetime | Order creation date from. |
| `filter[orderTime][to]` | Datetime | Order creation date to. |
| `filter[statusId]` | String | Status ID(s). Special values: `__NOTDELETED__` (all except deleted), `__ALL__` (all). |
| `filter[id][from]` | Integer | Order ID from. |
| `filter[id][to]` | Integer | Order ID to. |
| `filter[setStatusId][]` | Array(Int) | Status ID set during the `setStatusTime` period. |
| `filter[setStatusTime][from]` | Datetime | Status change date from. |
| `filter[setStatusTime][to]` | Datetime | Status change date to. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "formId": 1,
      "version": 17,
      "ord_delivery_data": [
        {
          "senderId": 1,
          "idEntity": 1,
          "provider": "novaposhta",
          "type": "WarehouseWarehouse",
          "parentTrackingNumber": null,
          "trackingNumber": "20451253019078",
          "trackingNumberRef": "0a5ea215-9653-11f0-a1d5-48df37b921da",
          "statusCode": 1,
          "deliveryDateAndTime": "2025-09-25 08:18:20",
          "areaName": "Sumy",
          "regionName": "Trostyanets",
          "cityName": "Trostyanets",
          "cityType": "city",
          "cityRef": "8d5a980d-391c-11dd-90d9-001a92567626",
          "settlementRef": "e718a680-4b33-11e4-ab6d-005056801329",
          "branchNumber": 151,
          "branchRef": "a3013fb7-8460-11e4-acce-0050568002cf",
          "streetName": "Shevchenko St.",
          "house": "12",
          "flat": "56",
          "address": "branch #151",
          "payer": "Sender",
          "hasPostpay": 1,
          "postpaySum": 5166,
          "postpayPayer": "Recipient",
          "paymentMethod": "Cash",
          "cargoType": "Parcel",
          "ukrposhtaType": "EXPRESS"
        }
      ],
      "primaryContact": {
        "id": 1,
        "formId": 1,
        "version": 12,
        "active": 1,
        "lName": "Shevchenko",
        "fName": "Ivan",
        "mName": "Petrovych",
        "phone": ["0671234567"],
        "email": ["user@website.com"],
        "counterpartyId": 56,
        "company": "NGM",
        "comment": "contact comment",
        "userId": 1,
        "telegram": "telegramnick",
        "instagramNick": "instagramnick",
        "dateOfBirth": "09.03.1986",
        "createTime": "2025-09-08 19:02:41",
        "leadsCount": 1,
        "leadsSalesCount": 1,
        "leadsSalesAmount": 5166
      },
      "contacts": [
        {
          "id": 1,
          "formId": 1,
          "version": 12,
          "active": 1,
          "lName": "Shevchenko",
          "fName": "Ivan",
          "mName": "Petrovych",
          "phone": ["0671234567"],
          "email": ["user@website.com"],
          "counterpartyId": 56,
          "company": "NGM",
          "comment": "contact comment",
          "userId": 1,
          "telegram": "telegramnick",
          "instagramNick": "instagramnick",
          "dateOfBirth": "09.03.1986",
          "createTime": "2025-09-08 19:02:41",
          "leadsCount": 1,
          "leadsSalesCount": 1,
          "leadsSalesAmount": 5166
        }
      ],
      "products": [
        {
          "parameter": "80572991",
          "productId": 1234,
          "text": "Evening dress blue S",
          "documentName": "Blue Dress S (FR5654)",
          "sku": "FR5654",
          "barcode": "4820000123456",
          "manufacturer": "No brand",
          "description": "Gift",
          "amount": 1,
          "price": 5740,
          "discount": 10,
          "percentDiscount": 1,
          "commission": 15,
          "percentCommission": 1,
          "costPrice": 1400,
          "preSale": 0,
          "stockId": 1,
          "uktzed": "100200"
        }
      ],
      "shipping_method": 1,
      "payment_method": "6",
      "shipping_address": "Kyiv, branch #151",
      "comment": "comment",
      "organizationId": 1,
      "typeId": 3,
      "orderTime": "2025-09-18 12:44:44",
      "updateAt": "2025-09-18 13:46:35",
      "paymentDate": "2025-09-18",
      "statusId": 5,
      "rejectionReason": null,
      "userId": 1,
      "paymentAmount": 5166,
      "costPriceAmount": 1400,
      "shipping_costs": 55.83,
      "commissionAmount": 861,
      "expensesAmount": 2316.83,
      "profitAmount": 2849.17,
      "payedAmount": 5166,
      "restPay": 0,
      "document_ord_check": 1,
      "discountAmount": 574,
      "sajt": 10,
      "externalId": "81045120",
      "utmPage": "https://website.com/products/72991/",
      "utmMedium": "cpc",
      "campaignId": 1,
      "utmSourceFull": "https://www.google.com.ua/",
      "utmSource": "google",
      "utmCampaign": "campaign1",
      "utmContent": "utm_content",
      "utmTerm": "utm_term",
      "token": "14f78c5ecc3c5a518ac7c9e7e54c171a"
    }
  ],
  "meta": {
    "fields": {
      "...": null
    }
  },
  "pagination": {
    "currentPage": 1,
    "pageCount": 2343,
    "perPage": 100
  },
  "totals": {
    "count": 234300,
    "paymentAmount": 3585739.52,
    "commission": 28923.37,
    "expenses": 1690107.6
  }
}
```

---

## Products

### Add, Update, or Delete Products
Manage products in bulk (up to 100 products per request).

- **Endpoint:** `/product-handler/`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body Example (Update)
```json
{
  "action": "update",
  "dontUpdateFields": ["price", "name", "description"],
  "product": [
    {
      "id": "101",
      "name": "iPhone 15 Pro",
      "nameTranslate": "iPhone 15 Pro UA",
      "nameForDocuments": "Apple iPhone 15 Pro",
      "description": "Flagship Apple smartphone",
      "descriptionTranslate": "Flagship Apple smartphone (UA)",
      "costPerItem": 1500,
      "sku": "APL-IPH15PRO",
      "manufacturer": "Apple",
      "currency": "USD",
      "discount": {
        "value": "10%",
        "date_start": "10.11.2025",
        "date_end": "20.11.2025"
      },
      "weight": 0.25,
      "volume": 0.005,
      "length": 25,
      "width": 20,
      "height": 10,
      "barcode": "1234567890123",
      "stockBalance": 25,
      "stockBalanceByStock": { "1": 10, "3": 15 },
      "expenses": 1200,
      "currencyExpenses": "USD",
      "category": { "id": 10, "name": "Smartphones" },
      "url": "https://example.com/iphone-15-pro",
      "note": "New 2025 model",
      "supplier": "Apple Inc.",
      "keywords": "iphone, smartphone, apple",
      "parentProductId": null,
      "set": [{ "id": "202", "quantity": 1 }],
      "images": [{ "fullsize": "https://example.com/images/iphone15pro.jpg" }],
      "params": [
        { "name": "Color", "type": "select", "value": "Blue" },
        { "name": "Storage", "type": "select", "value": "256GB" }
      ],
      "additionalPrices": [
        {
          "priceType": "Wholesale",
          "priceValue": 1400,
          "priceCurrency": "USD",
          "priceDiscount": "10%"
        }
      ],
      "label": ["Label1", "Label2"],
      "labelMode": "replace"
    }
  ]
}
```

#### Request Body Example (Delete)
```json
{
  "action": "delete",
  "product": [{ "id": "101" }]
}
```

#### Response Example
```json
{
  "status": "success",
  "message": "product[101] successfully added."
}
```

---

## Categories

### Manage Categories
Add, update, or delete product categories.

- **Endpoint:** `/category-handler/`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body Example
```json
{
  "action": "update",
  "category": [
    { "id": 1, "name": "Electronics", "parentId": null },
    { "id": 2, "name": "Laptops", "parentId": 1 },
    { "id": 3, "name": "Smartphones", "parentId": 1 }
  ]
}
```

#### Response Example
```json
{
  "status": "success",
  "message": "category[1, 2, 3] successfully added."
}
```

---

## YML Export

### Get Products via YML
Export products in Yandex Market Language (YML) format.
**Prerequisite:** Configure in *Settings → Products/Services → YML Export → Add YML export* and enable "Export YML via link".

- **Endpoint:** `/export/yml/export.yml`
- **Method:** `GET`

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `publicKey` | String | Yes | Security token for the export. |

#### Response
Returns XML content in YML format containing shop info, currencies, categories, and product offers.

---

## Currency Rates

### Update Currency Rates
- **Endpoint:** `/api/currencies/`
- **Method:** `POST`

#### Request Body Example
```json
{
  "currencies": [
    { "code": "USD", "rate": 42 }
  ]
}
```

#### Response Example
```json
{
  "status": "success"
}
```

### Get Currency Rates
- **Endpoint:** `/api/currencies/`
- **Method:** `GET`

#### Response Example
```json
{
  "baseCurrency": "UAH",
  "currencies": [
    { "code": "USD", "abbreviation": "$", "rate": 42 }
  ]
}
```

---

## Order Fields

### List Payment Methods
- **Endpoint:** `/api/payment-methods/`
- **Method:** `GET`

#### Response Example
```json
{
  "success": true,
  "data": [
    { "id": 25, "name": "Bank Transfer", "parameter": "card" }
  ]
}
```

### List Delivery Methods
- **Endpoint:** `/api/delivery-methods/`
- **Method:** `GET`

#### Response Example
```json
{
  "success": true,
  "data": [
    { "id": 20, "name": "Pickup", "parameter": "pickup" }
  ]
}
```

### List Order Statuses
- **Endpoint:** `/api/statuses/`
- **Method:** `GET`

#### Response Example
```json
{
  "success": true,
  "data": [
    { "id": 15, "name": "Returned", "type": 3 }
  ]
}
```

---

## Payments

### Add Payment
Register a new payment.
- **Endpoint:** `/api/payment/`
- **Method:** `POST`

#### Request Body Example
```json
{
  "organizationId": 1,
  "datetime": "2025-08-25 14:30:00",
  "timezone": "Europe/Kiev",
  "accountNumber": "UA463052990000026008016227980",
  "sum": 500,
  "description": "Payment for goods per invoice #54172 dated 30.09.2025",
  "counterpartyName": "LLC Company",
  "counterpartyCode": "12345678",
  "counterpartyAccountNumber": "UA403052990000026009030110403",
  "counterpartyBankName": "JSC CB PRIVATBANK",
  "uniqueId": "string",
  "orderId": 54215,
  "orderExternalId": 443209915,
  "formId": 2,
  "autoAttachToOrderType": "lastname_and_sum",
  "payerLastName": "Ivanchuk"
}
```

#### Response Example
```json
{
  "success": true,
  "data": { "paymentId": 42952 }
}
```

### List Payments
Retrieve a list of payments.
- **Permission Required:** API key must have "Payments - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/payment/list/`
- **Method:** `GET`

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `type` | String | Type of payment: `all`, `incoming`, `outcoming` (default: `all`). |
| `filter[updatedAt][from]` | Datetime | Update date from. |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Payment date from. |
| `filter[date][to]` | Datetime | Payment date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 4295,
      "date": "2025-08-25 17:30:00",
      "userId": 2,
      "comment": "comment",
      "sum": 500,
      "purpose": null,
      "nds": 0,
      "payerTypeId": 2,
      "createdAt": "2025-09-05 15:20:45",
      "updatedAt": "2025-09-05 18:15:07",
      "responsibleId": 1,
      "type": "outcoming",
      "integrationTypeId": null,
      "organizationAccount": {
        "id": 42,
        "title": "Privat",
        "accountNumber": "UA463052990000026008016227980"
      },
      "organization": {
        "id": 42,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "paymentBreakdown": [
        {
          "sum": 42,
          "invoice": {
            "id": 61,
            "number": "46",
            "date": "2025-09-20"
          },
          "order": {
            "id": 51191,
            "formId": 2
          }
        }
      ],
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 231,
    "perPage": 1
  },
  "totals": {
    "count": 2342,
    "sum": 3585739.52
  }
}
```

---

## Invoices

### List Invoices
Retrieve a list of invoices.
- **Permission Required:** API key must have "Invoices - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/invoice/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from. |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Invoice date from. |
| `filter[date][to]` | Datetime | Invoice date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 61,
      "number": "46",
      "date": "2025-09-20",
      "payerTypeId": 1,
      "maxPaymentDate": "2025-09-24",
      "userId": 1,
      "totalSum": 4860,
      "createdAt": "2025-09-20 22:15:16",
      "updatedAt": "2025-09-21 10:18:07",
      "nds": 1,
      "comment": "comment",
      "responsibleId": 1,
      "token": "string",
      "documentItems": [
        {
          "description": "Blue Dress S (FR5654)",
          "price": "5400",
          "count": "1",
          "percentDiscount": 1,
          "discount": 10,
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456",
            "documentName": "Blue Dress S (FR5654)"
          },
          "unit": {
            "id": 1,
            "title": "pcs."
          }
        }
      ],
      "organizationAccount": {
        "id": 17,
        "title": "Privat",
        "accountNumber": "UA463052990000026008016227980"
      },
      "organization": {
        "id": 3,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "string"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "contract": {
        "id": 9,
        "number": "1234/25",
        "date": "2025-09-20"
      },
      "order": {
        "id": 51191,
        "formId": 2
      },
      "payed": 4860
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 2343,
    "perPage": 1
  },
  "totals": {
    "count": 2343,
    "sum": 3585739.52
  }
}
```

---

## Sales Invoices

### List Sales Invoices
Retrieve a list of sales invoices (Видаткові накладні).
- **Permission Required:** API key must have "Sales Invoices - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/sales-invoice/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from. |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Sales invoice date from. |
| `filter[date][to]` | Datetime | Sales invoice date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 15,
      "number": "2",
      "date": "2025-09-20",
      "userId": 1,
      "comment": "comment",
      "totalSum": 4860,
      "nds": 1,
      "payerTypeId": 1,
      "createdAt": "2025-09-20 22:23:46",
      "updatedAt": "2025-09-21 15:54:05",
      "responsibleId": 1,
      "addressDelivery": "Kyiv, Volodymyr Ivasiuk Ave 24",
      "base": "basis",
      "token": "3fe601d54ffa7a2d71a686108e669b3c",
      "documentItems": [
        {
          "description": "Blue Dress S (FR5654)",
          "price": "5400",
          "count": "1",
          "percentDiscount": 1,
          "discount": 10,
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456",
            "documentName": "Blue Dress S (FR5654)"
          },
          "unit": {
            "id": 1,
            "title": "pcs."
          }
        }
      ],
      "organizationAccount": {
        "id": 17,
        "title": "Privat",
        "accountNumber": "UA463052990000026008016227980"
      },
      "organization": {
        "id": 3,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "order": {
        "id": 51191,
        "formId": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 2,
    "perPage": 10
  },
  "totals": {
    "count": 15,
    "sum": 21405.63
  }
}
```

---

## Cash Orders

### List Cash Orders
Retrieve a list of cash orders (Касові ордери).
- **Permission Required:** API key must have "Cash Orders - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/cash-order/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `type` | String | Type of cash order: `all`, `incoming`, `outcoming` (default: `all`). |
| `filter[updatedAt][from]` | Datetime | Update date from. |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Cash order date from. |
| `filter[date][to]` | Datetime | Cash order date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 55,
      "number": "2",
      "date": "2025-09-20",
      "userId": 1,
      "comment": "comment",
      "totalSum": 4860,
      "nds": 1,
      "payerTypeId": 1,
      "createdAt": "2025-09-20 23:05:45",
      "updatedAt": "2025-09-21 18:15:14",
      "responsibleId": 1,
      "type": "incoming",
      "token": "3fe601d54ffa7a2d71a686108e669b3c",
      "documentItems": [
        {
          "description": "Blue Dress S (FR5654)",
          "price": "5400",
          "count": "1",
          "percentDiscount": 1,
          "discount": 10,
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456",
            "documentName": "Blue Dress S (FR5654)"
          },
          "unit": {
            "id": 1,
            "title": "pcs."
          }
        }
      ],
      "organization": {
        "id": 3,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "contract": {
        "id": 9,
        "number": "1234/25",
        "date": "2025-09-20"
      },
      "invoice": {
        "id": 61,
        "number": "46",
        "date": "2025-09-20"
      },
      "order": {
        "id": 51191,
        "formId": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 2,
    "perPage": 10
  },
  "totals": {
    "count": 15,
    "sum": 21405.63
  }
}
```

---

## Calls

### Add Call
Register an incoming or outgoing call record.

- **Endpoint:** `/trumpets/call/`
- **Method:** `GET`

#### Response Example
```json
{
  "status": "success",
  "manager": { "name": "Oleksiy", "internal_number": "101" },
  "client": { "id": 33939, "fName": "Vadym", "lName": "Kukhar", "mName": "", "company": "OLX" }
}
```

---

## Product Arrivals

### List Product Arrivals
Retrieve a list of product arrivals (also includes transfers, write-offs, and inventory documents).
- **Permission Required:** API key must have "Product Arrivals - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/arrival-product/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from (YYYY-MM-DD HH:MM:SS). |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Document date from. |
| `filter[date][to]` | Datetime | Document date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 97,
      "date": "2025-09-23",
      "userId": 1,
      "comment": null,
      "totalSum": 2800,
      "totalCount": 2,
      "createdAt": "2025-09-23 16:18:17",
      "updatedAt": "2025-09-23 17:01:10",
      "formId": 2,
      "responsibleId": 1,
      "stockId": 2,
      "sourceStockId": 1,
      "type": "1",
      "inventoryId": 24,
      "organization": {
        "id": 2,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "documentItems": [
        {
          "price": "1400",
          "count": "2",
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456"
          }
        }
      ],
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": null
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 9,
    "perPage": 10
  },
  "totals": {
    "count": 85,
    "sum": 2574052.56,
    "writeOffSum": 31647.69
  }
}
```

---

## Acts

### List Acts
Retrieve a list of acts (Акти).
- **Permission Required:** API key must have "Acts - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/act/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from (YYYY-MM-DD HH:MM:SS). |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Act date from. |
| `filter[date][to]` | Datetime | Act date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 8,
      "number": "1",
      "date": "2025-09-20",
      "userId": 1,
      "comment": "comment",
      "totalSum": 5390,
      "nds": 1,
      "payerTypeId": 1,
      "createdAt": "2025-09-20 22:29:45",
      "updatedAt": "2025-09-21 11:51:18",
      "responsibleId": 1,
      "token": "9c86daa7cbfe0b0ad5eeb91f4125834b",
      "documentItems": [
        {
          "description": "Blue Dress S (FR5654)",
          "price": "5400",
          "count": "1",
          "percentDiscount": 0,
          "discount": 10,
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456",
            "documentName": "Blue Dress S (FR5654)"
          },
          "unit": {
            "id": 1,
            "title": "pcs."
          }
        }
      ],
      "organizationAccount": {
        "id": 17,
        "title": "Privat",
        "accountNumber": "UA463052990000026008016227980"
      },
      "organization": {
        "id": 3,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "contract": {
        "id": 9,
        "number": "1234/25",
        "date": "2025-09-20"
      },
      "invoice": {
        "id": 61,
        "number": "46",
        "date": "2025-09-20"
      },
      "order": {
        "id": 51191,
        "formId": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 1,
    "perPage": 30
  },
  "totals": {
    "count": 7,
    "sum": 9235.63
  }
}
```

---

## Contracts

### List Contracts
Retrieve a list of contracts (Договори).
- **Permission Required:** API key must have "Contracts - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/contract/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from (YYYY-MM-DD HH:MM:SS). |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Contract date from. |
| `filter[date][to]` | Datetime | Contract date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 42952,
      "number": "42952",
      "date": "2025-08-25",
      "userId": 2,
      "comment": "comment",
      "payerTypeId": 2,
      "createdAt": "2025-09-05 15:20:45",
      "updatedAt": "2025-09-06 18:36:01",
      "responsibleId": 1,
      "token": "9c86daa7cbfe0b0ad5eeb91f4125834b",
      "organizationAccount": {
        "id": 42,
        "title": "Privat",
        "accountNumber": "UA463052990000026008016227980"
      },
      "organization": {
        "id": 42,
        "title": "LLC SalesDrive",
        "egrpou": "44984657"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "order": {
        "id": 37076,
        "formId": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 2343,
    "perPage": 1
  },
  "totals": {
    "count": 234
  }
}
```

---

## Checks (Fiscal Receipts)

### List Checks
Retrieve a list of fiscal receipts/checks (Чеки).
- **Permission Required:** API key must have "Checks - read" permission at the account level.
- **Rate Limit:** 10/min, 100/hour, 1000/24h.

- **Endpoint:** `/api/check/list/`
- **Method:** `GET`

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Integer | Page number. |
| `limit` | Integer | Results per page (default: 30, max: 100). |
| `filter[updatedAt][from]` | Datetime | Update date from (YYYY-MM-DD HH:MM:SS). |
| `filter[updatedAt][to]` | Datetime | Update date to. |
| `filter[date][from]` | Datetime | Check date from. |
| `filter[date][to]` | Datetime | Check date to. |
| `filter[createdAt][from]` | Datetime | Creation date from. |
| `filter[createdAt][to]` | Datetime | Creation date to. |
| `filter[organizationId][]` | Integer | Organization ID. |

#### Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 996,
      "date": "2025-09-22 15:23:37",
      "fiscalizationUserId": 1,
      "fiscalizationStatus": "done",
      "responsibleId": 1,
      "payerTypeId": 1,
      "documentPaymentTypeId": 20,
      "userId": 1,
      "totalSum": 4860,
      "createdAt": "2025-09-22 15:23:29",
      "updatedAt": "2025-09-22 19:04:11",
      "comment": "comment",
      "type": 0,
      "fiscalCode": "TEST-Hs9yG",
      "return": null,
      "hasReturn": null,
      "cashier": {
        "id": 1,
        "name": "Test Cashier Oleksiy"
      },
      "cashRegister": {
        "id": 1,
        "name": "Test Cash Register",
        "code": "TEST457570"
      },
      "documentItems": [
        {
          "description": "Blue Dress S (FR5654)",
          "price": "5400",
          "count": "1",
          "percentDiscount": 1,
          "discount": 10,
          "product": {
            "id": 54972,
            "formId": 2,
            "name": "Evening dress blue S",
            "nameTranslate": "Evening dress blue S",
            "parameter": "1574874",
            "manufacturer": "Manufacturer",
            "sku": "FR5654",
            "barcode": "4820000123456",
            "documentName": "Blue Dress S (FR5654)"
          },
          "unit": {
            "id": 1,
            "title": "pcs."
          }
        }
      ],
      "discount": 125.5,
      "organization": {
        "id": 1,
        "title": "FOP Steklov Oleksiy Andriiovych",
        "egrpou": "3147915237"
      },
      "contact": {
        "id": 37436,
        "formId": 2,
        "fName": "Marina",
        "lName": "Steklova",
        "mName": "Andriivna"
      },
      "counterparty": {
        "id": 42,
        "egrpou": "44984657",
        "title": "LLC Company"
      },
      "order": {
        "id": 51236,
        "formId": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageCount": 94,
    "perPage": 10
  },
  "totals": {
    "count": 931,
    "sum": 2949752.64
  }
}
```

---

## Webhooks

Webhooks allow SalesDrive to send real-time notifications to your server when specific events occur (e.g., new order created, order status changed). SalesDrive sends a `POST` request with JSON data to your configured URL.

### How to Set Up

1. Navigate to **Settings** → **General Settings and Integrations** → **Other Services** → **Webhook**
2. Add your webhook URL
3. Configure conditions (optional)

### Multiple Webhooks with Conditions

You can configure multiple webhooks with different conditions. For example:
- Orders from Site A → send to `https://your-server.com/webhook-a`
- Orders from Site B → send to `https://your-server.com/webhook-b`

### Webhook Payload Structure

SalesDrive sends a `POST` request with `Content-Type: application/json` to your webhook URL.

```json
{
  "info": {
    "webhookType": "order",
    "webhookEvent": "new_order",
    "account": "mycompany"
  },
  "data": {
    "id": 42957,
    "formId": 1,
    "version": 1,
    "externalId": "804155451",
    "orderTime": "2025-09-18 12:44:44",
    "updateAt": "2025-09-18 13:46:35",
    "statusId": 5,
    "paymentDate": "2025-09-19",
    "rejectionReason": 12,
    "userId": 1,
    "ord_delivery_data": [
      {
        "senderId": 1,
        "provider": "novaposhta",
        "type": "WarehouseWarehouse",
        "trackingNumber": "20451253019078",
        "trackingNumberRef": "0a5ea215-9653-11f0-a1d5-48df37b921da",
        "statusCode": 1,
        "deliveryDateAndTime": "2025-09-25 08:18:20",
        "areaName": "Сумська",
        "regionName": "Тростянецький",
        "cityName": "Тростянець",
        "cityType": "м.",
        "cityRef": "8d5a980d-391c-11dd-90d9-001a92567626",
        "settlementRef": "e718a680-4b33-11e4-ab6d-005056801329",
        "branchNumber": 151,
        "branchRef": "a3013fb7-8460-11e4-acce-0050568002cf",
        "streetName": "вул. Шевченка",
        "house": "12",
        "flat": "56",
        "address": "відділення №151",
        "payer": "Sender",
        "hasPostpay": 1,
        "postpaySum": 5166,
        "postpayPayer": "Recipient",
        "paymentMethod": "Cash",
        "cargoType": "Parcel",
        "ukrposhtaType": "EXPRESS"
      }
    ],
    "contacts": [
      {
        "id": 35412,
        "formId": 1,
        "version": 1,
        "email": "user@example.com",
        "phone": "380501234567",
        "counterpartyId": 512,
        "createTime": "2025-09-08 19:02:41",
        "leadsSalesAmount": 8150,
        "leadsSalesCount": 2,
        "leadsCount": 3,
        "userId": 1,
        "comment": "contact comment",
        "mName": "Patronymic",
        "fName": "FirstName",
        "lName": "LastName"
      }
    ],
    "products": [
      {
        "formId": 1,
        "productId": 54972,
        "parameter": "1574874",
        "name": "Evening dress blue S",
        "nameTranslate": "Вечірня сукня синя S",
        "documentName": "Dress blue S (FR5654)",
        "sku": "FR5654",
        "barcode": "4820000123456",
        "amount": 1,
        "price": 5740,
        "costPrice": 1490,
        "discount": 10,
        "percentDiscount": 1,
        "commission": 15,
        "percentCommission": 1,
        "description": "Gift. Put in red box.",
        "stockId": 1,
        "mass": 0.75,
        "volume": 0.005,
        "length": 25,
        "width": 20,
        "height": 10,
        "restCount": 4,
        "manufacturer": "manufacturer",
        "keywords": "long dress, evening dress, cocktail dress",
        "preSale": 0,
        "isComplect": 0,
        "categoryId": 1205,
        "categoryName": "Dresses",
        "href": "https://website.com/product/1574874/",
        "note": "note",
        "uktzed": "6204420000",
        "exciseBarcodes": ["A4820000123456"]
      }
    ],
    "payment_method": 4,
    "shipping_method": 2,
    "shipping_address": "м. Софіївська Борщагівка, Київська обл., відділення №1",
    "sajt": 149,
    "comment": "Order comment",
    "typeId": 2,
    "paymentAmount": 5166,
    "organizationId": 3,
    "document_ord_check": 1,
    "payedAmount": 500,
    "restPay": 4666,
    "profitAmount": 2815,
    "expensesAmount": 2351,
    "discountAmount": 574,
    "campaignId": 1,
    "utmSourceFull": "https://www.google.com.ua/",
    "utmSource": "google",
    "utmCampaign": "campaign1",
    "utmMedium": "cpc",
    "utmContent": "utm_content",
    "utmTerm": "utm_term",
    "utmPage": "https://website.com/product/1574874/"
  },
  "meta": {
    "fields": {},
    "contacts": {
      "fields": {}
    }
  }
}
```

### Payload Fields Reference

#### `info` Object

| Field | Type | Description |
|-------|------|-------------|
| `webhookType` | String | Type of entity (e.g., `"order"`). |
| `webhookEvent` | String | Event type (e.g., `"new_order"`, `"status_change"`). |
| `account` | String | Your SalesDrive account name. |

#### `data` Object (Order Data)

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Internal order ID. |
| `formId` | Integer | Form ID. |
| `externalId` | String | External order ID (from your system). |
| `orderTime` | Datetime | Order creation time. |
| `updateAt` | Datetime | Last update time. |
| `statusId` | Integer | Current status ID. |
| `paymentDate` | Date | Payment date. |
| `rejectionReason` | Integer | Rejection reason ID. |
| `userId` | Integer | Assigned manager ID. |
| `ord_delivery_data` | Array | Delivery/shipping details. |
| `contacts` | Array | Customer contact information. |
| `products` | Array | Order line items. |
| `payment_method` | Integer | Payment method ID. |
| `shipping_method` | Integer | Shipping method ID. |
| `shipping_address` | String | Delivery address. |
| `sajt` | Integer | Website/source ID. |
| `comment` | String | Order comment. |
| `paymentAmount` | Number | Total order amount. |
| `payedAmount` | Number | Amount already paid. |
| `restPay` | Number | Remaining amount to pay. |
| `profitAmount` | Number | Order profit. |
| `expensesAmount` | Number | Order expenses. |
| `discountAmount` | Number | Total discount amount. |
| `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `utmPage` | String | UTM tracking parameters. |

#### `meta` Object

| Field | Type | Description |
|-------|------|-------------|
| `fields` | Object | Custom order fields. |
| `contacts.fields` | Object | Custom contact fields. |

### Your Server Response

Your webhook endpoint should return an HTTP `200` status code to confirm successful receipt. If SalesDrive doesn't receive a `200` response, it may retry the webhook.

---

## Support

For additional assistance, please contact SalesDrive support:

- **Website:** salesdrive.ua
- **Phone:** (044) 338-28-46
- **Chatbots:** Available on Telegram, Viber, and Facebook.

