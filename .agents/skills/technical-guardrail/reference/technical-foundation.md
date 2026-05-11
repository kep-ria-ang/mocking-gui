# Mocking GUI Technical Foundation: Browser & MSW Internals

The robustness of the Mocking GUI system stems from a deep understanding of browser standards and the MSW engine. The following technical foundations are prioritized when designing the architecture.

## 1. Interception Engine (MSW 2.x)

- **Engine Isolation**: Aims for purely network-level interception that does not affect the application's runtime code.
- **Resolver Atomicity**: All response resolvers operate atomically and must be designed as small, reusable units.

## 2. Browser Environment Standards

- **Worker Thread Management**: Precisely manages the service worker lifecycle (Registration -> Install -> Activate) at the architecture level to eliminate mocking gaps (race conditions) at the root.
- **Storage & State Bridge**: Standardizes the state synchronization mechanism between the main thread and worker thread using IndexedDB and Cookies.
