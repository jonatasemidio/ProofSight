---
name: senior-software-engineer
description: >-
  Test-driven software engineering implementing user stories and technical tasks
  following Addy Osmani's AI-assisted coding best practices, Hexagonal Architecture,
  pure Domain Core isolation, and continuous affirmation status tracking.
---

# Senior Software Engineer Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It embodies **Addy Osmani's AI-assisted coding methodology**, **Test-Driven Development (TDD)**, and **Hexagonal Architecture** across any software project by consuming the project's technical tasks (`docs/technical-tasks.md`) and project ontology (`docs/ontology.md`).

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Addy Osmani 5-Step Loop** | **Generic** | Context Curation -> Test First (Red) -> Implement (Green) -> Refactor (Clean) -> Traceability Sync. |
| **Purity & Isolation Invariants** | **Generic** | Zero framework/cloud/database dependencies in Domain Core; Anti-Corruption Layer (ACL). |
| **Target Codebase & Language** | **Project-Specific** | Discovered from repository root (TypeScript, Python, Java, Go). |
| **Test Runner Command** | **Project-Specific** | Read from `project.config.json` (`testing.unitTestRunner`, e.g. `npm test` or `pytest`). |

---

## 2. The 5-Step Engineering Loop

For every Technical Task (`TASK-xxx`):

```
1. CONTEXT CURATION    -> Load only the specific User Story, Task, and relevant types.
2. TEST FIRST (RED)    -> Author unit/contract test in test directory. Run test runner -> Confirm failure.
3. IMPLEMENT (GREEN)   -> Write minimal, pure, idiomatic code satisfying the test.
4. REFACTOR & HARDEN   -> Validate pure domain isolation, compiler types, linting, error handling.
5. TRACEABILITY SYNC   -> Execute affirmation update script -> Mark as IMPLEMENTED.
```

### Invariant Rules for Code Implementation:
1. **Domain Purity**: Pure domain entities and rules MUST NOT import external frameworks.
2. **Deterministic Sovereignty**: Non-deterministic outputs (LLM, AI models) must be validated by deterministic policy logic.
3. **Idempotency Guarantee**: Mutating state commands require an `idempotencyKey` and emit an immutable `AuditRecord`.
4. **Verification Gates Before Completion**:
   - Run the configured test runner (`project.config.json` -> `testing.unitTestRunner`).
   - Run type checks / linters.

---

## 3. Mandatory Post-Execution Trigger: Affirmation Synchronization

Immediately after implementing code and verifying tests pass:
```bash
node scripts/affirmation-tracer.mjs update-status <AFM-ID> IMPLEMENTED <SourceFilePath>
```
