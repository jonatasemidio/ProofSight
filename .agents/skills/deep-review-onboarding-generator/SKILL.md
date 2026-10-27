---
name: deep-review-onboarding-generator
description: >-
  Performs holistic architectural and functional audits across all stories, tasks,
  and tests, synthesizing generated slow-motion demo videos into interactive,
  developer and stakeholder onboarding documentation.
---

# Deep Review & Video-Driven Onboarding Generator Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It conducts a comprehensive system audit and synthesizes slow-motion Playwright demonstration videos into living onboarding documentation for *any* software project.

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Audit Protocol** | **Generic** | Auditing traceability closure (0 orphans), Hexagonal domain purity, deterministic policy compliance, and E2E demo verification. |
| **Onboarding Structure** | **Generic** | Architecture quickstart, video demo gallery, domain primer, local runbook, affirmation matrix summary. |
| **Onboarding Target File** | **Project-Specific** | Read from `project.config.json` (`deliverables.onboardingFile`, default: `docs/onboarding.md`). |
| **Project Architecture & Media**| **Project-Specific** | Synthesizes the project's own architecture diagrams, videos, and scenario walkthroughs. |

---

## 2. Execution Protocol

### Step 1: Deep System Review
Execute the 5-point audit:
1. **Traceability Closure**: Run `node scripts/affirmation-tracer.mjs audit` -> Confirm 0 orphans and 100% story/task coverage.
2. **Domain Purity**: Ensure Domain Core has zero external framework or database imports.
3. **Deterministic Policy Compliance**: Ensure business invariants are covered by unit tests.
4. **Anti-Corruption Layer (ACL) Integrity**: Ensure UI is decoupled from backend schemas.
5. **E2E Demo Coverage**: Ensure every core story has a passing Playwright demo and video.

### Step 2: Video-Driven Onboarding Synthesis
Update the project's onboarding documentation (`docs/onboarding.md`):
- Embed generated slow-motion demo videos.
- Document domain ontology entities and ubiquitous language.
- Provide clear local development runbooks (`npm test`, `playwright`, `affirmation-tracer`).

### Step 3: Trigger Affirmation Synchronization
Run the final audit:
```bash
node scripts/affirmation-tracer.mjs audit
```
Confirm that 100% of affirmations meet or exceed the **95% Plan Affirmation Verification Gate**.
