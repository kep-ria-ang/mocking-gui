---
version: 1.0.0
name: 'ADR-0004: Environment-Aware Error Handling Strategy for State Synchronization'
type: adr
status: accepted
run_id: 2026-07-01-ssr-state-sync
description: 'Adopt an error handling strategy that eliminates silent failures and responds differently per development/production environment'
---

# ADR-0004: Environment-Aware Error Handling Strategy for State Synchronization

**Status**: Accepted  
**Date**: 2026-07-01  
**Deciders**: System Architect, Frontend Engineer  
**Affected Stakeholders**: Testing Specialist, library users  
**Links**: `executions/phase1-analysis.md` (Issue #3), `spec.md` §3.3

---

## Context

### Background (Why?)

The existing state synchronization path had no handling for encoding/write/parse failures, so even when errors occurred the app silently continued running in an incorrect state. Silent failure is the worst kind of error: it creates situations where "mocking appears to work but the real API is actually being called," which take a long time to diagnose or go undetected entirely.

Actual user tickets: "Mocking not working", "Why is the real API being called?", "State not being saved" — investigation revealed no errors in the console, and the cause was a silent cookie write failure.

### Technical Evaluation Criteria

- Error visibility: **Critical**
- Developer feedback speed: High
- Operational stability (non-crashing): High
- Implementation complexity: Low

---

## Decision

### Final Choice (What?)

**Wrap the synchronization logic in try-catch and respond differently based on the environment.**

- **Development**: throw the error (fail-fast) — immediate awareness during development.
- **Production**: log the error explicitly but perform graceful degradation without crashing the app.
- Server side: entry validation + JSON parse error catching + safe fallback to baseConfigs.

### Rationale (Why this?)

1. **Eliminate silent failure**: All errors are logged explicitly, raising visibility from 0% to 100%.
2. **Developer-friendly**: Fast feedback in the development environment via throw.
3. **Operational safety**: In production, only logging is done and the app degrades gracefully, preventing crashes.
4. **Provide recovery guidance**: Offer actionable messages such as "reduce handler count" and "refresh."

---

## Consequences

### Positive Impact (Pros)

✅ Eradicate silent failure (100% error visibility)  
✅ Development: fast debugging through immediate failure  
✅ Production: graceful degradation without crashes  

### Negative Impact (Cons)

❌ Development-environment throws may propagate to parent components  
❌ Negligible overhead from try-catch (<1ms)  

### Mitigations

| Risk | Severity | Mitigation |
|--------|--------|---------|
| dev throw propagation | Low | Isolate via subscription callback / error boundary, limited to development environment |
| Infinite logging in production | Low | Log with clear context (count, source) included, with an optional UI notification if needed |

---

## Alternatives Considered

### Alternative A: Global throw (environment-agnostic)

**Description**: Throw errors in all environments.  
**Downside**: Risk of app crashes in production.  
**Verdict**: ❌ Rejected due to compromised operational stability.

### Alternative B: Global log only (environment-agnostic)

**Description**: Only console.error in all environments.  
**Downside**: Easy to miss even during development, losing the fail-fast benefit.  
**Verdict**: ❌ Rejected due to weakened development feedback.

### Alternative C: Status quo (no handling)

**Description**: No try-catch.  
**Verdict**: ❌ Causes silent failure; to be discarded.

---

## Related ADRs

- ADR-0001: Cookie-based SSR state synchronization storage (parent decision)
- ADR-0002: Debounce removal (error handling for the immediate synchronization path)
- ADR-0003: Multi-Cookie Split (consistent with Tier 3 explicit errors)

---

## Implementation Notes

### Design Considerations

- Client: `packages/mocking-gui/src/utils/browser/cookie.ts` — wrap synchronization logic in try-catch, throw when `process.env.NODE_ENV === 'development'`.
- Server: `packages/mocking-gui/src/utils/server/state.ts` — entry validation, parse error catching, baseConfigs fallback.
- 4-Layer: Handled within the Business Logic layer (optional UI notification in the UI layer).

### Test Approach

- Unit: Verify that `console.error` is called with the "Failed to sync state" message when an invalid config is injected.
- Server: Verify fallback to baseConfigs when parsing a corrupted cookie.

### Monitoring

- **Error Visibility**: Target 100% (previously 0% silent).

---

## References

- `executions/phase1-analysis.md` Issue #3 (severity by error type)
- `executions/phase2-implementation.md` Task 3

---

## Notes

- Initial authoring: 2026-07-03 (promoted from the decision log of run 2026-07-01-ssr-state-sync)
- Version: v1.0
