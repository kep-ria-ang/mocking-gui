# Mocking GUI Technical & Functional Validation Checklist

A mandatory inspection list that must be confirmed before release after completing feature implementation for the Mocking GUI library.

## 1. Functional Integrity

- [ ] **Existing Spec Compliance**: Does the new development not break existing core features (handler matching, scenario switching, etc.)?
- [ ] **Requirement Fulfillment**: Does it 100% satisfy the specifications defined by `product-strategy`?
- [ ] **Edge Case Behavior**: Are the planned error scenarios (401, 500, etc.) and delays triggered correctly?
- [ ] **GUI Synchronization**: Are panel operations immediately reflected in the actual network interception results?

## 2. Technical Stability

- [ ] **Browser Stack Integrity**: Is the Service Worker lifecycle functioning without issues, and is it stably registered even after a refresh?
- [ ] **SSR/RSC Synchronization**: Is the mocking state maintained identically on the server side via the cookie bridge?
- [ ] **Memory & Performance**: Are there no browser frame drops or memory leaks when a large number of handlers are registered?
- [ ] **Security Context**: Does it operate normally without security warnings in HTTPS/localhost environments, and does it not conflict with CSP policies?

## 3. Architecture & Pattern Compliance

### 3.1. Library Core Development

- [ ] **Internal Layering**: Has the internal module layering of `store`, `utils/handler`, `components`, etc. defined in `harness-core` been followed?
- [ ] **Module Boundaries**: Is the coupling between internal modules low, and are they exposed through defined entry points (`browser.ts`, `server.ts`)?

### 3.2. Mocking Implementation

- [ ] **4-Layer Separation**: Have all handlers followed the Handlers, Constants, Factories, Utils layer separation principle according to `handler-specification`?
- [ ] **Naming Convention**: Does the file and directory naming follow domain-centric kebab-case?

### 3.3. Common Standards

- [ ] **Type Safety**: Has use of `any` type been excluded and defined common interfaces used?
- [ ] **Style Isolation**: Do styles inside the Shadow DOM not interfere with the external application's CSS?

## 4. Documentation & Example Consistency

- [ ] **Official Docs**: Do the guides and API specs under `docs/` reflect the new changes?
- [ ] **Agent Instruction**: Are the agent persona and workflow documents under `.agents/` aligned with the latest architecture?
- [ ] **Example Runnability**: Do the example code files under `examples/*` build and run without errors using the latest core library?
- [ ] **Consistency**: Is the implementation approach of code snippets in the documentation the same as in the actual example code?
