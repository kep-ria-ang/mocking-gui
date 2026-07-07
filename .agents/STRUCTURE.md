# Agentic Directory Structure Standard

This document defines the physical layout and logical reference structure among agents, skills, workflows, and artifacts in this project. All documents must include a versioned YAML Frontmatter block at the top.

**This document is the single Source of Truth for directory structure.** If any other document (workflow, template, report) conflicts with this one, this document wins and the other must be fixed.

---

## 1. Directory Tree & Standards

```text
.agents/                              # [Source of Truth] Root directory containing actual agent specification files
├── personas/                         # [Persona Layer] Specialized persona definitions
├── rules/                            # [Policy Layer] Agent behavior guidelines and constraints
├── skills/                           # [Capability Layer] Atomic skills and knowledge bases
├── workflows/                        # [Process Layer] Execution pipelines
│   ├── harness-dev-pipeline.md       # Core development workflow
│   └── technical-solution-support.md # Adoption strategy and technical solution support workflow
├── templates/                        # [Template Layer] Immutable templates copied into artifacts
│   ├── manifest-template.yaml        #   Run state-machine template
│   ├── approval-gate-template.md     #   Phase gate record template
│   ├── run-light-template.md         #   Single-file template for light runs
│   └── adr-template.md               #   ADR authoring template
└── STRUCTURE.md                      # [Root] System structure definition (this document)

CLAUDE.md                             # [Always-On Rules] Auto-loaded at session start
└── @.agents/rules/operation-mandates.md

.claude/                              # [AI Tool Integration] All directory symbolic links
├── commands -> .agents/workflows     # Slash commands (/harness-dev-pipeline, etc.)
├── skills   -> .agents/skills        # Skill knowledge bases
└── agents   -> .agents/personas      # Personas → sub-agent definitions
```

---

## 2. Artifacts Layer (`agent-artifacts/`)

All agent outputs are stored under `agent-artifacts/`. **No file may be created directly at the root of `agent-artifacts/`** — every artifact belongs to exactly one of the locations below.

```text
agent-artifacts/
├── README.md                         # The only root-level document: how to use this directory
│                                     # (templates live in .agents/templates/ — artifacts only here)
├── workstreams/                             # [harness-dev-pipeline] One folder per execution
│   └── {YYYY-MM-DD}-{slug}/
│       ├── manifest.yaml             #   Thin state machine: current_phase, status, ADR ids (pointers only)
│       ├── spec.md                   #   Phase 1 deliverable (draft; promoted to specs/ on approval)
│       ├── approvals/                #   Gate records — the single source of truth for approvals
│       │   └── phase{1..4}-gate.md   #   (who / when / rationale / checklist, YAML frontmatter)
│       ├── executions/               #   Per-phase execution logs & interim reports
│       │   └── phase{1..4}-*.md
│       └── reports/                  #   Run-final reports (integrity-report.md, release-briefing.md)
│
├── specs/                            # [Approved spec registry — flat: being here = currently effective]
│   └── {feature}.md                  #   Living canonical spec (promoted from workstreams/, `origin_run` tagged)
│
├── decisions/                        # [Global ADR store — the ONLY place ADRs live]
│   ├── ADR-{NNNN}-{slug}.md          #   Global sequence; frontmatter tags the originating run
│   └── INDEX.md                      #   Generated list: id / title / status / run
│
└── archive/                          # Closed runs & superseded documents, grouped by {YYYY-MM}
    └── {YYYY-MM}/specs/              #   Superseded specs land here (with `superseded_by` frontmatter)
```

> `solutions/` (technical-solution-support per-client isolation) is **not pre-created** — the workflow creates `solutions/{project-slug}/` lazily on its first engagement. Until then the directory does not exist.

### 2.1. Write Rules (Dual-Write Prohibition)

