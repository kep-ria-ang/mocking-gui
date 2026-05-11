---
version: 1.0.0
description: 'Orchestration competency for designing and managing complex business situations and flows beyond single API responses'
name: scenario-orchestration
---

# Skill: Mocking GUI Scenario Manager (Flow Orchestration)

Competency for managing multiple handler states combined into a single business situation (e.g., payment failure, VPC creation in progress) within the Mocking GUI library.

## 1. Core Competencies

- **State Atomicity**: Scenario design that groups individual handler states together and manages them atomically.
- **Flow Simulation**: Complex situation simulation using delay + response variant manipulation.
- **Draft Workflow**: Click the handler ⊕ button in the API tab to build a draft → save in the Scenario tab.
- **Sharing**: Clipboard sharing via Base64 `encodeScenario` / `decodeScenario` + `importScenario` on the receiving end.

## 2. Reference & Detailed Specs

- **Scenario Schema**: [Mocking GUI Scenario Data Schema and Storage Standard](./reference/scenario-schema.md)
- **Flow Orchestration**: [Complex Business Flow Design Guide](./reference/flow-orchestration.md)

## 3. Decision Tree / Standard Workflow

- **Q1. Complex business situation (e.g., error during specific resource creation)?** -> **Action**: Add the relevant handlers to the draft in the API tab → specify a name in the Scenario tab and save.
- **Q2. Is latency the key factor in the scenario?** -> **Action**: Configure `delay` on the handler, then add it to the draft to construct a timeout situation.
- **Q3. Scenario sharing is required?** -> **Action**: Click the Share button → `encodeScenario()` copies the Base64 string to the clipboard. Recipients paste it using the Import button.
- **Q4. Want to modify an applied scenario?** -> **Action**: The current scenario supports only ACTIVE/INACTIVE binary states. It is recommended to save as a new scenario after modifications.
- **Q5. Want to deactivate a scenario?** -> **Action**: `deactivateScenario()` → all handlers reset to their initial default values.

## 4. Engineering Constraints & Mandates

- "Scenarios must always guarantee a 'reproducible state'."
- "Scenario names must intuitively express business requirements (e.g., 'Payment Failure due to Insufficient Funds')."
- "When applying a scenario, maintain atomicity so that it does not conflict with the currently active handler states."
