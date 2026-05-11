---
description: 'A 4-step solution engineering process for integrating Mocking GUI into user projects and establishing an optimal mocking environment'
---

# Technical Solution Support

This pipeline is a strategic support process for properly integrating the Mocking GUI library into user projects and building a Mock ecosystem.

### 🛡️ Core Operational Mandates

1. **Mandatory Decision Reports**: At every phase transition, a report containing the analysis results and execution strategy must be created in `agent-artifacts/reports/executions/` and user approval must be obtained.
2. **Explicit Approval Gates**: User confirmation is required before all sub-agent executions and infrastructure changes.

---

## 📊 Step 1: Deterministic Project Audit

Performs a precise diagnosis of the target project's tech stack and establishes an adoption strategy.

| Item                  | Detail                                              | Reference Skills (Skills)                                                |
| :-------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------- |
| **Responsible Agent** | `solution-architect`                                | `../skills/solution-delivery/SKILL.md`                                   |
| **Active Knowledge**  | Framework compatibility, mocking maturity diagnosis | `../skills/harness-core/SKILL.md`, `../skills/product-strategy/SKILL.md` |
| **Final Deliverable** | **`agent-artifacts/reports/audit-report.md`**       | -                                                                        |

> **[Gatekeeper Requirement]**: Write the project diagnostic results report to `agent-artifacts/reports/executions/` and obtain user approval.

---

## ⚙️ Step 2: Adaptive Infrastructure Setup

Builds a customized Mocking GUI infrastructure based on the diagnostic results.

| Item                   | Detail                                             | Reference Skills (Skills)                                                           |
| :--------------------- | :------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **Responsible Agents** | `solution-architect`, `frontend-engineer`          | `../skills/solution-delivery/SKILL.md`                                              |
| **Active Knowledge**   | SW integration, Cookie Sync, Config initialization | `../skills/browser-sw-specialist/SKILL.md`, `../skills/browser-msw-expert/SKILL.md` |
| **Final Deliverable**  | **Mocking GUI Configuration Files**                | -                                                                                   |

> **[Gatekeeper Requirement]**: Report the infrastructure setup plan and obtain approval before performing the work.

---

## 🏗️ Step 3: Professional Mock Ecosystem Building

Builds a high-quality handler and scenario environment that conforms to Mocking GUI standards.

| Item                  | Detail                                                | Reference Skills (Skills)                                                               |
| :-------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Active Knowledge**  | 4-Layer separation, data integrity, scenario planning | `../skills/handler-specification/SKILL.md`, `../skills/scenario-orchestration/SKILL.md` |
| **Final Deliverable** | **Mock Data Layer Codebase**                          | -                                                                                       |

---

## 📦 Step 4: Final Verification & Knowledge Delivery

Validates the integrity of the built environment and transfers maintenance skills to the user.

| Item                   | Detail                                                 | Reference Skills (Skills)                                                   |
| :--------------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Responsible Agents** | `solution-architect`, `testing-specialist`             | `../skills/quality-standard/SKILL.md`                                       |
| **Active Knowledge**   | Integrity checklist, technical guardrail validation    | `../skills/technical-guardrail/SKILL.md`, `../skills/harness-core/SKILL.md` |
| **Final Deliverable**  | **`agent-artifacts/reports/final-delivery-report.md`** | -                                                                           |
