---
version: 1.0.0
description: 'Technical guardrail competency for verifying that the Mocking GUI system adheres to stability, integrity, and performance guidelines'
name: technical-guardrail
---

# Skill: Mocking GUI Technical Guardrail (Stability & Integrity)

A skill for validating integrity and providing technical guidelines to ensure the Mocking GUI system operates stably on top of the browser and MSW.

## 1. Core Competencies

- **Structural Integrity**: Automated verification of architecture standard compliance and control of coupling between modules.
- **Runtime Stability**: Service Worker (SW) lifecycle management and prevention of hydration errors.
- **Performance Governance**: Optimization of memory load and response latency when registering a large number of handlers.

## 2. Reference & Detailed Specs

- **Structural Integrity**: [Internal Structure and Dependency Rules](./reference/structural-integrity.md)
- **Technical Foundation**: [Browser Integration Technical Foundation](./reference/technical-foundation.md)
- **UI Implementation**: [GUI Component Implementation Standard](./reference/ui-implementation-standard.md)

## 3. Decision Tree / Standard Workflow

- **Q1. Page load stalls after registering the Service Worker?** -> **Action**: Verify the security context (HTTPS/localhost) and the SW scope.
- **Q2. Data mismatch between server components and client (Hydration error)?** -> **Action**: Verify whether the Cookie-based Sync architecture is applied.
- **Q3. Handler count has grown to more than 100?** -> **Action**: Optimize `responseVariantsFn` and remove unnecessary serialization.

## 4. Engineering Constraints & Mandates

- "All core changes must maintain strict type safety without using `any`."
- "When using browser-only APIs, always apply the `typeof window !== 'undefined'` guard."
- "Mocking GUI Store state changes must only be performed through defined Actions."
