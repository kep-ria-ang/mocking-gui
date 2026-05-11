# Server-Side Setup Guide

You need to configure the Mocking GUI server for mocking in Server-Side Rendering (SSR) environments.

## `createMockingGUIServer`

This function creates an MSW server in a server environment (Node.js).

```typescript
import { createMockingGUIServer } from '@kakaocloud/mocking-gui/server';
import { handlers } from './mocks/handlers';

const server = await createMockingGUIServer({
  mocks: handlers,
  // cookie: '...', // (Optional) Manual injection required if not using Next.js
});

server.listen();
```

## Cookie Injection

To enable Mocking GUI's core feature of **"changes in browser panel -> immediate reflection in server data"**, the browser's state (cookies) must be passed to the server.

### Why is Cookie Injection Necessary?

1. A user sets the "User API" to `500 Error` in the browser panel.
2. This setting is saved in a browser cookie (`mocking-gui-handler-config`).
3. When the page is refreshed, the browser sends a document request to the server including this cookie.
4. **The server must read this cookie to know that "the user wants to see a 500 error".**
5. If the cookie is not injected, the server will always mock using the **default value (Success)** during rendering.
6. As a result, **server data (Success) and client data (Error) will differ, causing a Hydration Mismatch error.**

### Setup by Framework

#### Next.js (App Router)

Mocking GUI automatically detects the Next.js environment and retrieves cookies via `next/headers`. Therefore, no separate injection is required.

```typescript
// app/page.tsx
import { createMockingGUIServer } from '@kakaocloud/mocking-gui/server';

export default async function Page() {
  // You can omit the cookie property as it is handled automatically.
  const server = await createMockingGUIServer({ mocks });
  server.listen();
  // ...
}
```

#### Other Frameworks (Remix, SvelteKit, etc.)

In environments other than Next.js, you must extract the cookie string from the request headers using the method provided by each framework and pass it directly to the `cookie` property.

**Remix Example:**

```typescript
// app/routes/_index.tsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const server = await createMockingGUIServer({
    mocks,
    // Extract cookie header from Remix's request object
    cookie: request.headers.get('Cookie'),
  });
  server.listen();
  // ...
};
```
