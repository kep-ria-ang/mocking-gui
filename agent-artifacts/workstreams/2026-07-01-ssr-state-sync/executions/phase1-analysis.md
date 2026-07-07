---
version: 1.0.0
name: 'Phase 1 Analysis Log - SSR State Synchronization'
description: 'Phase 1 analysis execution log for SSR state sync improvements - root cause identification, storage candidate investigation, chosen strategy and rationale. The final specification is delegated to spec.md.'
---

# Phase 1 Analysis Log: SSR State Synchronization

> This document is the **analysis execution log** of Phase 1 (Strategy/Design). The finalized feature specifications, acceptance criteria, and implementation plan are delegated to [`spec.md`](../spec.md) in the same run; only "how we reached those conclusions" is documented here.

- **Target Feature**: Cookie-based SSR State Synchronization Improvements
- **Analysis Period**: 2026-06-30 ~ 2026-07-01
- **Responsible**: product-planner → system-architect (reviewed by Advisor)
- **Final Artifacts**: `spec.md` (Phase 1 Specification), this analysis log, ADR candidates (see end of document)

---

## 1. Problem Analysis (Root Cause)

The target code is `syncStateToCookie()` in `utils/browser/cookie.ts` and the `useHandlerStore.ts` (subscribe callback) that subscribes to it. Three root causes have been established.

### RC-1. Debounce Desynchronization (High)

- **Phenomenon**: Due to the `setTimeout(..., 300)` debounce, the cookie is not written for up to 300ms after a state change.
- **Root Cause**: Fast navigation (50–100ms) triggers an SSR request before the debounce delay finishes, causing the server to read the **previous value** from `cookies()` and render with an stale variant → hydration mismatch.
- **Re-evaluation**: The original purpose of debounce ("cookie write batching optimization") has little practical benefit because writing `document.cookie` is virtually a no-op (<0.1ms). The performance gain (<1%) is far outweighed by the cost of state desynchronization (2–5% of all navigations).

### RC-2. Cookie Overflow Silent Failure (Critical)

- **Phenomenon**: When the state size exceeds the browser's 4KB limit, the cookie **silently fails to save** (no error is thrown).
- **Root Cause**: The size check does not account for the ~30% bloating of `encodeURIComponent`, and even if it exceeds the limit, it only prints a `console.warn` and proceeds. Exceeding 4KB is common in environments with 100+ handlers (microservices).
- **Impact**: The server fails to read the cookie and falls back to default values or real APIs → causes undiagnosable issues of the type "Why is the real API being called?". Silent failure is the worst type of error (zero visibility).

### RC-3. Lack of Error Visibility (High)

- **Phenomenon**: Errors during encode/write/parse either propagate without try-catch or only remain in the console. No feedback is provided to the user.
- **Root Cause**: Absence of an error boundary or try-catch in the subscribe callback. Combined with RC-2, failures are 100% hidden.

> Note: The severity of RC-1 and RC-3 differed in the initial analysis records (see § Conflict List). This log adopts the severity from the final `spec.md` (RC-2 Critical, RC-1 & RC-3 High).

---

## 2. Investigation and Comparison of Solution Candidates

The decisive constraint was that the **SSR server must be able to read the latest value**. Storage candidates were evaluated based on this criterion.

| Candidate                     | SSR Server Access | 100+ Handlers     | Additional Request   | Sync Delay | Verdict                                       |
| ----------------------------- | ----------------- | ----------------- | -------------------- | ---------- | --------------------------------------------- |
| **HTTP Cookie (Improved)**    | ✅                | ✅ (multi-cookie) | Not Required         | <1ms       | **Adopted**                                   |
| URL Query String              | △                 | ❌ (~2KB)         | Not Required         | <1ms       | Unsuitable (size limit, UX history pollution) |
| localStorage / sessionStorage | ❌                | ✅                | Required             | N/A        | Impossible (client-only)                      |
| IndexedDB                     | ❌                | ✅                | Required             | N/A        | Impossible (client-only)                      |
| Server-Side Session           | ✅✅              | ✅                | Required (100–300ms) | 100–300ms  | Over-engineering (complexity, scalability)    |

**Conclusion**: Cookie is the only low-cost standard technology that the server can read directly from HTTP headers without additional requests. localStorage/IndexedDB fail to meet the core SSR requirement (server accessibility), and Server Session introduces excessive performance and complexity costs. Query String was eliminated due to size limits and UX issues.

### Intermediate Attempts Reviewed and Discarded

- **Shortening Debounce from 300ms to 100ms (Initial proposal, "Solution A")**: This only reduces the window of desync rather than solving the root cause, and leaves a magic number issue ("Why 100ms?"). Discarded after review.
- **Guaranteeing Promise Order + SessionStorage ("Solution B", Chosen in initial decision logs)**: Discarded in the final specification due to the fatal flaw of SessionStorage being inaccessible to the server (see § Conflicts below).
- **Single Cookie after Compression (gzip)**: Discarded due to the lack of sufficient benefit compared to the CPU cost and the need to introduce external dependencies.

---

## 3. Chosen Strategy and Rationale

We adopt a **Cookie-based approach with 3 improvements**. Detailed code design and AC are delegated to `spec.md` §2–4.

1. **Remove Debounce (RC-1)**: Synchronize immediately. Since `setCookie` itself takes <0.1ms, this removes the SSR/CSR delay (300ms → 0ms) without performance degradation. No side effects or breaking changes.
2. **Multi-Cookie Split (RC-2)**: Store in a single cookie if `≤3800B`. If exceeded, split into 3000B chunks (`mocking_gui_sync`, `mocking_gui_sync_1`, ...), and **explicitly throw an error** if the absolute ceiling is exceeded (no silent failures). The server reconstructs the state by traversing prefixed keys. This is a proven standard pattern (used by Google Analytics) with zero dependencies.
3. **Explicit Error Handling (RC-3)**: Wrap the sync logic in try-catch. In development, fail-fast (throw). In production, log the error and degrade gracefully (optional UI notifications). Increases visibility from 0% to 100%.

**Summary of Rationale**: All three improvements have an overhead of <1ms, introduce no breaking changes or new dependencies, and can be verified via unit/integration tests. Cookies are well-suited for the library's CSR-centric nature and its small-to-medium scale (100–300 handlers) target audience.

---

## 4. Remaining Risks

| Risk                                              | Level    | Mitigation                                                                                                 |
| ------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Increased request header size due to multi-cookie | Low      | Split only when necessary (>3800 bytes, which is rare). Single cookie for typical cases (~0.02% overhead). |
| Server-side reconstruction errors                 | Low      | Clear parsing logic + unit tests. Safe fallback to empty state on failure.                                 |
| Excessive writes due to debounce removal          | Very Low | <0.1ms per write, negligible compared to network latency.                                                  |
| State exceeding 10KB+                             | Med      | Explicit error at Tier ceiling + documentation guide on "reducing handlers/feature flags".                 |
| Browser compatibility                             | Very Low | Multi-cookie is a standard feature supported by all browsers.                                              |

**Open/Follow-up**: The "cache invalidation" item in the final specification was mentioned as a candidate for the 3rd root cause in early analyses but was not finalized in Phase 1. It is left as a candidate for hybrid storage in Phase 2+.

---

## Decisions (ADR Promising Candidates)

- ADR: Adopting HTTP Cookie as the SSR state store (compared to localStorage/Session)
- ADR: Complete removal of cookie synchronization debounce
- ADR: Introduction of Multi-Cookie Split for states exceeding 4KB and explicit failure on ceiling overflow
- ADR: Explicit error handling for state sync failures (dev fail-fast / prod graceful degradation)
