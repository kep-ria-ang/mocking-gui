# API Reference

Definitions of key types and interfaces used in Mocking GUI.

## Configuration

### `MockingConfig`

The configuration object used in `config.ts`.

```typescript
interface MockingConfig {
  /** List of manually defined handlers */
  mocks?: HandlerConfigOption[];

  /** List of Swagger/OpenAPI configurations */
  swagger?: SwaggerSourceConfigOption[];

  /** MSW Worker related settings */
  worker?: WorkerStartOptions;

  /**
   * Additional MSW RequestHandlers that are not managed by Mocking GUI.
   * Useful for GraphQL or WebSocket handlers.
   */
  onDemandHandlers?: RequestHandler[];
}
```

### `SwaggerSourceConfigOption`

```typescript
interface SwaggerSourceConfigOption {
  /** Name to display in the panel */
  name: string;

  /** URL of the Swagger JSON document */
  configUrl: string;

  /** (Optional) Base URL to send actual API requests to (use if different from the host in Swagger doc) */
  serverUrl?: string;
}
```

## Server-Side

### `setupMockingServer`

Sets up the mocking server in Node.js environments (e.g., Next.js SSR, RSC).

```typescript
import { setupMockingServer } from '@kakaocloud/mocking-gui/server';

// Usage example
const server = await setupMockingServer({
  ...MockingConfig,
  cookie: '...', // Browser cookie string (for client state synchronization)
});

server.listen(); // Start intercepting requests
server.close(); // Stop intercepting requests
```

## Types

### `HandlerConfigOption`

The core interface defining the state of each API handler.

```typescript
interface HandlerConfigOption {
  name: string;
  description?: string;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

  /**
   * (Manual Mode) List of statically defined response variants
   */
  responseVariants?: HandlerResponseVariant[];

  /**
   * (Auto Mode) Function to dynamically generate a response based on request info (params, request, etc.)
   */
  responseVariantsFn?: (info: HttpResolverInfo) => HandlerResponseVariant;

  /** Default delay time (ms) */
  delay?: number;
}
```

### `HandlerResponseVariant`

```typescript
interface HandlerResponseVariant {
  name: string;
  status: number;
  headers?: HeadersInit;
  body?: JsonBodyType; // JSON response body
  rawBody?: RawBody; // text, html, binary, etc.
}
```
