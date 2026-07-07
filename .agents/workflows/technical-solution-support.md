---
description: 'A 4-step solution engineering process for integrating Mocking GUI into user projects and establishing an optimal mocking environment'
---

# Technical Solution Support

This pipeline is a strategic support process for properly integrating the Mocking GUI library into user projects and building a Mock ecosystem.

### 🛡️ Core Operational Mandates

1. **Project Isolation**: Every engagement creates exactly one folder — `agent-artifacts/solutions/{project-slug}/` — and ALL artifacts of this engagement are written inside it. Use an anonymous slug in public repositories (no client names). Storage rules are defined in [.agents/STRUCTURE.md](../STRUCTURE.md) §2.
2. **Explicit Approval Gates**: User confirmation is required before all sub-agent executions and infrastructure changes. Each step ends with a gate record in `approvals/stepN-gate.md`.

### 🚀 Engagement Initialization (before Step 1)

Create `solutions/{project-slug}/manifest.yaml` from `.agents/templates/manifest-template.yaml` (`workflow: technical-solution-support`). The `agent-artifacts/solutions/` directory is **not pre-created** — create it lazily here, on the first engagement.

All paths below are relative to `agent-artifacts/solutions/{project-slug}/`.

---

## 📊 Step 1: Deterministic Project Audit

Performs a precise diagnosis of the target project's tech stack and establishes an adoption strategy.

| Item                  | Detail                                                                          |
| :-------------------- | :------------------------------------------------------------------------------ |
| **Responsible Agent** | `solution-architect`                                                            |
| **Active Skills**     | `solution-delivery`, `harness-core`, `product-strategy`                         |
| **Reads**             | Target project codebase, framework & mocking maturity signals                   |
| **Writes**            | `audit-report.md` (diagnosis & adoption strategy) · `executions/step1-audit.md` |
| **Gate**              | `approvals/step1-gate.md` — then advance `manifest.yaml` to step 2              |

---

## ⚙️ Step 2: Adaptive Infrastructure Setup

Builds a customized Mocking GUI infrastructure based on the diagnostic results.

| Item                   | Detail                                                                                                                       |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Responsible Agents** | `solution-architect`, `frontend-engineer`                                                                                    |
| **Active Skills**      | `solution-delivery`, `browser-sw-specialist`, `browser-msw-expert`                                                           |
| **Reads**              | `audit-report.md`                                                                                                            |
| **Writes**             | `config-plan.md` (infrastructure plan) · Mocking GUI configuration files in the target project · `executions/step2-setup.md` |
| **Gate**               | `approvals/step2-gate.md` — approval required **before** performing infrastructure changes, then advance to step 3           |

---

## 🏗️ Step 3: Professional Mock Ecosystem Building

Builds a high-quality handler and scenario environment that conforms to Mocking GUI standards.

| Item                  | Detail                                                                                                |
| :-------------------- | :---------------------------------------------------------------------------------------------------- |
| **Responsible Agent** | `handler-specialist`                                                                                  |
| **Active Skills**     | `handler-specification`, `scenario-orchestration`                                                     |
| **Reads**             | `config-plan.md` · target project API specifications                                                  |
| **Writes**            | Mock data layer codebase (4-Layer separation) in the target project · `executions/step3-ecosystem.md` |
| **Gate**              | `approvals/step3-gate.md` — then advance `manifest.yaml` to step 4                                    |

---

## 📦 Step 4: Final Verification & Knowledge Delivery

Validates the integrity of the built environment and transfers maintenance skills to the user.

| Item                   | Detail                                                                                        |
| :--------------------- | :-------------------------------------------------------------------------------------------- |
| **Responsible Agents** | `solution-architect`, `testing-specialist`                                                    |
| **Active Skills**      | `quality-standard`, `technical-guardrail`, `harness-core`                                     |
| **Reads**              | Built environment · `audit-report.md` · `config-plan.md`                                      |
| **Writes**             | `final-delivery-report.md` (integrity validation & handover) · `executions/step4-delivery.md` |
| **Gate**               | `approvals/step4-gate.md` — final gate; set `manifest.yaml` `status: completed`               |
