---
description: 'A strategic 4-phase specialized pipeline for developing and enhancing new features in the Mocking GUI library'
---

# Harness Development Pipeline

This pipeline is a 4-phase specialized process optimized for developing and enhancing new features in the Mocking GUI library. The following **core operational mandates** are enforced to prevent main context overflow and ensure efficient process control.

### 🛡️ Core Operational Mandates

1. **Sub-agent Delegation**: The main agent focuses on the orchestrator role. Detailed tasks within each phase — including implementation, testing, and documentation — must be delegated to the appropriate persona sub-agent via the Agent tool (subagent_type = persona name).
2. **Explicit Approval Gates**: At the end of each phase, a summary of deliverables must be reported and **explicit approval from the user to proceed to the next phase** must be obtained. Automatically advancing to the next phase without approval is prohibited.
3. **Run Isolation**: Every execution of this pipeline creates exactly one run folder — `agent-artifacts/workstreams/{YYYY-MM-DD}-{slug}/` — and ALL artifacts of this execution are written inside it. Storage rules are defined in [.agents/STRUCTURE.md](../STRUCTURE.md) §2.
4. **Context Optimization**: Each phase loads only the previous phase's final deliverable (per the I/O contract below) as its primary context. Sub-agent outputs must be returned to the main session in summarized form.

### 🚀 Run Initialization (before Phase 1)

| Action     | Detail                                                                                              |
| :--------- | :--------------------------------------------------------------------------------------------------- |
| **Create** | `workstreams/{date}-{slug}/manifest.yaml` from `.agents/templates/manifest-template.yaml`          |
| **Decide** | Run size: **full run** (new feature / architecture change) vs **light run** (single `RUN.md`, see STRUCTURE.md §2.2) |

All paths below are relative to `agent-artifacts/workstreams/{date}-{slug}/` unless prefixed with `agent-artifacts/`.

---

## 🏗️ Phase 1: Strategic Architecture & Design

Performs planning and technical feasibility validation for new or improved features.

| Item                   | Detail                                                                        |
| :--------------------- | :----------------------------------------------------------------------------- |
| **Responsible Agents** | `product-planner`, `system-architect`                                          |
| **Active Skills**      | `product-strategy`, `handler-specification`                                    |
| **Reads**              | User requirements, issue reports, `agent-artifacts/specs/` (related existing specs), `agent-artifacts/decisions/INDEX.md` (existing accepted ADRs — if the new design conflicts with one, a superseding ADR MUST be written in this phase) |
| **Writes**             | `spec.md` (draft planning & architecture agreement) · `executions/phase1-analysis.md` (analysis log) · `agent-artifacts/decisions/ADR-*.md` (one per key technical decision, ids listed in `manifest.yaml`) |
| **Gate**               | `approvals/phase1-gate.md` — then advance `manifest.yaml` to phase 2           |

> **[Gatekeeper Requirement]**: Report the Phase 1 analysis summary, obtain user approval recorded in `approvals/phase1-gate.md`, then delegate Phase 2 to the `frontend-engineer` persona via the Agent tool.

---

## 🛠️ Phase 2: Engineer Collaboration & Implementation

Carries out actual implementation and refactoring based on the design.

| Item                   | Detail                                                                        |
| :--------------------- | :----------------------------------------------------------------------------- |
| **Responsible Agents** | `frontend-engineer`, `system-architect`                                        |
| **Active Skills**      | `browser-msw-expert`, `browser-sw-specialist`                                  |
| **Reads**              | `spec.md` · ADRs listed in `manifest.yaml`                                     |
| **Writes**             | Pull Request code changes in `packages/mocking-gui` · `executions/phase2-implementation.md` (key changes & implementation strategy) · new `agent-artifacts/decisions/ADR-*.md` for decisions made during implementation |
| **Gate**               | `approvals/phase2-gate.md` — then advance `manifest.yaml` to phase 3           |

> **[Gatekeeper Requirement]**: Report the implementation summary, obtain user approval recorded in `approvals/phase2-gate.md`, then delegate Phase 3 to the `testing-specialist` persona via the Agent tool.

---

## 🔍 Phase 3: Integrated Integrity Verification

Executes the code quality assurance and automated verification pipeline.

| Item                   | Detail                                                                        |
| :--------------------- | :----------------------------------------------------------------------------- |
| **Responsible Agents** | `testing-specialist`                                                           |
| **Active Skills**      | `quality-standard`, `harness-core`                                             |
| **Reads**              | Implemented source code · `spec.md`                                            |
| **Writes**             | `reports/integrity-report.md` (Lint/Vitest/Build gate results, checklist validation) · `executions/phase3-verification.md` |
| **Gate**               | `approvals/phase3-gate.md` — then advance `manifest.yaml` to phase 4           |

> **[Gatekeeper Requirement]**: Present the integrity verification report, obtain user approval recorded in `approvals/phase3-gate.md`, then delegate Phase 4 to the `release-manager` persona via the Agent tool.

---

## 🚀 Phase 4: Documentation & Knowledge Sync

Ensures the knowledge base is up to date and prepares the user briefing.

| Item                   | Detail                                                                        |
| :--------------------- | :----------------------------------------------------------------------------- |
| **Responsible Agents** | `release-manager`, `system-architect`                                          |
| **Active Skills**      | `harness-core`                                                                 |
| **Reads**              | `reports/integrity-report.md` · changed API interfaces                         |
| **Writes**             | `reports/release-briefing.md` (release briefing for the user) · Docs / agent MD sync · `executions/phase4-documentation.md` |
| **Gate**               | `approvals/phase4-gate.md` — final gate. Checklist MUST include two freshness checks: ① Does this change conflict with any `accepted` ADR or active spec? → write the superseding ADR / archive the spec now, in this run. ② Does this change alter what `STRUCTURE.md` / `README.md` describe? → update them in this run (a stale map is worse than none). |

### 🏁 Run Closure (after Phase 4 approval)

1. Set `manifest.yaml` `status: completed`.
2. Promote `spec.md` → `agent-artifacts/specs/{feature}.md`. Mark both sides: run copy gets `status: promoted` + `promoted_to:`, active copy gets `status: active` + `origin_run:` (move a superseded version to `archive/{YYYY-MM}/specs/` with `superseded_by` frontmatter).
3. **Archive sweep (event-coupled, no standing owner)**: at the start of every new run, move any completed run older than 90 days to `agent-artifacts/archive/{YYYY-MM}/`. ADRs always remain in `agent-artifacts/decisions/`.

---

## 🧠 Parallelism & Context Management

1. **Parallel Execution**: Phase 3 (verification) and Phase 4 (documentation preparation) can be partially executed in parallel; final documentation approval is determined based on the verification results.
2. **Context Optimization**: Each phase loads only the artifacts declared in its **Reads** row, preventing context overflow caused by unnecessarily reading the entire codebase.
