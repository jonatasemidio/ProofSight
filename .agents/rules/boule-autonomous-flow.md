---
description: Autonomous end-to-end SDLC progression, adaptive phase entry, and backward reverse-engineering rule
globs: ["**/*"]
alwaysApply: true
---

# Boule Autonomous SDLC Flow & Adaptive Reverse-Engineering Rule

> **SOVEREIGN DIRECTIVE**: Boule is an autonomous, phase-aware software delivery pipeline. When triggered, the AI assistant MUST proceed continuously through all SDLC phases in sequential order until full completion, unless an explicit stop is requested by the user or an unresolvable gate failure occurs.

---

## 1. The Autonomous Forward Continuity Principle

1. **Continuous Execution**:
   - The AI assistant must NOT stop or wait for unnecessary user confirmation after completing an intermediate phase.
   - When a phase finishes, the AI automatically executes the phase review, updates the Affirmation Matrix, validates the 95% gate, and immediately advances to the next phase.
2. **Explicit Stop Conditions**:
   - Execution halts ONLY when:
     a. The user explicitly prompts "stop after Phase X" or asks for human sign-off on a specific deliverable.
     b. The 95% Plan Affirmation Gate fails with an irreconcilable contradiction requiring human decision.
     c. The entire 8-Phase pipeline reaches terminal completion (`Phase 8: Deep Review & Onboarding`).

---

## 2. Adaptive Starting Point & Backward Reverse-Engineering

Projects enter Boule at different stages of maturity. The AI assistant detects the entry phase and establishes 100% bidirectional traceability:

```
                          [ENTRY POINT DETECTION]
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
[Case A: Raw Notes / Docs]   [Case B: Existing Stories]   [Case C: Existing Code]
       │                            │                            │
       │                            ▼                            ▼
       │                  [Reverse-Engineer Backwards]  [Reverse-Engineer Backwards]
       │                  1. Reconstruct ontology.md    1. Extract domain types
       │                  2. Extract affirmations (AFM) 2. Reconstruct ontology.md
       │                  3. Link existing stories (US) 3. Reconstruct stories (US)
       │                            │                            │
       └────────────────────────────┴────────────────────────────┘
                                    │
                                    ▼
       ====================== NORMAL FORWARD FLOW ======================
       Phase 1: Domain Ontology & Ubiquitous Language (docs/ontology.md)
       Phase 2: Affirmation Extraction & Traceability (docs/affirmation-matrix.md)
       Phase 3: Mike Cohn / INVEST / SPIDR User Stories (docs/user-stories.md)
       Phase 4: Hexagonal Ports & Adapters Architecture (docs/technical-tasks.md)
       Phase 5: Design System UI/UX Specs & Tokens (design-system/tokens/)
       Phase 6: Test-Driven Engineering (Addy Osmani TDD loop & Vitest)
       Phase 7: PO Acceptance Simulation & SlowMo Playwright DEMO Presentations
       Phase 8: Deep System Audit & Video-Driven Onboarding Synthesis
```

---

## 3. Mandatory Review Checkpoint Between Each Phase

Before transitioning from Phase $N$ to Phase $N+1$, the AI MUST execute:
1. **Automated Affirmation Traceability Action**:
   - `node scripts/affirmation-tracer.mjs link-story / link-task / update-status`
2. **Phase Quality Check**:
   - Confirm all outputs adhere strictly to the phase standard (e.g., INVEST for stories, pure domain isolation for architecture).
3. **Emit Phase Completion Checkpoint**:
   - Output a brief milestone summary header:
     ```markdown
     ### ✅ [BOULE PHASE N COMPLETE]: <Deliverable Name>
     - Status: All assertions linked to AFM-xxx. 95% Gate Verified.
     - Advancing autonomously to Phase N+1: <Next Phase Name>...
     ```
   - Immediately proceed to Phase $N+1$ without pausing for user input.

---

## 4. Anti-Skipping Invariant & Trigger Recognition

1. **Trigger Recognition**:
   When the user states:
   - *"implement a complete project based on those docs"*
   - *"build this project from the documentation"*
   - *"run Boule"*
   - *"prepare and implement this project"*
   The AI assistant MUST treat this as an authoritative command to initiate and execute the **Boule Autonomous SDLC State Machine** from Phase 1 through Phase 8 without interruption.

2. **Strict Sequential Anti-Skipping Invariant**:
   - The assistant is **STRICTLY FORBIDDEN** from jumping straight to coding, scaffolding random files, or writing implementation code before upstream phases are complete.
   - **Phase Gating Invariants**:
     - Cannot author User Stories without an approved `docs/ontology.md` and `docs/affirmation-matrix.md`.
     - Cannot author Technical Tasks without approved Mike Cohn User Stories (`docs/user-stories.md`).
     - Cannot write implementation code (`src/`) without approved Hexagonal Technical Tasks (`docs/technical-tasks.md`).
     - Cannot mark a task complete without running unit tests (`npm test`).
     - Cannot conclude without running Playwright E2E slowMo acceptance simulations (`docs/demos/`) and updating `docs/onboarding.md`.
   - **Verification Gate**: At each transition, the assistant MUST execute `node scripts/affirmation-tracer.mjs audit`. If the audit fails or contains orphaned items, the assistant MUST resolve the gap before moving forward.
