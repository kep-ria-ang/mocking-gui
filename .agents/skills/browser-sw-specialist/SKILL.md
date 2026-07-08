---
version: 1.0.0
description: 'Advanced technical knowledge for Service Worker runtime control and multi-tab state synchronization in the browser'
name: browser-sw-specialist
---

# Skill: Browser Service Worker & State Synchronization

Specialized technical knowledge for ensuring network interception availability (Service Worker) in the browser environment and synchronizing state in real time across multiple tabs and processes.

## 1. Core Competencies

- **SW Lifecycle Management**: Optimizing Service Worker installation (Install), activation (Activate), updates, and client control (Claim).
- **Cross-Tab State Sync**: Designing multi-tab state synchronization architectures using `BroadcastChannel` and `Storage Event`.
- **Worker-Main Communication**: High-speed data exchange and control between the main thread and background workers via `postMessage` and `MessageChannel`.
- **Cache Strategy**: Establishing intelligent caching/invalidation strategies for network request results and static assets.

## 2. Reference & Detailed Specs

- **Communication Sync**: [Cross-Tab and Cross-Worker Synchronization Strategy](./reference/communication-sync.md)
- **Service Worker Debugging**: [Worker Anomaly Diagnosis Guide (TBD)](#)

## 3. Decision Tree / Standard Workflow

- **Q1. State from a previous tab is not reflected in a new tab?**
  - **Action**: Check the `BroadcastChannel` message handler registration status and verify that the channel name matches.
- **Q2. After a Service Worker update, existing tabs lose control?**
  - **Action**: Inspect the timing of `self.skipWaiting()` and `clients.claim()` calls, and review the service worker lifecycle handling.
- **Q3. Network request interception inside the worker is failing?**
  - **Action**: Verify the scope of the `fetch` event handler and check the conditions for calling `respondWith()`.

## 4. Engineering Constraints & Mandates

- "All communication logic must be implemented asynchronously to prevent main thread performance degradation; apply debouncing when necessary."
- "Communication channels between tabs must be clearly separated by purpose, and sensitive information transmitted must be minimized for security."
- "Service Worker state changes must always be observable, and logging must be performed when key events occur."
