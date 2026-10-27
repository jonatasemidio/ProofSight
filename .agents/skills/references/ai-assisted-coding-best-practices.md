# AI-Assisted Coding Best Practices & Deterministic Engineering

> **Authoritative Reference**: Synthesizing the methodologies of Addy Osmani (*"Smart LLMs, Dumb Pipes"*, *"Context Budgeting"*, *"Specification-First Prompting"*), Martin Fowler, and Kent Beck for deterministic, high-integrity AI-assisted software development.

---

## 1. Core Philosophy: Deterministic AI Engineering

AI coding assistants are probabilistic pattern generators. High-performing engineering teams turn probabilistic generative models into **deterministic software pipelines** by surrounding the AI with rigid constraints, executable specifications, automated verification gates, and single-source-of-truth traceability.

### The Five Tenets of AI-Assisted Software Delivery

1. **Specification Before Generation (Spec-First)**:
   - Never allow an LLM to generate production code without an approved, verified specification (User Story with Gherkin ACs, Technical Task with interface signatures, and Affirmation ID).
   - If the specification contains ambiguity, the generated code will contain bugs.

2. **Context Budgeting & Strict Scoping**:
   - LLM performance degrades rapidly when overloaded with irrelevant context ("context pollution").
   - Curation beats volume: inject only the explicit domain types, port interfaces, and acceptance criteria required for the single task at hand.
   - Separate concerns across specialized roles: Architecture, UX Design, Implementation, and QA should operate in distinct steps with isolated, well-defined prompts.

3. **Small, Atomic, Verifiable Iterations**:
   - Restrict AI generation steps to single, cohesive units of work (e.g., 1 Domain Entity, 1 Value Object, 1 Port Adapter, or 1 User Story scenario).
   - Avoid monolithic diffs (> 300 lines of generated code without an intermediate test execution is an anti-pattern).

4. **Automated Verification Loop (Red-Green-Refactor)**:
   - **Test-First Prompting**: Have the AI generate failing unit/contract tests based on the specification *before* generating implementation code.
   - **Deterministic Proof**: Run `vitest run` or `playwright test` synchronously to prove code works. Do not trust AI self-evaluations; trust test runners and compilers (`tsc --noEmit`).

5. **Bidirectional Traceability & The Affirmation Anchor**:
   - Every requirement from documentation must be captured as an immutable Affirmation (`AFM-xxx`).
   - Every User Story (`US-xxx`), Technical Task (`TASK-xxx`), Git Commit, and Test Case must point back to its Affirmation anchor.
   - A step is NOT done until its Affirmation state has been deterministically updated.

---

## 2. The Addy Osmani Prompting & Workflow Loop

```
+-----------------------------------------------------------------------+
|  1. GROUND & BOUND                                                    |
|     - Read Affirmation (AFM-xxx) & Story (US-xxx)                     |
|     - Provide exact interfaces & domain boundaries                    |
+-----------------------------------v-----------------------------------+
|  2. PLAN & INTERFACE CONTRACT                                         |
|     - Define method signatures, invariants, and error contracts       |
|     - Verify with 95% Plan Affirmation Verification Gate               |
+-----------------------------------v-----------------------------------+
|  3. TEST SPECIFICATION (RED)                                          |
|     - Author test file with explicit Given/When/Then scenarios        |
|     - Run test runner -> Confirm expected failure                     |
+-----------------------------------v-----------------------------------+
|  4. MINIMAL IMPLEMENTATION (GREEN)                                    |
|     - Implement exact logic to satisfy the test                       |
|     - Zero speculative features (YAGNI)                               |
+-----------------------------------v-----------------------------------+
|  5. REFACTOR & HARDEN                                                 |
|     - Verify immutability, edge cases, error handling, linting        |
|     - Pure Domain Core isolation (zero external imports)              |
+-----------------------------------v-----------------------------------+
|  6. DETERMINISTIC TRACEABILITY SYNC                                   |
|     - Execute affirmation tracer -> Mark AFM-xxx as IMPLEMENTED       |
+-----------------------------------------------------------------------+
```

---

## 3. Cognitive Scaffolding & Defending Against AI Hallucinations

| AI Failure Mode | Cause | Engineering Defense Mechanism |
| :--- | :--- | :--- |
| **Phantom APIs** | AI invents non-existent functions or libraries | Provide explicit TypeScript types/ports; run `tsc --noEmit` immediately |
| **Premature Generalization** | AI creates complex abstraction layers prematurely | Enforce YAGNI rule; constrain solution to immediate technical task |
| **Context Drift** | AI loses track of rules over long chats | Use modular Skills with progressive disclosure; re-anchor with Affirmations |
| **Silent Logic Regressions** | AI modifies existing behavior unnoticed | Maintain comprehensive unit and Playwright regression suites |
| **Ontology Deviation** | AI invents custom status names | Grounding in Ubiquitous Language ([AGENTS.md](file:///Users/jonatassouza/bin/dev/mendley/AGENTS.md)) + Affirmation checks |

---

## 4. Verification Checkpoints for Every Code Change

Before marking any technical task complete:
1. `npm run test` (Vitest unit & integration tests pass with zero failures)
2. `npx tsc --noEmit` (TypeScript compilation clean)
3. Linting passes with zero warnings
4. Affirmation status updated via Affirmation Tracker
