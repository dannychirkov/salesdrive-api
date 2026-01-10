# SalesDrive API — Полный промпт для автономной реализации

## Инструкция для пользователя

**Ты НЕ программист, и это нормально!**

Просто:

1. Скопируй промпт ниже и отправь AI
2. Отвечай "да" / "продолжай" когда AI спрашивает
3. Когда AI попросит — отправь свой API ключ и URL аккаунта SalesDrive
4. Когда дойдёт до публикации — введи npm токен (AI объяснит как получить)

**У тебя есть API ключ с правами на чтение** — AI протестирует:

- ✅ Получение списка заказов
- ✅ Способы оплаты
- ✅ Способы доставки
- ✅ Статусы заказов

Операции записи (создание, обновление) будут протестированы на моках.

---

## Промпт (скопируй целиком)

```
# ЗАДАЧА: Полная реализация SalesDrive API Client

Ты — senior разработчик. Твоя задача — полностью реализовать проект от нуля до публикации в npm.

## КРИТИЧЕСКИ ВАЖНО

1. **Пользователь НЕ программист** — не спрашивай технические детали, принимай решения сам
2. **Делай ВСЁ сам** — создавай файлы, пиши код, запускай команды
3. **Объясняй простым языком** — что делаешь и зачем, но кратко
4. **Спрашивай только когда РЕАЛЬНО нужен ввод** — API ключ, npm токен, подтверждение

## ДОСТУП К API

У пользователя есть API ключ SalesDrive с **ограниченными правами (только чтение)**:

### ✅ Можно тестировать на РЕАЛЬНОМ API:
- `GET /api/order/list/` — список заказов
- `GET /api/payment-methods/` — способы оплаты
- `GET /api/delivery-methods/` — способы доставки
- `GET /api/statuses/` — статусы заказов

### ❌ Только МОКИ (нет прав):
- `POST /handler/` или `/api/order/` — создание заказа
- `POST /api/order/update/` — обновление заказа
- `POST /product-handler/` — управление товарами
- `POST /api/payment/` — добавление оплаты
- `POST /category-handler/` — управление категориями
- `POST /api/currencies/` — обновление курсов
- Все остальные POST/PUT/DELETE операции

### Перед интеграционными тестами СПРОСИ у пользователя:
1. **API ключ** — для заголовка X-Api-Key
2. **Base URL** — например `https://demo.salesdrive.me`

## ДОСТУПНЫЕ ДОКУМЕНТЫ

Прочитай ЭТИ ФАЙЛЫ перед началом работы:
- `API.md` — Полная документация SalesDrive API (эндпоинты, запросы, ответы)
- `SALESDRIVE_PROJECT_PLAN.md` — Архитектура проекта, структура, типы

## ИНФОРМАЦИЯ О ПРОЕКТЕ

- **Автор**: Danny Chirkov
- **GitHub username**: dannychirkov
- **NPM scope**: @dannychirkov
- **Репозиторий**: github.com/dannychirkov/salesdrive-api
- **Лицензия**: Apache 2.0

## ПАКЕТЫ ДЛЯ СОЗДАНИЯ

1. `@dannychirkov/salesdrive-api-client` — TypeScript клиент для API
2. `@dannychirkov/salesdrive-transport-fetch` — HTTP транспорт
3. `@dannychirkov/salesdrive-mcp-server` — MCP сервер для AI ассистентов

---

# ПЛАН ВЫПОЛНЕНИЯ (следуй СТРОГО по порядку)

## ЭТАП 1: Инициализация проекта

### 1.1 Создай структуру монорепо
```

salesdrive-api/
├── packages/
│ ├── salesdrive-api-client/
│ ├── salesdrive-transport-fetch/
│ └── salesdrive-mcp-server/
├── package.json # Yarn workspaces
├── tsconfig.json # Базовый TS конфиг
├── LICENSE # Apache 2.0
├── README.md # Описание проекта
├── .gitignore
├── .prettierrc
└── .eslintrc.js

````

### 1.2 Настрой package.json (root)
```json
{
  "name": "salesdrive-api",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "yarn workspaces foreach -A run build",
    "test": "yarn workspaces foreach -A run test",
    "type-check": "yarn workspaces foreach -A run type-check",
    "lint": "eslint packages/*/src/**/*.ts",
    "format": "prettier --write \"packages/**/*.{ts,json,md}\""
  }
}
````

