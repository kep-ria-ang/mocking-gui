# Agent Artifacts Repository

Isolated storage for agent artifacts. **The source of truth for structural rules is [`.agents/STRUCTURE.md`](../.agents/STRUCTURE.md) §2**; this README is a guidance summary. Do not create new files at the root — every artifact is placed in exactly one of the locations below.

## 📖 Glossary

| Term | Meaning |
| :--- | :--- |
| **run** | A single execution unit of a workflow. Its storage folder is `workstreams/{YYYY-MM-DD}-{slug}/` — the folder is named workstreams, while the execution concept is a run (1:1 correspondence) |
| **full run** | A run at the scale of a new feature or architectural change — uses the full folder structure (manifest/spec/approvals/executions/reports) |
| **light run** | A bugfix or small improvement — an abbreviated mode that consolidates decisions, approvals, and logs into a **single `RUN.md` file** |
| **spec.md** (within a run) | A **snapshot** of the design at the time that run was approved (immutable history, `status: promoted`) |
| **specs/** | The **canonical copy** of currently valid specs (revisions and supersessions happen only here; trace provenance via `origin_run`) |
| **gate** | A phase-transition approval record (`approvals/phaseN-gate.md`) — the sole source of truth for approvals |
| **ADR** | An architecture-level decision record. Exists only in the global `decisions/`; superseded rather than modified |

## 📁 Structure

```
agent-artifacts/
├── workstreams/   # Isolated harness-dev-pipeline execution units: {YYYY-MM-DD}-{slug}/
├── specs/         # Canonical copy of currently valid specs (flat structure — present here = valid)
├── decisions/     # Global ADR store (ADRs exist only here, global sequence ADR-NNNN)
└── archive/       # Closed runs, superseded specs ({YYYY-MM}/specs/), and old document versions (by {YYYY-MM})

# solutions/ is not created in advance — it is created at the first technical-solution-support engagement
```

## 🔑 Placement Rules (Summary)

1. **One workflow execution = one run folder.** At the start, generate `manifest.yaml` from `.agents/templates/manifest-template.yaml`, and each Phase places artifacts only inside the run folder according to the I/O contract (Reads/Writes) defined in the workflow document.
2. **The source of truth for approvals is `approvals/phaseN-gate.md`.** The manifest records only status pointers (`current_phase`, `status`) (no duplicate recording).
3. **ADRs live only in the global `decisions/`.** A run references them via the `run_id` tag in frontmatter plus the ID list in the manifest.
4. **Proportionality**: Small fixes use a light run — a single `workstreams/{date}-{slug}/RUN.md` file (`.agents/templates/run-light-template.md`).
5. **Spec promotion**: On run-completion approval, `spec.md` → `specs/`, and the superseded version goes to `archive/{YYYY-MM}/specs/`.
6. **Templates are not here.** The source of truth for the manifest, gate, light-run, and ADR templates is `.agents/templates/` — this directory holds artifacts only.

## 🔄 Phase I/O by Workflow

- Feature development: [.agents/workflows/harness-dev-pipeline.md](../.agents/workflows/harness-dev-pipeline.md) — Phase 1 (Design) → 2 (Implementation) → 3 (Validation) → 4 (Documentation)
- Adoption support: [.agents/workflows/technical-solution-support.md](../.agents/workflows/technical-solution-support.md) — Step 1 (Diagnosis) → 2 (Infrastructure) → 3 (Ecosystem) → 4 (Delivery)

## 📜 History

- `workstreams/2026-07-01-ssr-state-sync/`: After migrating from the pre-v5 (`projects/`) structure, the artifacts were rewritten on 2026-07-03 based on the harness-dev-pipeline I/O contract — one execution log per phase (`executions/phase{1..4}-*.md`), `reports/` containing `integrity-report.md` + `release-briefing.md`, and four key decisions promoted to `decisions/ADR-0001~0004`. Since there was no approval record at the time, there is no `approvals/` (do not create one retroactively).
- Past one-off analysis reports are preserved in `archive/2026-07/`. The structure-redesign process documents and the old-generation (5-phase) templates were reflected in the final spec and deleted on 2026-07-03 (rationale is in the git history).
