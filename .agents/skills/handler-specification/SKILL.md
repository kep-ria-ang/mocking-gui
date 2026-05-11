---
version: 1.0.0
description: 'Implementation guide for complying with the 4-layer separation principle and handler specification standards of Mocking GUI'
name: handler-specification
---

# Skill: Mocking GUI Handler Pattern (Spec-Driven Implementation)

The standard pattern for engineers writing Mocking GUI handlers in a format that the Mocking GUI engine can recognize.

## 1. Core Competencies

- **Atomic Implementation**: Defining specifications via `HandlerConfigOption` constants instead of calling `msw` directly.
- **4-Layer Separation**: Ensuring maintainability of large-scale mock data through separation of concerns.
- **HandlerType Awareness**: Distinguishing between MANUAL (responseVariants) / AUTO (responseVariantsFn) / SWAGGER (swaggerResponseVariants) modes.

## 2. Reference & Detailed Specs

- **Handler Specification**: [HandlerConfigOption Detailed Specification](../harness-core/reference/handler-specification.md)
- **Architecture Standard**: [Mocking GUI Internal Layer Structure](../harness-core/reference/library-structure.md)

## 3. Decision Tree / Standard Workflow

- **Q1. Real-time control (toggle, manipulation) from the GUI is required?** -> **Action**: Define with `HandlerConfigOption` and register in the `mocks` array.
- **Q2. Multiple static response cases exist?** -> **Action**: Configure MANUAL mode with a `responseVariants[]` array.
- **Q3. Dynamic responses based on request parameters are required?** -> **Action**: Configure AUTO mode with a `responseVariantsFn` function.
- **Q4. Non-JSON response (HTML, Binary, etc.)?** -> **Action**: Use the `rawBody` field (`kind: 'html' | 'text' | 'binary' | ...`).
- **Q5. Migrating an existing MSW project?** -> **Action**: Map `http.xxx` call statements 1:1 to `HandlerConfigOption` properties.
- **Q6. Non-HTTP protocols (GraphQL/WebSocket, etc.) are required?** -> **Action**: Outside the current library scope. Requires a separate raw MSW configuration.

## 4. Engineering Constraints & Mandates

- "All handler layers must be clearly separated into Handlers, Constants, Factories, and Utils."
- "Direct raw MSW calls are prohibited. All handlers must be defined in `HandlerConfigOption` format."
- "All handler names (name) must be uniquely named to avoid duplicates."
- "Cross-origin APIs must use absolute URL paths (including domain)."
