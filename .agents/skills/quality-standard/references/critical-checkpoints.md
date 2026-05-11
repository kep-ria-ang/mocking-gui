# Mocking GUI Library Critical Validation Checklist (Precision Level)

A precision inspection list of **low-level technical behaviors and core feature chains** that must be passed before every release to guarantee the reliability of the Mocking GUI library.

## 1. Low-Level Bridge & Interception

- [ ] **Service Worker Update Control**: After modifying code and refreshing, does the new worker immediately take control via `skipWaiting` without the old worker occupying it?
- [ ] **Unmatched Request Bypass**: When an API request not defined in Mocking GUI occurs, does it bypass correctly to the real network (original server) without errors?
- [ ] **Request Body Streams**: During `POST/PUT` requests, are large JSON payloads or `FormData` streams delivered to the handler without corruption?
- [ ] **Concurrent Request Handling**: When dozens of APIs are called simultaneously (Parallel Fetch), does the worker manager handle responses without deadlock?

## 2. SSR/RSC Synchronization (Server-Side Sync Integrity)

- [ ] **Cookie Size Management**: When the number of handler states grows, does compression or splitting processing work to prevent the cookie size from exceeding the browser limit (approximately 4KB)?
- [ ] **Hydration Consistency**: Do the data mocked on the server and the data to be hydrated on the client match, so that no 'Hydration Mismatch' warning is generated?
- [ ] **Server-Side Setup Timing**: Does `setupMockingServer` execute in the top-level middleware so that it takes priority over interceptors from other libraries?

## 3. GUI Isolation & Runtime (GUI Isolation and Runtime Stability)

- [ ] **Shadow DOM Event Bubble**: Do click/input events inside the panel not trigger external application event listeners or interfere with event propagation?
- [ ] **Global Style Bleeding**: Do styles inside the panel not affect external DOM elements, and conversely, do external libraries (Tailwind, Bootstrap, etc.) not break the panel UI?
- [ ] **Store Persistence Integrity**: After a forced browser close and reconnection, are the state values in `localStorage` restored without corruption so that previous mocking settings are maintained?

## 4. Swagger & Scenario Engine (Advanced Feature Chain)

- [ ] **Swagger Schema Mapping**: Are complex repository references ($ref) and `oneOf/anyOf` schemas in OpenAPI 3.0/3.1 accurately converted to mock data?
- [ ] **Scenario State Atomicity**: During scenario transitions, are the states of multiple handlers updated atomically so that no intermediate state where only some are reflected exists?
- [ ] **Delay Precision**: When `delay(ms)` is configured, does the response delay occur within a margin of error (±10ms) on the actual browser timeline?
