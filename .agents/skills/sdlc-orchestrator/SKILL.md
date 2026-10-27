---
name: sdlc-orchestrator
description: >-
  The Master Autonomous SDLC Orchestrator coordinating end-to-end software delivery.
  Executes continuously across all phases until completion, supports adaptive entry
  points with backward reverse-engineering, and enforces automated affirmation gate reviews.
---

# SDLC Orchestrator Skill (Autonomous End-to-End Pipeline)

This skill serves as the **Master Autonomous Orchestrator** for Boule. When activated, it executes the software delivery lifecycle **continuously until completion**, dynamically detects repository starting points (raw docs, existing stories, or legacy code), reverse-engineers missing upstream artifacts when needed, and enforces automated affirmation gate reviews between each phase.

---

## 1. Autonomous Pipeline Execution Modes

### Mode A: Green-Field / Raw Documentation Execution (Forward Flow)
Triggered when given raw notes, business cases, or unstructured documentation:
- **Phase 1: Ingest & Reverse-Engineer Domain Ontology** (`docs/ontology.md`)
- **Phase 2: Affirmation Extraction & Matrix Generation** (`docs/affirmation-matrix.md`)
- **Phase 3: Mike Cohn / INVEST / SPIDR User Stories** (`docs/user-stories.md`)
- **Phase 4: Hexagonal Architectural Task Decomposition** (`docs/technical-tasks.md`)
- **Phase 5: Design System Specification & Token Crafting** (`design-system/`)
- **Phase 6: Test-Driven Engineering** (Addy Osmani AI loop, Vitest, clean domain)
- **Phase 7: PO Acceptance Simulation & SlowMo Playwright Demo** (`docs/demos/`)
- **Phase 8: Deep System Audit & Video Onboarding Synthesis** (`docs/onboarding.md`)

> **Autonomous Mandate**: The AI proceeds automatically from Phase 1 through Phase 8 without stopping, unless the user explicitly requested a stop or an unresolvable gate failure occurs.

---

### Mode B: Reverse-Engineering from Existing Stories (Adaptive Flow)
Triggered when a repository already has User Stories, but lacks a formal Domain Ontology or Affirmation Matrix:
1. **Reverse-Engineer Upstream Artifacts**:
   - Synthesizes `docs/ontology.md` from the existing stories (reconstructing Core Entities, Problem Taxonomies, Terminal States, and Invariant Rules).
   - Extracts atomic claims into `docs/affirmation-matrix.md`.
   - Links all existing stories to their generated affirmation IDs (`AFM-xxx`).
2. **Resume Normal Forward Flow**:
   - Resumes seamlessly from **Phase 4 (Hexagonal Architecture)** through **Phase 8 (Onboarding)**.

---

### Mode C: Reverse-Engineering from Existing Code (Brown-Field Flow)
Triggered when an existing codebase is onboarded into Boule:
1. Inspects existing domain models, services, and tests.
2. Reconstructs `docs/ontology.md`, extracts `docs/affirmation-matrix.md`, and authors formal `docs/user-stories.md`.
3. Validates test coverage and proceeds with missing phases (E2E acceptance demos, onboarding).

---

## 2. Invariant Review Checkpoints Between Phases

Between every phase transition, the orchestrator autonomously:
1. Executes the corresponding Affirmation Tracer synchronization:
   - `node scripts/affirmation-tracer.mjs link-story / link-task / update-status`
2. Audits the 95% Plan Affirmation Gate (`node scripts/affirmation-tracer.mjs audit`).
3. Logs a phase review milestone and immediately starts the next phase.
