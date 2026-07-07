---
version: 1.0.0
name: 'ADR-0001: Selection of Cookie-Based SSR State Synchronization Store'
type: adr
status: accepted
run_id: 2026-07-01-ssr-state-sync
description: 'Decision to select HTTP Cookie as the SSR state synchronization store'
---

# ADR-0001: Selection of Cookie-Based SSR State Synchronization Store

**Status**: Accepted  
**Date**: 2026-07-01  
**Deciders**: Product Planner, System Architect  
**Affected Stakeholders**: Frontend Engineer, Testing Specialist, Library Users  
**Links**: `agent-artifacts/workstreams/2026-07-01-ssr-state-sync/spec.md`, `executions/phase1-analysis.md`

---

## Context

### Background (Why?)

In an SSR environment, the server must read the client's latest mocking state (handler activation / variant selection) and render with the same state. If the server rendering and the client state diverge, hydration mismatches and incorrect mock data will be exposed.

Key constraints:

- The state must be accessible at the time of the SSR request (server processing)
- Client state changes must be delivered to the server without a separate network request
- Must be able to hold the state of 100+ handlers
- Must comply with browser standards / security policies

### Technical Evaluation Criteria

- SSR server accessibility: **Critical**
- Performance (synchronization latency): High
- Support for 100+ handlers: High
- Implementation complexity: Medium
- Security: Medium

---

## Decision

### Final Choice (What?)

**Adopt HTTP Cookie (improved version) as the SSR state synchronization store.**

### Rationale (Why this?)

1. **SSR server accessibility**: Because the browser automatically includes cookies in every HTTP request, the server can read the state directly from the request header. It is the only client storage approach that satisfies this requirement.
   - localStorage/IndexedDB are not accessible from the server (fatal disqualifier)
2. **Performance**: Synchronization time <1ms. This is hundreds of times faster than Server Session (100~300ms), which requires a separate API call.
3. **No additional request required**: No separate synchronization API is needed to deliver the state.
4. **Standard/Simplicity**: As a web standard (RFC 6265), it is supported by all browsers and requires no additional server infrastructure.

In the overall evaluation, Cookie scored the highest at 18/20 (Query 10, localStorage/IndexedDB 8, Session 12).

---

## Consequences

### Positive Impact (Pros)

✅ 100% fulfillment of SSR requirements (server reads directly from the header)  
✅ <1ms synchronization, no additional network request  
✅ Server remains stateless → easy horizontal scaling

### Negative Impact (Cons)

❌ 4KB size limit per cookie → overflow with 100+ handlers  
❌ HttpOnly cannot be used (SSR requires client writes) → XSS exposure surface exists  
❌ Cache invalidation must be considered when the cookie value changes

### Mitigations

| Risk               | Severity | Mitigation Strategy                                                                  |
| ------------------ | -------- | ------------------------------------------------------------------------------------ |
| 4KB size limit     | High     | Extend up to 10KB with Multi-Cookie Split (ADR-0003)                                 |
| XSS exposure       | Medium   | Store only non-sensitive, dev-tool-natured state; apply general XSS defense policies |
| Caching complexity | Low      | Manage via frontend caching strategy                                                 |

---

## Alternatives Considered

### Alternative A: URL Query String

**Description**: Deliver state via URL query.  
**Drawbacks**: 2KB limit (50+ handlers not possible), forced navigation, history pollution, inefficient CDN caching.  
**Verdict**: ❌ Rejected due to size limit and UX problems.

### Alternative B: localStorage / SessionStorage

**Description**: Store state in browser storage.  
**Drawbacks**: Not accessible from the server → fails the core SSR requirement.  
**Verdict**: ❌ Rejected because SSR is not possible.

### Alternative C: IndexedDB

**Description**: Large-capacity client DB.  
**Drawbacks**: Not accessible from the server, same as localStorage.  
**Verdict**: ❌ Rejected because SSR is not possible.

### Alternative D: Server-Side Session

**Description**: Store state in a server session (memory/Redis) via a separate API.  
**Drawbacks**: Additional API call latency of 100~300ms, complex session management, concurrency issues, hindered horizontal scaling.  
**Verdict**: ❌ Rejected due to excessive performance/complexity cost (Overkill).

---

## Related ADRs

- ADR-0002: Debounce Removal (Cookie immediate write, depends on this decision)
- ADR-0003: Multi-Cookie Split (mitigates the 4KB limit, depends on this decision)
- ADR-0004: Environment-Aware Error Handling (makes cookie write failures visible, depends on this decision)

---

## Implementation Notes

### Design Considerations

- Implementation locations: `packages/mocking-gui/src/utils/browser/cookie.ts` (client write), `packages/mocking-gui/src/utils/server/state.ts` (server read/reconstruction).
- 4-Layer principle: Located in the Business Logic layer, with no changes to the Type/State/UI layers.
- Compatible with existing code (no additional dependencies).

### Testing Approach

- Verify state consistency via a CSR → Cookie → SSR integration test.
- Verify overflow in the 100+ handler scenario (linked with ADR-0003).

### Monitoring

- **SSR Desync Rate**: Monitored based on error logs (target <0.5%).
- **Overflow Failures**: Confirmed at 0% via E2E test (100 handlers).

---

## References

- `agent-artifacts/workstreams/2026-07-01-ssr-state-sync/spec.md` §2
- `executions/phase1-analysis.md` (comparison of 5 alternatives, overall 18/20)
- RFC 6265: HTTP State Management Mechanism

---

## Notes

- Initially written: 2026-07-03 (promoted from the decision log of run 2026-07-01-ssr-state-sync)
- Version: v1.0
