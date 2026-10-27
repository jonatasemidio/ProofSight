---
name: po-frontend-design-system
description: >-
  Cross-functional collaboration between Senior PO and Senior Frontend UI/UX Expert
  to create and maintain the project's Design System, tokens, micro-interactions,
  and accessible component specifications.
---

# PO & Senior Frontend UI/UX Design System Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It operationalizes a collaborative union of a **Senior Product Owner (PO)** and a **Senior Frontend UI/UX Architect** across any project by consuming the project's design tokens (e.g. `design-system/tokens/tokens.json`) and project ontology (`docs/ontology.md`).

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Design System Principles** | **Generic** | Token taxonomy (Global, Semantic, Component), WCAG 2.1 AA/AAA accessibility, 6-state component completeness, zero layout shift (CLS). |
| **PO Review Protocol** | **Generic** | Anti-dark pattern validation, transparent pricing/terms, consent flows, responsive ergonomics. |
| **Token Definitions** | **Project-Specific** | Located at path specified in `project.config.json` (e.g. `design-system/tokens/tokens.json`). |
| **Domain Component Scenarios**| **Project-Specific** | Mapped to the project's specific user stories and user journeys. |

---

## 2. Execution Protocol

### Step 1: Discover Project Design Tokens & Specs
1. Read `project.config.json` -> Locate `designSystem.tokensFile` and `designSystem.componentSpecsFile`.
2. If tokens do not exist, scaffold a standard 3-tier Design Token architecture (`global`, `semantic`, `component`).

### Step 2: Enforce Component State Completeness
Every UI component crafted or refined MUST define and handle all 6 standard states:
1. **Default / Resting State**
2. **Hover / Focus State**
3. **Active / Pressed State**
4. **Disabled State**
5. **Loading / Skeleton State**
6. **Error / Fallback State**

### Step 3: Trigger Affirmation Synchronization
Immediately link the UI deliverables to the Affirmation Matrix:
```bash
node scripts/affirmation-tracer.mjs update-status <AFM-ID> IN_PROGRESS <ComponentSpecPath>
```
