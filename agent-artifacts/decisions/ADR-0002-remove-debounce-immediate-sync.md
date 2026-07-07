---
version: 1.0.0
name: 'ADR-0002: Remove Cookie Sync Debounce and Sync Immediately'
type: adr
status: accepted
run_id: 2026-07-01-ssr-state-sync
description: 'Decision to remove the 300ms debounce that causes SSR desynchronization and switch to immediate synchronization'
---

# ADR-0002: Remove Cookie Sync Debounce and Sync Immediately

**Status**: Accepted  
**Date**: 2026-07-01  
**Deciders**: System Architect, Frontend Engineer  
**Affected Stakeholders**: Testing Specialist, library users  
**Links**: `executions/phase1-analysis.md` (Issue #1), `spec.md` §3.1

---

## Context

### Background (Why?)

The existing `syncStateToCookie` applied a 300ms `setTimeout` debounce for the purpose of performance optimization. However, this caused the server to read a **stale cookie** that had not yet been written during fast navigation (50~100ms) immediately after a state change, resulting in SSR rendering with an incorrect state.

Timeline analysis:

- t=0ms: User changes variant, Zustand updates immediately
- t=0~5ms: `syncStateToCookie()` called → 300ms timer starts, cookie not yet written
- t=50ms: Navigation → SSR request
- t=100ms: Server reads the **old cookie** → incorrect rendering
- t=300ms: Cookie is written belatedly (server rendering already complete)

Fast navigation occurs in approximately 2~5% of all cases and causes state inconsistency.

### Technical Evaluation Criteria

- SSR consistency: **Critical**
- Performance (write overhead): Low (negligible per measurements)
- Implementation complexity: Low
- Backward compatibility: High

---

## Decision

### Final Choice (What?)

**Completely remove the debounce and synchronize to the cookie immediately on every state change.**

### Rationale (Why this?)

1. **Negligible actual optimization effect**: A `document.cookie` write is effectively a no-op at ~0.1ms. The cost that debounce was preventing is at the <1% level.
2. **Trade-off reversal**: The minuscule performance gain << the SSR inconsistency loss (2~5% of cases). In other words, the debounce was a failed trade-off.
3. **Immediate consistency guaranteed**: The cookie is written immediately, so the server always reads the latest state (SSR/CSR sync latency 300ms → 0ms).
4. **No side effects**: Removing the debounce alone maintains compatibility with existing code.

Stress test (1000 consecutive changes): 1000 writes × 0.1ms = 100ms accumulated, negligible, and 100% SSR consistency achieved.

---

## Consequences

### Positive Impact (Pros)

✅ SSR/CSR synchronization latency 300ms → 0ms  
✅ Latest state reflected even during fast navigation (50ms)  
✅ Improved code clarity by removing the "magic number 300ms"

### Negative Impact (Cons)

❌ Theoretical increase in cookie write count (during consecutive changes)

### Mitigations

| Risk                                                 | Severity | Mitigation                                                                                                             |
| ---------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Performance degradation due to increased write count | Very Low | Measured overhead of <0.1ms per write is negligible compared to network latency. Monitor for regression via benchmarks |

---

## Alternatives Considered

### Alternative A: Shorten Debounce Time (300ms → 50ms/100ms)

**Description**: Keep the debounce but reduce the delay.  
**Pros**: Minimal change.  
**Cons**: Inconsistency still remains for navigation below the threshold, and the magic-number problem of "why exactly that number?" persists.  
**Verdict**: ❌ Not a fundamental solution; rejected as a compromise.

---

## Related ADRs

- ADR-0001: Cookie-based SSR State Synchronization Store (parent decision)
- ADR-0004: Environment-aware Error Handling (error visibility on the immediate sync path)

---

## Implementation Notes

### Design Considerations

- Location of change: `packages/mocking-gui/src/utils/browser/cookie.ts` — remove the `debounceTimer` variable and the `setTimeout(..., 300)` wrapper.
- The `useHandlerStore.ts` subscription callback continues to use the immediate invocation path as-is.

### Testing Approach

- Unit test: Verify the cookie exists immediately after calling `syncStateToCookie()` (without waiting 300ms).
- Integration test: After a state change, the server reconstruction result at the 50ms mark matches the client state.
- Performance test: Benchmark sync overhead at <1ms.

### Monitoring

- **SSR Desync Rate**: Target <0.5% (previously 2~5%).

---

## References

- `executions/phase1-analysis.md` Issue #1 (timeline / performance measurements)
- `executions/phase2-implementation.md` Task 1

---

## Notes

- Initial authoring: 2026-07-03 (promoted from the decision log of run 2026-07-01-ssr-state-sync)
- Version: v1.0
