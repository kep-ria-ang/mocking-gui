# Swagger Automation

> Automatically API mocking based on Status Codes is supported.

Mocking GUI provides a powerful feature to build a mocking server by loading Swagger/OpenAPI specifications (JSON). <br/>
Connect your Swagger Config URL, and config-based handlers will be **automatically registered** without manual definition.

## Overview

- Swagger-based handlers are useful for **Status Code-centric testing** (e.g., UI state transitions or error message displays based on response codes).
- Response bodies are **automatically generated** from Swagger schemas.
- Supports multiple response variants (success, error, edge cases) with proper status codes.
- You can easily extract manual handler code via **JSON Convert** if you need full customization.

## Setup

Enter the Swagger document information as an array in the `swagger` property of the `config.ts` file.

```typescript
// config.ts
import type { MockingConfig } from '@kakaocloud/mocking-gui';

export const mockConfig: MockingConfig = {
  // Manual handlers
  mocks: [],

  // Swagger Configuration
  swagger: [
    {
      name: 'My Service API',
      configUrl: 'https://api.example.com/v3/api-docs', // Swagger JSON URL
    },
  ],
};
```

## Option Details

Each Swagger configuration object (`SwaggerSourceOption`) has the following properties:

| Property    | Type     | Description                                                                                                                      | Required |
| :---------- | :------- | :------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `name`      | `string` | Name of the Swagger source to distinguish in the panel.                                                                          | ✅ Yes   |
| `configUrl` | `string` | URL providing the Swagger/OpenAPI specification (JSON).                                                                          | ✅ Yes   |
| `docsUrl`   | `string` | URL of the human-readable documentation page (e.g., Swagger UI). If set, a link is provided in the swagger panel.                | Optional |
| `serverUrl` | `string` | The domain (Base URL) of the target server that MSW will actually intercept. If not set, follows `servers` info in Swagger spec. | Optional |

### Example: Overriding `serverUrl`

If the Swagger document defines `https://dev-api.example.com`, but you want to send requests to `http://localhost:8080` in the local environment, or mock only a specific environment's API, you can explicitly specify the target using `serverUrl`.

```typescript
swagger: [
  {
    name: 'Backend API',
    configUrl: 'https://dev-api.example.com/v3/api-docs',
    serverUrl: 'https://api.myapp.com', // MSW will intercept requests to this domain.
  },
],
```

## How It Works

### Data Flow

```
Swagger JSON (OpenAPI spec)
       ↓
Parse responses section
       ↓
For each response status code:
  ├─ Extract schema from 'application/json' or '*/*'
  ├─ Generate realistic mock data using openapi-sampler
  ├─ Handle $ref resolution (circular references, nested schemas)
  └─ Create response variant with:
      • status code
      • response body (JSON)
      • headers (if defined)
       ↓
Display in Mocking GUI Panel
```

### Step-by-Step Process

1. **Load Swagger**: When Mocking GUI starts, it fetches the Swagger/OpenAPI JSON from `configUrl`.

2. **Parse Responses**: For each API endpoint, it extracts all response definitions from the spec.

3. **Generate Mock Bodies**: 
   - Analyzes the response schema (e.g., `#/components/schemas/User`)
   - Automatically resolves `$ref` references
   - Generates realistic JSON mock data that matches the schema structure
   - Supports complex nested objects and arrays

4. **Create Handlers**: Generates mock handlers for all endpoints with:
   - All defined response statuses (200, 400, 404, 500, etc.)
   - Realistic response bodies for each status
   - Optional: headers defined in the spec

5. **View in Panel**: Generated handlers appear in **Mocking GUI Panel > Swagger Tab** where you can:
   - Switch between different response variants
   - Inject delays for network simulation
   - Toggle handlers on/off
   - View the actual response body being served

## Response Body Handling

### Content-Type Priority

When a Swagger response defines multiple content types, Mocking GUI uses the following priority:

```
┌─────────────────────────────────────┐
│ Priority 1: application/json        │ ← Standard format
│   • 95% of modern APIs               │
│   • Generates realistic JSON mocks   │
└─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────┐
│ Priority 2: */* (wildcard)          │ ← Fallback
│   • Legacy APIs or untyped responses │
│   • Treated as application/json      │
└─────────────────────────────────────┘
```

**Example:**
```json
{
  "responses": {
    "200": {
      "content": {
        "application/json": {        // ← Used
          "schema": { "$ref": "#/components/schemas/User" }
        },
        "application/xml": {         // ← Ignored
          "schema": { ... }
        }
      }
    }
  }
}
```

### Schema Resolution

Mocking GUI automatically resolves complex schema references:

```typescript
// Swagger spec
{
  "responses": {
    "200": {
      "content": {
        "application/json": {
          "schema": { "$ref": "#/components/schemas/User" }  // ← Reference
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "roles": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Role" }
          }
        }
      },
      "Role": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" }
        }
      }
    }
  }
}

// Generated mock response body
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "roles": [
    { "id": 1, "name": "admin" },
    { "id": 2, "name": "user" }
  ]
}
```

### Error Responses

All status codes defined in the Swagger spec generate appropriate mock data:

```json
{
  "responses": {
    "200": {
      "description": "Successful response",
      "content": { "application/json": { ... } }
    },
    "400": {
      "description": "Bad request",
      "content": { "application/json": { ... } }
    },
    "404": {
      "description": "Not found",
      "content": { "application/json": { ... } }
    }
  }
}
```

Each status code generates a separate mock handler with appropriate response body, allowing you to test error scenarios and edge cases.

---

## Caveats

- **CORS**: The address specified in `configUrl` must be directly accessible from the browser, and CORS must be configured.
- **JSON Format**: Currently, it supports the JSON format of the OpenAPI 3.0+ specification.
- **Content-Type**: Only `application/json` and `*/*` content types are supported for mock body generation. Other formats (XML, CSV, etc.) are not currently supported.
