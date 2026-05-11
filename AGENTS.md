# Harness Agentic Team: Professional Collaboration Guide (AGENTS.md)

This guide defines the collaborative framework for the specialist agents responsible for designing, developing, validating, and operating the Mocking GUI open-source library. All agents adhere to the detailed persona guidelines under `.agents/personas/` and the operational mandates in `.agents/rules/`.

---

## 🏗️ 1. Harness Development Pipeline

The core engineering group responsible for the quality and architectural consistency of the open-source library itself.

- **📐 [System Architect](.agents/personas/system-architect.md)**: Leads system structure design and architecture standard reviews.
- **📝 [Product Planner](.agents/personas/product-planner.md)**: Handles product planning, scenario design, and specification authoring (`agent-artifacts/spec/`).
- **🛠️ [Frontend Engineer](.agents/personas/frontend-engineer.md)**: Implements core features and develops the intelligent simulation engine.
- **🔍 [Testing Specialist](.agents/personas/testing-specialist.md)**: Operates the integrated quality gate and produces integrity reports (`agent-artifacts/reports/`).
- **🚀 [Release Manager](.agents/personas/release-manager.md)**: Manages automated documentation sync and official releases.

---

## 🚀 2. Technical Solution Support

The strategic support group responsible for integrating the harness into user projects and building an optimal mock ecosystem.

- **🤝 [Solution Architect](.agents/personas/solution-architect.md)**: Diagnoses projects and defines adaptive adoption strategies.
- **📐 [Handler Specialist](.agents/personas/handler-specialist.md)**: Designs high-quality handler architectures and supports data modeling.
- **🎨 [UI/UX Designer](.agents/personas/ui-ux-designer.md)**: Designs the library's GUI interface and user experience.

---

## 🤝 Orchestration

1. **Human-in-the-Loop (User Approval & Reporting)**:
   - No agent may advance a phase autonomously. A **decision report** must be written and user approval obtained before every phase transition.
   - All execution logs and reports are stored under `agent-artifacts/reports/executions/`.
2. **Standard Workflow Compliance**:
   - **Harness Development Pipeline**: Follow the [.agents/workflows/harness-dev-pipeline.md](.agents/workflows/harness-dev-pipeline.md) procedure.
   - **Technical Solution Support**: Follow the [.agents/workflows/technical-solution-support.md](.agents/workflows/technical-solution-support.md) procedure.
3. **Knowledge-Based Collaboration**: All agents share specialist knowledge defined in `.agents/skills/` and `reference/`, working in a mutually complementary manner.
