---
version: 1.0.0
name: 'Light Run Template'
type: template
description: 'Single-file run record for bug fixes and small improvements (STRUCTURE.md §2.2)'
run_id: { YYYY-MM-DD }-{slug}
workflow: harness-dev-pipeline
size: light
status: in_progress # in_progress | awaiting_approval | completed
created_by: user@organization.com
---

# RUN: [Task Title]

## 1. Background & Scope

- What is being fixed and why (include issue link)

## 2. Decisions

- Record key choices and their rationale as bullets.
- When an architecture-level decision arises, promote it to `agent-artifacts/decisions/ADR-*.md` and leave only the ID here.

## 3. Execution Log

- Changed files / summary of key diffs

## 4. Validation

- Lint / Test / Build results

## 5. Approval

| Item      | Value                                   |
| --------- | --------------------------------------- |
| Decision  | approved / rejected / changes_requested |
| Approver  | user@organization.com                   |
| Time      | YYYY-MM-DDTHH:mm:ss+09:00               |
| Rationale | (one or two sentences)                  |
