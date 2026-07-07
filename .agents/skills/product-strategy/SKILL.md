---
version: 1.0.0
description: 'Product planning expertise for designing core features and establishing product strategy for the Mocking GUI library'
name: product-strategy
---

# Skill: Mocking GUI Product Strategy (Library Planning)

Expert competency for defining the essential value of the Mocking GUI library, bridging technical architecture with user requirements, and establishing actionable specifications.

## 1. Core Competencies

- **Strategic Feasibility Analysis**: Diagnosing the feasibility of requirements from the Mocking GUI architecture perspective.
- **Feature Specification**: Translating user needs into library interface specifications such as `harness.config.ts`.
- **DX Architecture Planning**: Designing library configuration and workflows that prioritize developer experience above all else.

## 2. Reference & Detailed Specs

- **Strategic Analysis**: [Strategic Impact and Scalability Analysis Guide](./reference/strategic-analysis.md)
- **Feature Specification**: [Mocking GUI Library Feature Specification Standard](./reference/feature-spec.md)
- **DX Standards**: [Library-Level DX Design Standard](./reference/dx-standards.md)

## 3. Decision Tree / Standard Workflow

- **Q1. Does the feature requested by the user align with Mocking GUI's core value (Simplicity)?** -> **Action**: If aligned, integrate into the standard spec; for special cases, plan as a plugin.
- **Q2. Is the API interface of the new feature consistent with existing conventions?** -> **Action**: Cross-reference with the existing naming convention and configuration structure to ensure consistency.
- **Q3. Does the technical constraint require revising the plan?** -> **Action**: Collaborate with the architect to derive an alternative that satisfies both technical elegance and usability.

## 4. Engineering Constraints & Mandates

- "All specifications are grounded in the Mocking GUI's architectural layering and technical foundation (Browser & MSW)."
- "Design with type safety and runtime performance in mind from the planning stage."
- "Focus on translating the user's 'What' into Mocking GUI's 'How'."
