---
version: 1.0
description: 'Expert competency in systematic browser network mocking using MSW 2.x and Service Worker'
name: browser-msw-expert
---

# Skill: Browser & MSW Expert

This is an expert competency for building a fully isolated network environment without modifying application code, by combining the browser's Service Worker standard with the MSW (Mock Service Worker) 2.x engine.

## 1. Core Workflows

### 1.1. Lifecycle Management

Precisely controls the Service Worker lifecycle to prevent mocking gaps.

- **Workflow**: `install(skipWaiting)` -> `activate(clients.claim)` -> `fetch(intercept)`.
- **Reference**: [Service Worker Lifecycle & API](./references/sw-lifecycle.md)

### 1.2. Advanced Interception

Goes beyond simple JSON responses to reproduce the same network behavior as a real server.

- **Patterns**: Dynamic Resolvers, Streaming, Error Simulation, Network Latency.
- **Reference**: [MSW 2.x Advanced Patterns](./references/msw-advanced-patterns.md)

### 1.3. System Integrity & Mocking GUI Integration

Integrates with Mocking GUI's standard architecture (Handlers, Factories, Scenarios) to build a maintainable mocking system.

- **Constraints**: Avoid creating `Response` objects directly; adhere to `harness.config.ts`.
- **Reference**: [Mocking GUI System Integration](./references/mocking-gui-integration.md)

## 2. Decision Tree: Troubleshooting Strategy

- **Q1. Is the API request passing through to the real server without being intercepted?**
  - **Check**: Service Worker registration status, scope configuration, and location of the `mockServiceWorker.js` file.
  - **Action**: Perform Network Tab analysis per the [Debugging Guide](./references/debugging-guide.md).
- **Q2. Updated mock data is not reflected in the browser?**
  - **Action**: Enable "Update on reload" in DevTools and force re-register the SW.
- **Q3. Complex authentication (Auth) flows or state synchronization required?**
  - **Action**: Apply Cookie-based Sync Logic or BroadcastChannel Bridge pattern.

## 3. Expert Commands & Shortcuts

- **Init SW**: `npx msw init public` (generates the Service Worker script)
- **Start Worker**: `worker.start({ onUnhandledRequest: 'warn' })`
- **Override Handler**: `worker.use(...newHandlers)` (required when switching scenarios)

## 4. Engineering Standards

- All handlers default to asynchronous (`async`) processing and use `HttpResponse` factory methods for readability.
- When reproducing network errors, always use `HttpResponse.error()` to trigger actual browser error events.
- Large binary data is delivered in streaming fashion via `ReadableStream`.
