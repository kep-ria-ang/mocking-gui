---
description: 'A strategic 4-phase specialized pipeline for developing and enhancing new features in the Mocking GUI library'
---

# Harness Development Pipeline

This pipeline is a 4-phase specialized process optimized for developing and enhancing new features in the Mocking GUI library. The following **core operational mandates** are enforced to prevent main context overflow and ensure efficient process control.

### 🛡️ Core Operational Mandates

1. **Sub-agent Delegation**: The main agent focuses on the orchestrator role. Detailed tasks within each phase — including implementation, testing, and documentation — must be delegated to the appropriate sub-agent via `invoke_agent`.
2. **Explicit Approval Gates**: At the end of each phase, a summary of deliverables must be reported and **explicit approval from the user to proceed to the next phase** must be obtained. Automatically advancing to the next phase without approval is prohibited.
3. **Mandatory Decision Reports**: At every phase transition, a report containing the analysis performed in that phase and the strategy for the next phase must be created in the `agent-artifacts/reports/executions/` folder.
4. **Context Optimization**: Sub-agent outputs must be returned to the main session as a summarized form, optimizing token usage by not loading the entire codebase into the main session.

---

## 🏗️ Phase 1: Strategic Architecture & Design

Performs planning and technical feasibility validation for new or improved features.

| Item                   | Detail                                                                             | Reference Files (Refers)                                                          |
| :--------------------- | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Responsible Agents** | `product-planner`, `system-architect`                                              | `../personas/product-planner.md`, `../personas/system-architect.md`               |
| **Active Skills**      | `product-strategy`, `handler-specification`                                        | `../skills/product-strategy/SKILL.md`, `../skills/handler-specification/SKILL.md` |
| **Input**              | User requirements, issue reports                                                   | -                                                                                 |
| **Outcomes**           | UI/UX validation, business logic design, tech stack feasibility confirmation       | -                                                                                 |
| **Final Deliverable**  | **`agent-artifacts/spec/[feature]-spec.md`** (planning and architecture agreement) | -                                                                                 |

> **[Gatekeeper Requirement]**: Write a report containing the Phase 1 analysis results and strategy to `agent-artifacts/reports/executions/`, obtain user approval, then delegate Phase 2 to `frontend-engineer` via `invoke_agent`.

---

## 🛠️ Phase 2: Engineer Collaboration & Implementation

Carries out actual implementation and refactoring based on the design.

| Item                   | Detail                                                                                       | Reference Files (Refers)                                                            |
| :--------------------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **Responsible Agents** | `frontend-engineer`, `system-architect`                                                      | `../personas/frontend-engineer.md`, `../personas/system-architect.md`               |
| **Active Skills**      | `browser-msw-expert`, `browser-sw-specialist`                                                | `../skills/browser-msw-expert/SKILL.md`, `../skills/browser-sw-specialist/SKILL.md` |
| **Input**              | `agent-artifacts/spec/[feature]-spec.md`                                                     | -                                                                                   |
| **Outcomes**           | Development strategy derivation, refactoring and clean code authoring, type safety assurance | -                                                                                   |
| **Final Deliverable**  | **Pull Request Code Changes** in `packages/mogu`                                             | -                                                                                   |

> **[Gatekeeper Requirement]**: Write a report on the key changes and implementation strategy to `agent-artifacts/reports/executions/`, obtain user approval, then delegate Phase 3 to `testing-specialist` via `invoke_agent`.

---

## 🔍 Phase 3: Integrated Integrity Verification

Executes the code quality assurance and automated verification pipeline.

| Item                   | Detail                                                                                          | Reference Files (Refers)                                                 |
| :--------------------- | :---------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Responsible Agents** | `testing-specialist`                                                                            | `../personas/testing-specialist.md`                                      |
| **Active Skills**      | `quality-standard`, `harness-core`                                                              | `../skills/quality-standard/SKILL.md`, `../skills/harness-core/SKILL.md` |
| **Input**              | Implemented source code, `agent-artifacts/spec/[feature]-spec.md`                               | -                                                                        |
| **Outcomes**           | Lint/Vitest/Build gate execution, core feature checklist validation                             | -                                                                        |
| **Final Deliverable**  | **`agent-artifacts/reports/integrity-report.md`** (integrity and performance diagnostic report) | -                                                                        |

> **[Gatekeeper Requirement]**: Present the integrity verification report, obtain user approval, then delegate Phase 4 to `release-manager` via `invoke_agent`.

---

## 🚀 Phase 4: Documentation & Knowledge Sync

Ensures the knowledge base is up to date and prepares the user briefing.

| Item                   | Detail                                                                | Reference Files (Refers)                                            |
| :--------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Responsible Agents** | `release-manager`, `system-architect`                                 | `../personas/release-manager.md`, `../personas/system-architect.md` |
| **Active Skills**      | `harness-core`                                                        | `../skills/harness-core/SKILL.md`                                   |
| **Input**              | `agent-artifacts/reports/integrity-report.md`, changed API interfaces | -                                                                   |
| **Outcomes**           | Agent MD, Docs, and architecture guide synchronization check          | -                                                                   |
| **Final Deliverable**  | **Release Briefing Note** (for delivery to the user)                  | -                                                                   |

---

## 🧠 Parallelism & Context Management

1. **Parallel Execution**: Phase 3 (verification) and Phase 4 (documentation preparation) can be partially executed in parallel; final documentation approval is determined based on the verification results.
2. **Context Optimization**: Each phase loads only the **final deliverable (md file)** from the previous phase as its primary context, preventing context overflow caused by unnecessarily reading the entire codebase.
