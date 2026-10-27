---
description: Mandatory affirmation matrix synchronization and bidirectional traceability gate across all SDLC steps
globs: ["**/*"]
alwaysApply: true
---

# Mandatory Affirmation Traceability & Automated Sync Rule

> **SOVEREIGN DIRECTIVE**: To maximize the determinism of the AI assistant process flow, all requirements, user stories, technical tasks, implementation code, and acceptance tests in this repository MUST be anchored to the **Affirmation Matrix** (`docs/affirmation-matrix.md` / `docs/affirmation-matrix.json`).

---

## 1. Automated Post-Step Affirmation Trigger

Whenever an AI assistant or engineer completes an action in the repository, the Affirmation Matrix MUST be immediately updated:

| Step Completed | Mandatory CLI Action | Target Matrix Status |
| :--- | :--- | :---: |
| **User Story Authored** (`US-xxx`) | `node scripts/affirmation-tracer.mjs link-story <AFM-ID> <US-ID>` | `IN_DESIGN` |
| **Technical Task Defined** (`TASK-xxx`) | `node scripts/affirmation-tracer.mjs link-task <AFM-ID> <TASK-ID>` | `IN_PROGRESS` |
| **Code Implemented & Unit Tested** | `node scripts/affirmation-tracer.mjs update-status <AFM-ID> IMPLEMENTED <File>` | `IMPLEMENTED` |
| **PO Playwright Test & Demo Published**| `node scripts/affirmation-tracer.mjs update-status <AFM-ID> VERIFIED_E2E <DemoDoc>`| `VERIFIED_E2E` |

---

## 2. Invariant Traceability & Quality Gates

1. **No Orphaned Stories or Tasks**:
   - Every User Story in `docs/user-stories.md` MUST explicitly cite at least one Affirmation ID (`AFM-xxx`).
   - Every Technical Task in `docs/technical-tasks.md` MUST cite both its parent User Story (`US-xxx`) and Affirmation ID (`AFM-xxx`).
2. **The 95% Affirmation Accuracy Gate**:
   - Run `node scripts/affirmation-tracer.mjs audit` to ensure that every affirmation in the plan reaches ≥ 95% composite accuracy.
   - If any affirmation fails the gate, execution of subsequent implementation steps is blocked.
3. **Ontology Compliance**:
   - All stories and tasks must respect the 12 Obstacle Taxonomies, 8 Terminal States, and deterministic policy rules R01–R45 defined in [AGENTS.md](file:///Users/jonatassouza/bin/dev/mendley/AGENTS.md).

---

## 3. Global Bootstrapping Invariant for Any Workspace

When running in any new Antigravity workspace:
- If `scripts/affirmation-tracer.mjs` is not yet present in the current workspace, the assistant MUST immediately copy it from `/Users/jonatassouza/bin/dev/boule/scripts/affirmation-tracer.mjs` (or run it directly: `node /Users/jonatassouza/bin/dev/boule/scripts/affirmation-tracer.mjs <command>`).
- This guarantees zero manual setup when initiating a project from any workspace on this machine.
