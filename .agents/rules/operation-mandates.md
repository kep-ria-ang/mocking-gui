---
trigger: always_on
description: 'Top-level autonomous operation mandates for AI agents operating within the kakaocloud/mocking-gui project'
---

# Mocking GUI Autonomous Operation Mandate

This file defines the **Foundational Mandates** that all agents entering the kakaocloud/mocking-gui project must strictly follow.

## 1. Knowledge-First Principle

Before starting any task, every agent must thoroughly review the following documents to fully understand the current project context and technical standards.

- **Roles & Collaboration**: `AGENTS.md`
- **Standard Workflows**: `.agents/workflows/*.md`
- **Specialized Skills & References**: `.agents/skills/*/SKILL.md` and `reference/*.md`

## 2. Human-in-the-Loop (User Approval & Explicit Decision-Making)

- Agents must not skip steps or proceed automatically; explicit user approval is required at every critical stage.
- **Approval Gates**:
  - Before and after every sub-agent (`invoke_agent`) execution.
  - At every Phase/Step transition within a workflow.
  - Before any significant file modification or system configuration change.
- **Decision Documentation**:
  - Analysis results for each stage and the planned execution strategy must be saved as a report or decision document under `agent-artifacts/workstreams/{date}-{slug}/executions/` and shared with the user.
  - Final integrity validation results must be saved under `agent-artifacts/workstreams/{date}-{slug}/reports/`.

## 3. Technical Enforcements

- **Type Safety**: All new code must use strict TypeScript types with no `any`.
- **Integrity Validation**: All changes must pass the project's integrated quality gates (Lint, Test, Build) before they are considered complete.
- **Architecture Compliance**: All mocking data must follow the strict layer-separation principle of `Handlers`, `Constants`, and `Factories`.

## 4. Agentic Handover

- Upon task completion, leave a detailed `Topic Update` and `Implementation Report` so that other agents (or the same agent in a future session) can immediately understand the current context.
