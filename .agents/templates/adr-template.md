---
version: 1.0.0
name: "ADR Template - Architecture Decision Record"
type: template
description: "Standard template for documenting technical decisions"
---

# ADR-NNN: [Title: Technical Choice or Decision]

**Status**: Accepted | Proposed | Superseded (replaced by another ADR)  
**Date**: YYYY-MM-DD  
**Deciders**: [Agents/roles involved in the decision]  
**Affected Stakeholders**: [Affected teams/roles]  
**Links**: [Related document links]

---

## Context

### Background (Why?)
- Why did this decision need to be made?
- What problem needed to be solved?
- What are the technical constraints?

**Example**:
```
Server state needs to be synchronized to the client in an SSR environment.
Options:
1. LocalStorage: Persistent storage (retained even after refreshing post-SSR)
2. SessionStorage: Per-tab isolated storage (automatically cleared after refresh)
3. Memory: Volatile (lost on refresh)
```

### Technical Evaluation Criteria
- Performance: [Importance]
- Compatibility: [Importance]
- Implementation complexity: [Importance]
- Maintainability: [Importance]
- Security: [Importance]

---

## Decision

### Final Choice (What?)

**We choose [selected option].**

### Rationale (Why this?)

1. **[Criterion 1]**: [Description]
   - Metrics/evidence: [Concrete data]

2. **[Criterion 2]**: [Description]
   - Metrics/evidence: [Concrete data]

3. **[Criterion 3]**: [Description]
   - Metrics/evidence: [Concrete data]

**Example**:
```
We choose SessionStorage.

Rationale:
1. Independent per-tab state management is required in the SSR environment
   - State must not become mixed across tabs after SSR

2. State must persist even after a refresh
   - SessionStorage supports this (Memory does not)

3. The 10KB limit fits the functional requirements
   - Measured result: average 2-6KB (within the limit)
   - Worst case: add 10KB monitoring
```

---

## Consequences

### Positive Impact (Pros)

✅ **[Outcome 1]**: [Description]  
✅ **[Outcome 2]**: [Description]  
✅ **[Outcome 3]**: [Description]  

### Negative Impact (Cons)

❌ **[Risk 1]**: [Description]  
❌ **[Risk 2]**: [Description]  
❌ **[Risk 3]**: [Description]  

### Mitigations

How will each risk be mitigated?

| Risk | Severity | Mitigation Strategy |
|--------|--------|---------|
| [Risk 1] | High/Medium/Low | [Mitigation method] |
| [Risk 2] | High/Medium/Low | [Mitigation method] |

---

## Alternatives Considered

### Alternative A: [Alternative Name]

**Description**: [Technical description]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

**Verdict**: ❌ Not chosen, reason: [Specific reason]

### Alternative B: [Alternative Name]

[Same structure]

### Alternative C: [Alternative Name]

[Same structure]

---

## Related ADRs

**Other ADRs related to this decision**:

- [ADR-NNN]: [Title] (parent decision)
- [ADR-MMM]: [Title] (child decision, depends on this ADR)
- [ADR-KKK]: [Title] (considered as an alternative)

**Example**:
```
- ADR-001: State Model - SessionStorage chosen
  └─ ADR-002: Promise Ordering (implementation approach, depends on this choice)
     └─ ADR-003: Error Handling (error handling, depends on ADR-002)
```

---

## Implementation Notes

### Design Considerations

- Where is this decision reflected? (files, modules)
- What is the compatibility with existing code?
- Does it create technical debt? (document it if so)

### Testing Approach

- How will you verify that this decision is correct?
- Performance testing: [Method]
- Compatibility testing: [Method]

### Monitoring

How will you monitor after deployment?

- **Metric 1**: [Tracking method]
- **Metric 2**: [Tracking method]

---

## Decision Log

| Date/Time | Owner | Action | Result |
|------|--------|------|------|
| YYYY-MM-DD HH:MM | [Name] | [Decision-making process (discussion, review, etc.)] | [Approved/Rejected/Conditional] |
| | | | |

---

## References

- [Spec file link]
- [Related PR/Issue]
- [Technical documentation]
- [Performance benchmark]

---

## Approval

| Role | Status | Date | Notes |
|------|--------|------|-------|
| Product Manager | Approved | YYYY-MM-DD | |
| Technical Lead | Approved | YYYY-MM-DD | |
| Architecture | Approved | YYYY-MM-DD | |

---

## Superseded By (if replaced)

If this ADR has been replaced by another ADR:

- **Superseded By**: ADR-MMM
- **Date**: YYYY-MM-DD
- **Reason**: [Why was it replaced?]
- **Migration Path**: [How will the existing implementation be migrated?]

---

## Notes

- Initially written: YYYY-MM-DD
- Last updated: YYYY-MM-DD
- Version: v1.0

---

## Authoring Guide

### Checklist When Writing

- [ ] Is the Context clear? (Why was this decision needed?)
- [ ] Is the Decision concise? (What was chosen?)
- [ ] Are the Consequences concrete? (What is the impact?)
- [ ] Were the Alternatives reviewed? (What were the other options?)
- [ ] Are the Related ADRs linked? (Which related decisions?)
- [ ] Was it written in language everyone can understand?

### Writing Tips

1. **Make the Context sufficiently detailed**: The "why?" must be fully understandable
2. **Keep the Decision concise**: State the choice clearly in one or two sentences
3. **Make the Consequences concrete**: Include metrics/examples
4. **Evaluate Alternatives fairly**: Assess the options that were not chosen fairly as well
5. **Provide abundant Links**: Link the documents that serve as evidence

### Expected Writing Time

- Simple decision (technical choice): 1-2 hours
- Important decision (architecture): 2-4 hours

---

**Use this template to document technical decisions clearly and transparently.**
