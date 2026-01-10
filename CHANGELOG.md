# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-10

### Added

- Initial release
- **@dannychirkov/salesdrive-api-client**
  - Full TypeScript client for SalesDrive API
  - Order service (create, update, list)
  - Product service (update, delete)
  - Category service
  - Payment service (add, list)
  - Reference service (payment methods, delivery methods, statuses)
  - Currency service (get, update rates)
  - Invoice, sales invoice, cash order, contract, check, act, arrival services
  - Complete type definitions for all API entities
  - Error handling with custom error classes

- **@dannychirkov/salesdrive-transport-fetch**
  - Fetch-based HTTP transport
  - Automatic rate limit retry support
  - Configurable timeout
  - Custom fetch implementation support

- **@dannychirkov/salesdrive-mcp-server**
  - MCP server for AI assistants
  - Order tools (list, create, update)
  - Product tools (update, delete)
  - Payment tools (add, list)
  - Reference tools (payment methods, delivery methods, statuses, currencies)
  - stdio transport support