### 1.3 Инициализируй git

```bash
git init
git add .
git commit -m "chore: initial project setup"
```

**→ Скажи пользователю**: "Этап 1 готов. Создана структура проекта. Продолжаю?"

---

## ЭТАП 2: Базовые типы (salesdrive-api-client)

### 2.1 Создай package.json для клиента

```json
{
  "name": "@dannychirkov/salesdrive-api-client",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/dannychirkov/salesdrive-api"
  },
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}
```

### 2.2 Реализуй типы на основе API.md

Создай файлы в `src/types/`:

- `base.ts` — SalesDriveResponse, PaginationInfo, TotalsInfo
- `order.ts` — Order, CreateOrderRequest, UpdateOrderRequest, ListOrdersRequest
- `product.ts` — Product, ProductInput, ProductDiscount
- `payment.ts` — Payment, AddPaymentRequest
- `contact.ts` — Contact
- `delivery.ts` — NovaPoshtaDelivery, UkrposhtaDelivery, MeestDelivery, RozetkaDelivery
- `reference.ts` — PaymentMethod, DeliveryMethod, OrderStatus

### 2.3 Реализуй core

- `src/http/transport.ts` — интерфейс HttpTransport
- `src/core/client.ts` — createClient с plugin системой

### 2.4 Реализуй сервисы

В порядке приоритета:

1. `src/services/orderService.ts`
2. `src/services/productService.ts`
3. `src/services/paymentService.ts`
4. `src/services/referenceService.ts`
5. `src/services/categoryService.ts`
6. `src/services/currencyService.ts`

### 2.5 Создай index.ts с экспортами

### 2.6 Напиши тесты

**Unit тесты (моки):**

- Создай `__tests__/mocks/transport.ts` с фейковыми ответами
- Напиши unit тесты для каждого сервиса

**Интеграционные тесты (реальный API):**
Перед запуском спроси у пользователя API ключ и Base URL, затем:

- `__tests__/integration/reference.test.ts` — тест getPaymentMethods, getDeliveryMethods, getStatuses
- `__tests__/integration/order.test.ts` — тест list (только чтение!)

Создай файл `.env.example`:

```
SALESDRIVE_API_KEY=your-api-key
SALESDRIVE_BASE_URL=https://your-account.salesdrive.me
```

**→ Спроси у пользователя**:
"Для интеграционных тестов мне нужны:

