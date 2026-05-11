# MSW 2.x Advanced Patterns

MSW (Mock Service Worker) 2.x provides powerful interception capabilities based on the standard `Request` and `Response` APIs.

## 1. Response Resolvers

- **HttpResponse**: The core response object in 2.x. Use `HttpResponse.json()`, `HttpResponse.text()`, etc.
- **Delay**: Use the `delay()` function to simulate network latency.

```typescript
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/users', async () => {
    await delay(500); // 500ms delay
    return HttpResponse.json([{ id: 1, name: 'David' }]);
  }),
];
```

## 2. Advanced Interception

- **Wildcard & Regex**: `http.get('/api/posts/*')`, `http.get(/\/api\/posts\/\d+/)`.
- **Request Body Analysis**: `const data = await request.json()`.
- **Dynamic Resolvers**: Return dynamic responses based on the request's headers, query parameters, and body.

## 3. Stream & Binary

- Use `ReadableStream` for mocking large data or streaming.

```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode('Hello '));
    controller.enqueue(new TextEncoder().encode('World'));
    controller.close();
  },
});
return new HttpResponse(stream);
```

## 4. Error Simulation

- **Network Error**: `HttpResponse.error()` (reproduces an actual network disconnection).
- **Status Codes**: `new HttpResponse(null, { status: 404 })`.