- **Approvals** are recorded once, in `approvals/phaseN-gate.md`. `manifest.yaml` stores only pointer state (`current_phase`, `status`) — never duplicate approver/rationale into the manifest.
- **ADRs** are stored once, globally in `decisions/`. A run's `manifest.yaml` lists ADR ids only. ADR numbering is a single global sequence (`ADR-0001`, `ADR-0002`, …) to avoid collisions between parallel runs.
- **Specs**: the draft lives in the run (`workstreams/*/spec.md`). Upon final approval it is copied to `specs/{feature}.md` — this is NOT duplication but a snapshot/canonical split: the run copy is frozen history, the `specs/` copy is the living document. Mark the relationship in frontmatter on both sides (run copy: `status: promoted` + `promoted_to:`; active copy: `status: active` + `origin_run:`). A superseded version moves to `archive/{YYYY-MM}/specs/` with a `superseded_by` field.

### 2.2. Run Sizes (Proportionality)

- **Full run**: new features or architecture changes — full folder structure above.
- **Light run**: bug fixes and small improvements — a single `workstreams/{date}-{slug}/RUN.md` (from `.agents/templates/run-light-template.md`) containing decision, approval, and log sections. ADRs, if any, still go to the global `decisions/`.

### 2.3. Lifecycle

1. A workflow starts → create `workstreams/{date}-{slug}/` with `manifest.yaml` (status `in_progress`, phase 1).
2. Each phase **reads** the previous phase's deliverable and **writes** its own deliverables into the run folder (exact I/O contract is defined per phase in each workflow document).
3. Each phase ends with a gate file in `approvals/`; the manifest pointer advances only after `decision: approved`.
4. Run completes → manifest status `completed`; spec promoted to `specs/`.
5. **Archive sweep is event-coupled**: at the start of every new run, completed runs older than 90 days move to `archive/{YYYY-MM}/` (no standing "quarterly owner" — the next run's initialization performs the sweep). ADRs remain in `decisions/`.
6. **Freshness triggers**: Phase 1 reads `decisions/INDEX.md` (design conflicting with an accepted ADR forces a superseding ADR on the spot); the Phase 4 gate checklist verifies ADR/spec consistency and same-run updates to STRUCTURE.md/README.md when their descriptions changed.

---

## 3. AI Tool Integration Principles

**The source of truth lives only in `.agents/`. `.claude/` consists solely of directory-level symbolic links.**

| `.agents/` Source | `.claude/` Link        | AI Tool Role                   |
| ----------------- | ---------------------- | ------------------------------ |
| `rules/`          | `CLAUDE.md @reference` | Always loaded at session start |
| `workflows/`      | `commands/`            | Slash commands                 |
| `skills/`         | `skills/`              | Skill knowledge bases          |
| `personas/`       | `agents/`              | Sub-agent definitions          |

- **File edits**: Always edit only the `.agents/` source files.
- **Adding new files**: Creating a file under `.agents/<layer>/` is automatically reflected (no need to add a link manually).

---

## 4. Standard Specifications

### 4.1. Common Frontmatter Specification

All `.md` documents must include the following block at the top.

```yaml
---
version: 1.0.0
name: 'Document name'
description: 'Purpose and summary of the document'
---
```

### 4.2. Persona Documents (`personas/*.md`)

- **Identity & Expertise**: Defines the agent's role and level of expertise.
- **Responsibility Scope**: Specifies the concrete scope of responsibilities.
- **Active Skill Mapping**: Links Primary and Supporting Skills in use.
- **Operational Workflow**: Defines inputs, outputs, and the reasoning process.
- **Engineering Standards & Mandates**: Core values and technical guidelines.

### 4.3. Workflow Documents (`workflows/*.md`)

- **Phase Definition**: Specifies the tasks performed at each phase and the responsible agent.
- **Phase I/O Contract**: Every phase MUST declare `Reads` (input artifacts) and `Writes` (output artifacts) as concrete paths under `agent-artifacts/`.
- **Approval Gates**: Specifies the points requiring user approval and the gate file to be generated.

### 4.4. Skill Documents (`skills/*/SKILL.md`)

- **Core Competencies**: Description of key capabilities.
- **Reference**: Links to detailed specifications under the `reference/` subdirectory.
