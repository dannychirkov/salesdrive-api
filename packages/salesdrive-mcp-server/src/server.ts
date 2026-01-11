/**
 * SalesDrive MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  createClient,
  orderService,
  productService,
  paymentService,
  referenceService,
  currencyService,
  categoryService,
  invoiceService,
  salesInvoiceService,
  cashOrderService,
  contractService,
  checkService,
  actService,
  arrivalService,
} from '@dannychirkov/salesdrive-api-client';
import { createFetchTransport } from '@dannychirkov/salesdrive-transport-fetch';
import { loadConfig, validateConfig, type ServerConfig } from './config.js';
import { logger, setLogLevel } from './utils/logger.js';
import {
  orderTools,
  handleOrderTool,
  productTools,
  handleProductTool,
  paymentTools,
  handlePaymentTool,
  referenceTools,
  handleReferenceTool,
  currencyTools,
  handleCurrencyTool,
  categoryTools,
  handleCategoryTool,
  invoiceTools,
  handleInvoiceTool,
  salesInvoiceTools,
  handleSalesInvoiceTool,
  cashOrderTools,
  handleCashOrderTool,
  contractTools,
  handleContractTool,
  checkTools,
  handleCheckTool,
  actTools,
  handleActTool,
  arrivalTools,
  handleArrivalTool,
} from './tools/index.js';

/**
 * Write tool names that should be filtered out in read-only mode
 */
const WRITE_TOOLS = new Set([
  'order_create',
  'order_update',
  'product_update',
  'product_delete',
  'payment_add',
  'currency_update',
  'category_update',
  'category_delete',
]);

/**
 * All available tools
 */
const ALL_TOOLS: Tool[] = [
  ...orderTools,
  ...productTools,
  ...paymentTools,
  ...referenceTools,
  ...currencyTools,
  ...categoryTools,
  ...invoiceTools,
  ...salesInvoiceTools,
  ...cashOrderTools,
  ...contractTools,
  ...checkTools,
  ...actTools,
  ...arrivalTools,
];

/**
 * Get tools filtered by read-only mode
 */
function getAvailableTools(readOnly: boolean): Tool[] {
  if (!readOnly) {
    return ALL_TOOLS;
  }
  return ALL_TOOLS.filter((tool) => !WRITE_TOOLS.has(tool.name));
}

/**
 * Create the SalesDrive MCP Server
 */
export function createServer(config: ServerConfig) {
  // Validate configuration
  validateConfig(config);

  // Set log level
  setLogLevel(config.logLevel);

  // Get available tools based on read-only mode
  const availableTools = getAvailableTools(config.readOnly);

  if (config.readOnly) {
    logger.info('Running in READ-ONLY mode - write operations disabled');
  }

  // Create transport and client
  const transport = createFetchTransport({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  });

  const client = createClient({
    transport,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  })
    .extend(orderService)
    .extend(productService)
    .extend(paymentService)
    .extend(referenceService)
    .extend(currencyService)
    .extend(categoryService)
    .extend(invoiceService)
    .extend(salesInvoiceService)
    .extend(cashOrderService)
    .extend(contractService)
    .extend(checkService)
    .extend(actService)
    .extend(arrivalService);

  // Create MCP server
  const server = new Server(
    {
      name: 'salesdrive-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing tools');
    return { tools: availableTools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    logger.info(`Tool called: ${name}`, args);

    // Block write tools in read-only mode
    if (config.readOnly && WRITE_TOOLS.has(name)) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Tool "${name}" is not available in read-only mode. Set SALESDRIVE_READ_ONLY=false to enable write operations.`,
          },
        ],
      };
    }

    // Route to appropriate handler
    if (name.startsWith('order_')) {
      return handleOrderTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('product_')) {
      return handleProductTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('payment_')) {
      return handlePaymentTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('reference_')) {
      return handleReferenceTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('currency_')) {
      return handleCurrencyTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('category_')) {
      return handleCategoryTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('invoice_')) {
      return handleInvoiceTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('sales_invoice_')) {
      return handleSalesInvoiceTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('cash_order_')) {
      return handleCashOrderTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('contract_')) {
      return handleContractTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('check_')) {
      return handleCheckTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('act_')) {
      return handleActTool(name, args as Record<string, unknown>, client);
    }

    if (name.startsWith('arrival_')) {
      return handleArrivalTool(name, args as Record<string, unknown>, client);
    }

    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
    };
  });

  return server;
}

/**
 * Run the server with stdio transport
 */
export async function runServer() {
  try {
    const config = loadConfig();
    const server = createServer(config);
    const transport = new StdioServerTransport();

    logger.info('Starting SalesDrive MCP Server...');
    logger.info(`Base URL: ${config.baseUrl}`);
    if (config.readOnly) {
      logger.info('Mode: READ-ONLY');
    }

    await server.connect(transport);

    logger.info('Server connected and ready');
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}
