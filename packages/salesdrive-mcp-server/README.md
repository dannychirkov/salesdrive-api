# @dannychirkov/salesdrive-mcp-server

MCP (Model Context Protocol) server for SalesDrive CRM. Enables AI assistants like Claude to manage orders, products, and payments in SalesDrive.

## Installation

### With npx (recommended)

No installation needed! Just configure your AI assistant:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me"
      }
    }
  }
}
```

### Global installation

```bash
npm install -g @dannychirkov/salesdrive-mcp-server
```

Then configure:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "salesdrive-mcp",
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me"
      }
    }
  }
}
```

## Configuration

| Environment Variable   | Description                                         | Required            |
| ---------------------- | --------------------------------------------------- | ------------------- |
| `SALESDRIVE_API_KEY`   | Your SalesDrive API key                             | Yes                 |
| `SALESDRIVE_BASE_URL`  | Your account URL (e.g., https://demo.salesdrive.me) | Yes                 |
| `SALESDRIVE_READ_ONLY` | Set to `true` to disable write operations           | No (default: false) |
| `LOG_LEVEL`            | Logging level (debug, info, warn, error)            | No (default: info)  |

### Read-Only Mode

For safety, you can run the server in read-only mode. This disables all write operations:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me",
        "SALESDRIVE_READ_ONLY": "true"
      }
    }
  }
}
```

In read-only mode, the following tools are disabled:

- `order_create`, `order_update`
- `product_update`, `product_delete`
- `payment_add`
- `currency_update`
- `category_update`, `category_delete`

### Getting Your API Key

1. Log in to your SalesDrive account
2. Go to **Settings** → **General Settings and Integrations** → **Other Services** → **API**
3. Generate or copy your API key

## Available Tools

### Order Tools

| Tool           | Description              |
| -------------- | ------------------------ |
| `order_list`   | List orders with filters |
| `order_create` | Create a new order       |
| `order_update` | Update an existing order |

### Product Tools

| Tool             | Description                    |
| ---------------- | ------------------------------ |
| `product_update` | Add or update products (batch) |
| `product_delete` | Delete products by ID          |

### Category Tools

| Tool              | Description              |
| ----------------- | ------------------------ |
| `category_update` | Add or update categories |
| `category_delete` | Delete categories by ID  |

### Payment Tools

| Tool           | Description        |
| -------------- | ------------------ |
| `payment_add`  | Register a payment |
| `payment_list` | List payments      |

### Reference Tools

| Tool                             | Description          |
| -------------------------------- | -------------------- |
| `reference_get_payment_methods`  | Get payment methods  |
| `reference_get_delivery_methods` | Get delivery methods |
| `reference_get_statuses`         | Get order statuses   |

### Currency Tools

| Tool              | Description           |
| ----------------- | --------------------- |
| `currency_get`    | Get currency rates    |
| `currency_update` | Update currency rates |

### Document Tools

| Tool                 | Description           |
| -------------------- | --------------------- |
| `invoice_list`       | List invoices         |
| `sales_invoice_list` | List sales invoices   |
| `cash_order_list`    | List cash orders      |
| `contract_list`      | List contracts        |
| `check_list`         | List fiscal receipts  |
| `act_list`           | List acts             |
| `arrival_list`       | List product arrivals |

## Example Prompts

Once configured, you can ask your AI assistant:

- "Show me the last 10 orders from SalesDrive"
- "Create a new order for customer with phone 0501234567"
- "Update order #123 status to completed"
- "What payment methods are available?"
- "Add a payment of 500 UAH to order #456"
- "Update the USD exchange rate to 42 UAH"
- "Show me all invoices for this month"
- "List all contracts"
- "Show product arrivals from last week"

## Claude Desktop Setup

### macOS

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me"
      }
    }
  }
}
```

### Windows

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "your-api-key",
        "SALESDRIVE_BASE_URL": "https://your-account.salesdrive.me"
      }
    }
  }
}
```

## Troubleshooting

### "API key is required"

Make sure `SALESDRIVE_API_KEY` is set in the environment configuration.

### "Base URL is required"

Make sure `SALESDRIVE_BASE_URL` is set. It should be your account's URL, like `https://mycompany.salesdrive.me`.

### Rate Limiting

SalesDrive has rate limits (10/min, 100/hr, 1000/day for list operations). If you hit limits, wait and try again.

### Debug Mode

Set `LOG_LEVEL=debug` to see detailed logs in stderr.

## License

[Apache License 2.0](../../LICENSE)
