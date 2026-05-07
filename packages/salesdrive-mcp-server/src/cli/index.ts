#!/usr/bin/env node
/**
 * SalesDrive MCP Server CLI Entry Point
 */

import { runServer } from '../server.js';

runServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal error:', error);
  process.exit(1);
});
