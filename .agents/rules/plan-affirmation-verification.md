---
description: Mandatory plan affirmation verification rule with 95% accuracy scoring gate
globs: ["**/*"]
alwaysApply: true
---

# Plan Affirmation Verification Rule (95% Accuracy Gate)

> **MANDATORY DIRECTIVE**: For all implementation plans, technical specifications, and step-by-step guides developed in this workspace, every technical claim, assumption, architecture decision, and execution step must be validated against reality, documentation, and best practices.

---

## 1. The Affirmation Verification Protocol

Whenever creating, modifying, or extending an implementation plan:

1. **Catalog Every Affirmation**: Extract every core affirmation, structural choice, tool dependency, and domain claim into a structured **Affirmation Verification Matrix**.
2. **Score Along 5 Dimensions**:
   - **Reality & Feasibility (RF)**: Is this technically possible, verifiable, and executable with zero fictitious APIs or impossible assumptions? (Scale: 0–100%)
   - **Business & Demo Value (BV)**: Does this directly satisfy the AWS CDS hackathon objectives, R01–R45 rules, and the €4,800 quote recovery scenario? (Scale: 0–100%)
   - **Engineering Best Practices (BP)**: Does it follow Hexagonal Architecture (Ports & Adapters), DDD, pure Domain Core, YAGNI, ACL, idempotency, and type safety? (Scale: 0–100%)
   - **Documentation Connection (DC)**: Is it explicitly grounded in [`docs/workflows.md`](file:///Users/jonatassouza/bin/dev/mendley/docs/workflows.md), [`docs/research.md`](file:///Users/jonatassouza/bin/dev/mendley/docs/research.md), [`AGENTS.md`](file:///Users/jonatassouza/bin/dev/mendley/AGENTS.md), or the [`design-system`](file:///Users/jonatassouza/bin/dev/mendley/design-system/README.md)? (Scale: 0–100%)
   - **Composite Accuracy Score (Score)**: Weighted calculation `(RF * 0.25) + (BV * 0.25) + (BP * 0.25) + (DC * 0.25)`.

3. **The 95% Gate**:
   - **Every single affirmation in the plan must achieve ≥ 95% composite score.**
   - If an affirmation scores < 95%, it must be immediately refined, verified against authoritative sources, or removed.
   - **Execution Gate**: Implementation MUST NOT begin until all plan affirmations reach ≥ 95%.

4. **Continuous Re-verification**:
   - Any modification, addition, or update to the plan must trigger an automatic re-evaluation of the Affirmation Verification Matrix until all entries reach ≥ 95%.
