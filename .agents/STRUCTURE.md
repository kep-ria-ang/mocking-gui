# Agentic Directory Structure Standard

This document defines the physical layout and logical reference structure among agents, skills, and workflows in this project. All documents must include a versioned YAML Frontmatter block at the top.

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
└── STRUCTURE.md                      # [Root] System structure definition (this document)

CLAUDE.md                             # [Always-On Rules] Auto-loaded at session start
└── @.agents/rules/operation-mandates.md

.claude/                              # [AI Tool Integration] All directory symbolic links
├── commands -> .agents/workflows     # Slash commands (/harness-dev-pipeline, etc.)
├── skills   -> .agents/skills        # Skill knowledge bases
└── agents   -> .agents/personas      # Personas → sub-agent definitions

agent-artifacts/                      # [Artifacts Layer] Isolated storage for agent outputs
├── reports/                          # Final validation and integrity reports
│   └── executions/                   # Step-by-step decision logs and interim reports
└── spec/                             # Planning specifications and architecture design documents
```

---

## 2. AI Tool Integration Principles

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

## 3. Standard Specifications

### 3.1. Common Frontmatter Specification

All `.md` documents must include the following block at the top.

```yaml
---
version: 1.0.0
name: 'Document name'
description: 'Purpose and summary of the document'
---
```

### 3.2. Persona Documents (`personas/*.md`)

- **Identity & Expertise**: Defines the agent's role and level of expertise.
- **Responsibility Scope**: Specifies the concrete scope of responsibilities.
- **Active Skill Mapping**: Links Primary and Supporting Skills in use.
- **Operational Workflow**: Defines inputs, outputs, and the reasoning process.
- **Engineering Standards & Mandates**: Core values and technical guidelines.

### 3.3. Workflow Documents (`workflows/*.md`)

- **Phase Definition**: Specifies the tasks performed at each phase and the responsible agent.
- **Approval Gates**: Specifies the points requiring user approval and the reports to be generated.

### 3.4. Skill Documents (`skills/*/SKILL.md`)

- **Core Competencies**: Description of key capabilities.
- **Reference**: Links to detailed specifications under the `reference/` subdirectory.
