# Communication & State Synchronization

Defines the core communication mechanisms for maintaining consistent state and exchanging data between multiple tabs (Client) and workers (Worker) in the browser environment.

---

## 1. BroadcastChannel API (N:N Communication)

The most intuitive interface for bidirectionally sending messages between all browsing contexts (tabs, windows, iframes, etc.) sharing the same origin.

- **Primary Use Case**: Used to simultaneously broadcast real-time state (login info, theme, common settings, etc.) to all tabs.

### Standard Message Structure

```typescript
interface BroadcastMessage<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  senderId: string; // Unique identifier for filtering one's own messages
}
```

### Implementation Pattern

```javascript
const channel = new BroadcastChannel('app_sync_channel');

// Send message
function broadcast(type, data) {
  channel.postMessage({
    type,
    payload: data,
    timestamp: Date.now(),
    senderId: self.crypto.randomUUID(),
  });
}

// Receive message
channel.onmessage = event => {
  const { type, payload, senderId } = event.data;
  // Message handling logic
};
```

---

## 2. MessageChannel API (1:1 Communication)

Creates two independent ports for direct message exchange. Provides strong performance when establishing a dedicated channel between the main thread and a Service Worker/Web Worker.

- **Transferable Objects**: Large data can be passed by transferring ownership without copying, minimizing performance overhead.
- **Workflow**:
  1. Create `const channel = new MessageChannel()`.
  2. Send one port to the other party via `postMessage(..., [port])`.
  3. Begin communication via `onmessage` on both ports.

---

## 3. Storage Event Sync (Persistence-Based Synchronization)

Synchronizes by detecting events triggered when `localStorage` or `sessionStorage` data changes. Useful as a fallback for environments that do not support `BroadcastChannel`.

```javascript
window.addEventListener('storage', event => {
  if (event.key === 'sync_target_key') {
    // Update state based on the changed value (event.newValue)
  }
});
```

---

## 4. SharedWorker (Centralized Management)

Allows multiple tabs to share a single worker instance to manage common state (e.g., a single WebSocket connection, shared cache). Efficient for large-scale applications requiring complex state management.
