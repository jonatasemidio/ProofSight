---
name: affirmation-extractor-tracer
description: >-
  Extracts atomic affirmations from documentation, scores clarity and reasonableness,
  maintains the single source of truth Affirmation Matrix, and guarantees bidirectional
  traceability across User Stories, Tech Tasks, Code, and PO E2E Acceptance Tests.
---

# Affirmation Extractor & Traceability Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It operates across any software repository by reading the project configuration (`project.config.json`) and the project-specific domain ontology (`docs/ontology.md`).

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Extraction Engine** | **Generic** | Syntactic table & proposition parser (`scripts/affirmation-tracer.mjs`). Works on any Markdown or specification file. |
| **Traceability Protocol** | **Generic** | State machine (`NOT_STARTED` -> `IN_DESIGN` -> `IN_PROGRESS` -> `IMPLEMENTED` -> `VERIFIED_E2E`). |
| **Plan Affirmation Gate** | **Generic** | Mathematical formula evaluating RF, BV, BP, DC accuracy (≥ 95% threshold). |
| **Project Ontology** | **Project-Specific** | Defined in `docs/ontology.md` and `AGENTS.md`. Contains this project's unique entities, business rules, and taxonomies. |
| **Documentation Sources** | **Project-Specific** | Listed in `project.config.json` under `documentation.primaryDocs`. |

---

## 2. When to Activate This Skill

- When onboarding a new project or adding new requirements, rules, research findings, or specifications.
- After every step in the SDLC (User Story creation, Architecture planning, Frontend design, Engineering implementation, PO Testing, and Deep Review) to link IDs and update status.
- When performing a compliance audit against the **95% Plan Affirmation Verification Gate**.

---

## 3. Project Ontology Discovery & Scaffolding Protocol

1. **Check for Project Ontology**:
   - Inspect `project.config.json` to find `ontology.definitionFile` (default: `docs/ontology.md`).
   - If `docs/ontology.md` does not exist, scaffold it using the **Universal Project Ontology Template**:
     - **Section 1: Ubiquitous Language & Core Entities** (Primary domain nouns and aggregates).
     - **Section 2: Friction Taxonomies / Obstacles** (Classifications of friction or problem domains).
     - **Section 3: Canonical Terminal States** (Authoritative completion / exit states).
     - **Section 4: Deterministic Policy Rules** (R01–RXX business invariants).
2. **Execute Affirmation Extraction**:
   ```bash
   node scripts/affirmation-tracer.mjs extract
   ```

---

## 4. Universal Traceability CLI Commands

```bash
# Ingest docs and register atomic affirmations
node scripts/affirmation-tracer.mjs extract

# Link user story to affirmation
node scripts/affirmation-tracer.mjs link-story <AFM-ID> <US-ID>

# Link technical task to affirmation
node scripts/affirmation-tracer.mjs link-task <AFM-ID> <TASK-ID>

# Update implementation code status
node scripts/affirmation-tracer.mjs update-status <AFM-ID> IMPLEMENTED <FilePath>

# Update verified PO acceptance demo status
node scripts/affirmation-tracer.mjs update-status <AFM-ID> VERIFIED_E2E <DemoDocPath>

# Audit 100% traceability and enforce 95% gate
node scripts/affirmation-tracer.mjs audit
```

---

## 5. Unstructured Ingestion Protocol (Random Docs, Business Cases & Notes)

In real projects, documentation is often scattered across messy files, random notes, PRDs, or unstructured business case descriptions. In this scenario:

1. **Auto-Discovery**:
   - Search the entire repository for any text or markdown files (`*.md`, `*.txt`, `*.rst`, `notes/`, `specs/`, etc.).
2. **Business Case Disentanglement (Reverse-Engineering the Ontology)**:
   - Analyze all business cases, customer stories, and descriptions to extract:
     - **Core Entities & Nouns**: The primary business objects (e.g. Order, Quote, Shipment, Claim, Patient).
     - **Problem / Friction Taxonomies**: Recurring failure modes or customer hesitations.
     - **Canonical Terminal States**: How workflows conclude (success, decline, timeout, escalation).
     - **Deterministic Business Rules (R01–RXX)**: Explicit or implicit constraints, thresholds, discount caps, and policies.
3. **Generate `docs/ontology.md`**:
   - Synthesize the extracted ontology into `docs/ontology.md` as the authoritative domain foundation.
4. **Run Affirmation Extraction**:
   - Run `node scripts/affirmation-tracer.mjs extract` — it automatically scans all discovered files and registers atomic claims into `docs/affirmation-matrix.md`.
