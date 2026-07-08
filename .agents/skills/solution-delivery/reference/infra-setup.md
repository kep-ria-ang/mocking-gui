# Mocking GUI Adaptive Infrastructure Setup Guide

Technical guidelines for optimally configuring Mocking GUI in various environments based on diagnosis results.

## 1. Next.js (App Router) Integration

- **Server Side**: Initialize `setupMockingServer` in `instrumentation.ts` or the top-level layout.
- **Client Side**: Place `MockingGUIBoundary` in the Root Layout to ensure style isolation.
- **Cookie Sync**: Configure cookie domain and path for state synchronization between server and client.

## 2. React CSR (Vite/Webpack)

- **SW Registration**: Configure the location of `mockServiceWorker.js` and the public path.
- **HMR Support**: Manage as a singleton to prevent duplicate worker instances from being created during hot module replacement.

## 3. Migration Flow

1. **Dependency Install**: Deploy `harness`, `msw`, and related agent skills.
2. **Config Initialization**: Create `harness.config.ts`. At this point, all handlers must be defined as `HandlerConfigOption` objects and injected into the `mocks` array.
3. **Entry Point Patch**: Insert Mocking GUI initialization code at the project's main entry point.
4. **Validation**: Confirm that the list of registered handlers appears in the GUI panel.
