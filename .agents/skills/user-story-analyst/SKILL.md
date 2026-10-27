---
name: user-story-analyst
description: >-
  Author, review, and split User Stories using Mike Cohn (Mountain Goat Software) standards,
  INVEST quality review, SPIDR splitting algorithms, and automated Affirmation Matrix correlation.
---

# User Story Analyst Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It applies **Mike Cohn (Mountain Goat Software)** standards, **INVEST** review criteria, and **SPIDR** splitting algorithms to *any* project by consuming the project's specific domain ontology (`docs/ontology.md`) and affirmation matrix (`docs/affirmation-matrix.md`).

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Story Template & Methodology** | **Generic** | Mike Cohn ("As a... I want... So that..."), Gherkin BDD scenarios, INVEST checklist, SPIDR splitting algorithm. |
| **Traceability Protocol** | **Generic** | Linking story IDs (`US-xxx`) to affirmation anchors (`AFM-xxx`) via tracer CLI. |
| **Domain Personas & Scenarios** | **Project-Specific** | Read from the project's ontology (`docs/ontology.md`) and documentation. |
| **Business Rules & Guardrails** | **Project-Specific** | Extracted from the project's deterministic rules (e.g., R01–R45 in Mendly). |

---

## 2. Execution Protocol

### Step 1: Discover & Bind Project Ontology
1. Read `project.config.json` -> Locate `ontology.definitionFile` (e.g. [`docs/ontology.md`](file:///Users/jonatassouza/bin/dev/mendley/docs/ontology.md)).
2. If `docs/ontology.md` does not exist, invoke the ontology scaffolding instructions in `affirmation-extractor-tracer`.
3. Extract project-specific personas, problem classifications, terminal states, and governing policy rules.

### Step 2: Author Cohn User Stories
Author stories in the project's designated user stories file (e.g., `docs/user-stories.md`):

```markdown
## US-XXX: <Action-Oriented Title>

### 1. Cohn User Story Narrative
**As a** <specific persona defined in project ontology>,
**I want** <clear, unambiguous business capability or interaction>,
**So that** <quantifiable customer benefit or business value>.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-XXX`, `AFM-YYY`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `<From docs/ontology.md>`
  - Target Terminal State: `<From docs/ontology.md>`
  - Governing Policy Rules: `<Applicable Project Invariants>`

### 3. Acceptance Criteria (Gherkin BDD Format)
Scenario: <Primary Happy Path>
  Given <system precondition>
  When <actor action>
  Then <observable system outcome>
  And <state persistence / audit assertion>

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy (If decomposed)
- **Splitting Dimension**: `[Spike | Paths | Interfaces | Data | Rules]`
- **Rationale**: <Decomposition notes>
```

### Step 3: Trigger Affirmation Synchronization
Immediately link the authored user story to its source affirmations:
```bash
node scripts/affirmation-tracer.mjs link-story AFM-XXX US-XXX
```
