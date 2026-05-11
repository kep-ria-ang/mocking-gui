# Handler Guide

This guide explains how to write handlers for Mocking GUI.

## Basic Structure

Handlers define a URL and method, along with multiple possible pre-defined responses (`responseVariants`).

```typescript
import { HandlerConfigOption } from '@kakaocloud/mocking-gui';

export const userHandlers: HandlerConfigOption[] = [
  {
    // 1. Basic Information
    name: 'Get User Profile', // Name displayed in the panel
    url: `${BASE_URL}/api/user/:id`, // Path (supports path parameters)
    method: 'get', // HTTP Method

    // 2. Response Variants List (for Manual Mode)
    responseVariants: [
      {
        name: 'Success', // Default success response
        status: 200,
        body: { id: 1, name: 'Alice', role: 'user' },
      },
      {
        name: 'Admin User', // Different data case
        status: 200,
        body: { id: 2, name: 'Bob', role: 'admin' },
      },
      {
        name: 'Unauthorized', // Error case
        status: 401,
        body: { message: 'Login required' },
      },
    ],

    // 3. Dynamic Response Generation (for Auto Mode) - Optional
    // Use when you want to generate responses dynamically based on request parameters or logic
    responseVariantsFn: ({ params }) => {
      const { id } = params;
      return {
        name: 'Dynamic User',
        status: 200,
        body: { id: Number(id), name: `User ${id}`, role: 'user' },
      };
    },
  },
];
```

## Field Details

### `HandlerState`

| Field                | Type                       | Description                                                      |
| -------------------- | -------------------------- | ---------------------------------------------------------------- |
| `name`               | `string`                   | Handler name displayed in the Mocking GUI Panel list             |
| `url`                | `string`                   | URL path to intercept. Supports Path Parameters (`:id`)          |
| `method`             | `'get' \| 'post' \| ...`   | HTTP Method                                                      |
| `responseVariants`   | `HandlerResponseVariant[]` | (Manual) List of selectable responses                            |
| `responseVariantsFn` | `Function`                 | (Auto) Function for dynamic response generation based on request |
| `category`           | `string` (Optional)        | Category for grouping/filtering handlers                         |

### `HandlerResponseVariant`

| Field     | Type                     | Description                                          |
| --------- | ------------------------ | ---------------------------------------------------- |
| `name`    | `string`                 | Name of the response case (e.g., Success, Error 500) |
| `status`  | `number`                 | HTTP Status Code                                     |
| `body`    | `any`                    | Response Body (JSON)                                 |
| `headers` | `Record<string, string>` | Response Headers (Optional)                          |
| `delay`   | `number`                 | Response delay time (ms) (Optional)                  |

## Swagger Integration

Instead of manually writing handlers, you can load Swagger (OpenAPI) documents to automatically generate handlers.

`config.ts`:

```typescript
export const mockConfig: MockingConfig = {
  mocks: [], // Can be used together with manual handlers
  swagger: [
    {
      name: 'Petstore API',
      configUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
      // Set if the API server Base URL differs from the Swagger document
      serverUrl: 'https://api.petstore.com',
    },
  ],
};
```