1. Твой API ключ SalesDrive
2. URL твоего аккаунта (например https://demo.salesdrive.me)

Отправь их, и я протестирую чтение заказов и справочников на реальном API."

### 2.7 Проверь

```bash
yarn type-check
yarn test
yarn build
```

**→ Скажи пользователю**: "Этап 2 готов. API клиент написан и протестирован. Продолжаю?"

---

## ЭТАП 3: Transport (salesdrive-transport-fetch)

### 3.1 Создай пакет

Простой fetch-based транспорт:

- X-Api-Key header
- GET с query params
- POST с JSON body

### 3.2 Напиши тесты с моками

### 3.3 Проверь билд

**→ Скажи пользователю**: "Этап 3 готов. Транспорт готов. Продолжаю?"

---

## ЭТАП 4: MCP Server (salesdrive-mcp-server)

### 4.1 Создай пакет с зависимостями

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@dannychirkov/salesdrive-api-client": "workspace:*",
    "@dannychirkov/salesdrive-transport-fetch": "workspace:*"
  }
}
```

### 4.2 Реализуй сервер

- `src/server.ts` — MCP сервер
- `src/config.ts` — конфигурация из env
- `src/cli/stdio.ts` — stdio транспорт
- `src/cli/http.ts` — HTTP транспорт

### 4.3 Реализуй tools

- `src/tools/order.ts` — order_create, order_update, order_list
- `src/tools/product.ts` — product_update, product_delete
- `src/tools/payment.ts` — payment_add, payment_list
- `src/tools/reference.ts` — reference_get_payment_methods, etc.

### 4.4 Добавь bin в package.json

```json
{
  "bin": {
    "salesdrive-mcp": "./dist/cli/index.js"
  }
}
```

### 4.5 Напиши тесты tools с моками

**→ Скажи пользователю**: "Этап 4 готов. MCP сервер готов. Продолжаю с документацией?"

---

## ЭТАП 5: Документация

### 5.1 Напиши README.md для каждого пакета

- Установка
- Быстрый старт
- Примеры использования
- API Reference

### 5.2 Напиши главный README.md

- Обзор проекта
- Ссылки на пакеты
- Примеры

### 5.3 Добавь CHANGELOG.md

**→ Скажи пользователю**: "Этап 5 готов. Документация написана. Готов к публикации?"

---

## ЭТАП 6: Подготовка к публикации

### 6.1 Финальные проверки

```bash
yarn lint
yarn type-check
yarn test
yarn build
```

### 6.2 Создай GitHub репозиторий

```bash
gh repo create dannychirkov/salesdrive-api --public --source=. --remote=origin
git push -u origin main
```

### 6.3 Коммит всего

```bash
git add .
git commit -m "feat: initial release v0.1.0"
git tag v0.1.0
git push --tags
```

**→ Скажи пользователю**:
"Код готов и запушен на GitHub!

Для публикации в npm нужен токен. Вот как его получить:

1. Зайди на https://www.npmjs.com/
2. Войди или создай аккаунт
3. Нажми на свой профиль → Access Tokens → Generate New Token
4. Выбери 'Automation' тип
5. Скопируй токен и отправь мне

Токен нужен один раз для публикации."

---

## ЭТАП 7: Публикация в npm

### 7.1 Получи npm токен от пользователя

### 7.2 Настрой .npmrc

```bash
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
```

### 7.3 Опубликуй пакеты

```bash
cd packages/salesdrive-api-client && npm publish --access public
cd packages/salesdrive-transport-fetch && npm publish --access public
cd packages/salesdrive-mcp-server && npm publish --access public
```

### 7.4 Удали .npmrc (безопасность)

**→ Скажи пользователю**:
"🎉 Готово! Пакеты опубликованы:

- https://www.npmjs.com/package/@dannychirkov/salesdrive-api-client
- https://www.npmjs.com/package/@dannychirkov/salesdrive-transport-fetch
- https://www.npmjs.com/package/@dannychirkov/salesdrive-mcp-server

GitHub: https://github.com/dannychirkov/salesdrive-api"

---

## ЭТАП 8: MCP Registry (опционально)

Спроси пользователя: "Хочешь опубликовать MCP сервер в официальном реестре? Это сделает его видимым для пользователей Claude."

Если да — создай server.json и отправь PR в MCP Registry.

---

# ПРАВИЛА ВЫПОЛНЕНИЯ

1. **Читай API.md** — все типы должны соответствовать документации
2. **Следуй SALESDRIVE_PROJECT_PLAN.md** — архитектура уже продумана
3. **Реальный API для чтения** — order list, payment-methods, delivery-methods, statuses
4. **Моки для записи** — create, update, delete операции
5. **Коммить после каждого этапа** — маленькие осмысленные коммиты
6. **Не спрашивай лишнего** — принимай решения сам
7. **Объясняй кратко** — пользователь не программист

# НАЧНИ СЕЙЧАС

1. Прочитай API.md и SALESDRIVE_PROJECT_PLAN.md
2. Начни с Этапа 1
3. После каждого этапа кратко сообщай статус и спрашивай "Продолжаю?"

Поехали! 🚀

````

---

## После завершения

Когда всё опубликовано, ты сможешь:

1. **Использовать клиент**:
```bash
npm install @dannychirkov/salesdrive-api-client @dannychirkov/salesdrive-transport-fetch
````

2. **Подключить MCP сервер к Claude**:
   Добавь в `.mcp.json`:

```json
{
  "mcpServers": {
    "salesdrive": {
      "command": "npx",
      "args": ["-y", "@dannychirkov/salesdrive-mcp-server"],
      "env": {
        "SALESDRIVE_API_KEY": "твой-ключ",
        "SALESDRIVE_BASE_URL": "https://твой-аккаунт.salesdrive.me"
      }
    }
  }
}
```

3. **Просить Claude работать с SalesDrive**:

- "Покажи последние заказы"
- "Создай новый заказ"
- "Обнови статус заказа #123"
