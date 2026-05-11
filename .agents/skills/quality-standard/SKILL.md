---
version: 1.0.0
description: 'Quality assurance competency for rigorously validating specification conformance and technical standard compliance of implemented features'
name: quality-standard
---

# Skill: Mocking GUI Validation Standard (Quality Assurance)

Expert competency for ensuring the reliability of the library by rigorously verifying that implemented features comply with Mocking GUI's technical and planning standards.

## 1. Core Competencies

- **Specification Alignment**: Identifying gaps between planning specifications and actual behavior, and validating conformance.
- **Technical Integrity Audit**: Diagnosing the health of low-level browser operations (SW, Cookie Sync).
- **Regression Analysis**: Determining whether new features have broken existing core functionality.
- **Structured Reporting**: Clearly reporting discovered defects together with their technical root causes.

## 2. Reference & Detailed Specs

- **Validation Checklist**: [Functional/Technical/Standard Precision Inspection Items](./references/validation-checklist.md)
- **Report Template**: [Standard Validation Results Report Template](./references/report-template.md)

## 3. Decision Tree / Standard Workflow

- **Q1. Does the new feature affect existing API responses?** -> **Action**: Run backward compatibility tests and write a regression report.
- **Q2. Type errors occur during the build process?** -> **Action**: Check `package.json` dependencies and workspace links, then request fixes.
- **Q3. Is the validation environment limited to local only?** -> **Action**: Perform cross-validation across various project environments (Vite, Next.js) within `examples/`.

## 4. Engineering Constraints & Mandates

- "Validation must always include testing in an actual browser environment."
- "During performance validation, simulate a high-load scenario with more than 100 registered handlers."
- "Defect reports must always include a reproduction path."
