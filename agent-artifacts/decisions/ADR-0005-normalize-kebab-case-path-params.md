---
version: 1.0.0
name: 'ADR-0005: Normalize kebab-case OpenAPI path params to camelCase'
type: adr
status: proposed
run_id: 2026-07-16-swagger-hyphen-param-mismatch
description: 'normalizePathParams must sanitize brace-param names into path-to-regexp-safe identifiers, since hyphenated names silently never match at request time'
---

# ADR-0005: Normalize kebab-case OpenAPI path params to camelCase

**Status**: Proposed
**Date**: 2026-07-16
**Deciders**: System Architect
**Affected Stakeholders**: Frontend Engineer, Testing Specialist, library users importing kebab-case OpenAPI specs
**Links**: `workstreams/2026-07-16-swagger-hyphen-param-mismatch/executions/phase1-analysis.md`

---

## Context

### Background (Why?)

`normalizePathParams` (`utils/handler/pathParams.ts`) converts OpenAPI
`{param}` path templates to MSW's `:param` syntax via a direct string
substitution, without validating or sanitizing the captured parameter name.

OpenAPI specs commonly use kebab-case parameter names (`{kubeflow-id}`,
`{group-name}`). `path-to-regexp` (which `msw`'s `http.<method>()` compiles
routes with) reads a named parameter token only up to the first non-word
character. A hyphen ends the token early, so `:kubeflow-id` is compiled as
parameter `kubeflow` followed by the **literal** text `-id` — which never
appears in a real request path. The handler is registered successfully (no
thrown error, no lint/type failure) but can **never** match an incoming
request, so it silently falls through to the real network. This reproduced
concretely: `match('/v1/kubeflows/:kubeflow-id')('/v1/kubeflows/<uuid>')` →
`false` under `path-to-regexp@6.3.0` (the version resolved by this repo's
`msw@2.12.10`).

This is a silent correctness defect: the GUI shows the handler as
active/configured, which contradicts the actual runtime behavior. It is a
strictly worse failure mode than an inactive handler, because there the GUI
truthfully reflects "off"; here the GUI shows "on" while the route never
fires.

### Technical Evaluation Criteria

- Requests actually get intercepted for any valid OpenAPI param naming
  convention: **Critical**
- No behavior change for existing camelCase/snake_case params: **Critical**
- No change to persisted handler-key format beyond what's needed
  (`getHandlerKey`/`getHandlerUniqueKey` embed the URL, so a param-name change
  changes the store key — acceptable, treated as a one-time re-import): Medium
- Minimal, localized change: High

---

## Decision

### Final Choice (What?)

`normalizePathParams` converts each `{param-name}` to `:paramName` — hyphens
(and any other `path-to-regexp`-unsafe characters) inside the captured name
are stripped and the following character is upper-cased, matching this
codebase's existing manual-handler convention (`:kubeflowId`, not
`:kubeflow_id`):

```ts
export const normalizePathParams = (path: string) => {
  if (!path) return path;
  return path.replace(/\{([^}]+)\}/g, (_, name: string) => `:${toSafeParamName(name)}`);
};

const toSafeParamName = (name: string) =>
  name.replace(/[^a-zA-Z0-9_]+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
```

### Rationale (Why this?)

1. **Fixes the actual defect at its single source** — every Swagger-derived
   handler goes through `normalizePathParams`; no downstream code needs to
   change.
2. **camelCase, not underscore** — matches the convention already used by
   manually-authored handlers in this codebase, so Swagger and Manual/Auto
   handlers for the same conceptual param look consistent in the GUI.
3. **No externally observable regression for already-safe param names** —
   `{kubeflowId}`, `{kubeflow_id}` (regex only touches non-word-boundary runs
   followed by a letter/digit) pass through unchanged in practice for the
   common cases in this consumer's spec.

### Alternatives Considered

- **Leave hyphenated param names, rely on documentation** — rejected: this is
  a silent failure with no error surface; a doc note does not help a user who
  doesn't yet know this defect exists (as in this session).
- **Detect and warn instead of fixing** — rejected: a warning without a fix
  still leaves every kebab-case OpenAPI spec unusable through Swagger import,
  which defeats the feature's purpose.

---

## Consequences

- Persisted `handlerConfigs` keys for existing kebab-case Swagger handlers
  change (e.g. `delete...../v1/kubeflows/:kubeflow-id` →
  `delete...../v1/kubeflows/:kubeflowId`). Existing users with such specs will
  see those handlers as "new" (default `active: false`) after upgrading, and
  must re-activate them once. This is judged acceptable: the
  old keys pointed at handlers that never worked, so there is no working
  behavior being broken.
- Must document in changelog as a bug fix with a migration note (re-toggle
  affected handlers once after upgrade).
