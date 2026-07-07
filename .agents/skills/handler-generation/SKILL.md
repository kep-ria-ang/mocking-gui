---
version: 1.0.0
description: 'Implementation competency for automatically generating Mocking GUI standard 4-Layer handlers and mock data by analyzing API specifications'
name: handler-generation
---

# Skill: Mocking GUI Handler Generation (Performance-Optimized)

Competency for building Mocking GUI 4-Layer pattern handlers based on API specifications.

## ⚠️ CRITICAL MANDATE: "NO SPEC, NO CODE"

- **It is strictly prohibited to generate code by guessing without an explicit API specification (Swagger URL, OpenAPI JSON, TS Interface, etc.).**
- **The first action must always be to 'obtain the API specification'.** If the information is unavailable, immediately request it via `ask_user`. Do not waste time searching the codebase indiscriminately.

## 1. Quick Workflow (Fail-Fast)

- **Phase 1. Validation (Immediate)**: Confirm availability of the API endpoint, method, and data types. If unavailable, stop immediately and ask.
- **Phase 2. Strategy Proposal**: Present a summary of the 4-Layer structure and sample data to obtain user approval.
- **Phase 3. Surgical Implementation**: Implement in the order of `constants`, `factories`, `handlers` according to the approved strategy.

## 2. Decision Logic

- **Don't know where the API Spec is?** -> **Action**: Do not search the entire codebase; ask the user for the location.
- **Need to modify an existing handler?** -> **Action**: Precisely analyze only that file with `read_file` before making changes.

## 3. Engineering Standards

- **Full Path Enforcement (CRITICAL)**: MSW requires **absolute URLs (including domain)** to intercept cross-origin requests.
  - When analyzing Swagger specifications, always check `servers` or `basePath`.
  - **If the URL path is unknown or ambiguous, never guess — explicitly require the user to confirm the Base URL.**
  - The confirmed Base URL must be extracted into `constants.ts` so that all handlers reference it from a shared location.
- **Type-Safe**: No use of `any`. Implement interfaces that are 100% consistent with the actual API specification.
- **Deterministic**: Use `faker` seeds to generate consistent data.
- **Layered**: Strictly enforce separation of Handlers, Constants, Factories, and Utils layers.

## 4. Reference

- **Faker Standards**: [Deterministic Mock Data Generation Standards](./reference/faker-standards.md)
- **Mocking Strategy**: [4-Layer Handler Generation & Mocking Strategy](./reference/mocking-strategy.md)
