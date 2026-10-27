# Mountain Goat Software & Mike Cohn Agile Requirements Guide

> **Authoritative Reference**: Standard for writing, reviewing, and splitting User Stories using Mike Cohn's methodology, the INVEST quality framework, and the SPIDR story-splitting algorithm.

---

## 1. The Mike Cohn User Story Template

Every User Story captures who wants the capability, what the capability is, and why they need it:

```markdown
### US-XXX: <Action-Oriented Title>

**As a** <specific persona / role>,
**I want** <specific, unambiguous capability or outcome>,
**So that** <quantifiable business or customer value>.
```

### Key Rules for Personas & Value:
- **Avoid Generic Roles**: Never use "As a user". Be specific: "As a prospective heat-pump buyer with an abandoned €4,800 installation quote", "As an operations manager reviewing lost opportunities".
- **Business Justification**: The "So that" clause must articulate true value, grounded in the Mendly Domain Ontology (e.g. overcoming financial friction, receiving transparent terms, completing transaction).

---

## 2. The INVEST Quality Review Matrix

Before any User Story is approved for architectural tasking or engineering, it must be evaluated against the INVEST criteria:

| Criterion | Definition | Quality Standard for Mendly |
| :--- | :--- | :--- |
| **I — Independent** | The story can be developed, tested, and released independently of other stories where feasible. | Minimal coupling; dependencies explicitly documented. |
| **N — Negotiable** | The story is not an inflexible contract; details and edge cases can be refined with the PO and architect. | Captures intent and boundaries, leaving technical realization to tasks. |
| **V — Valuable** | Delivers measurable value to the customer or merchant. | Directly links to recovering lost transactions, reducing friction, or enforcing rules R01–R45. |
| **E — Estimable** | The team has sufficient clarity to understand the scope and size. | Contains zero unbounded technical unknowns; spike created if unknown. |
| **S — Small** | Fits easily within a single development iteration/sprint (ideally 1–3 days). | Follows SPIDR decomposition if too large. |
| **T — Testable** | Has objective, verifiable acceptance criteria. | Includes Given/When/Then (Gherkin) scenarios executable via automated tests (Vitest / Playwright). |

---

## 3. The SPIDR Story-Splitting Algorithm

When a User Story is too large ("Epic" or compound story), apply the **SPIDR** heuristic to split it cleanly without losing business value:

### 1. **S — Spike** (Research / Prototyping)
- Split off a time-boxed technical investigation when an unknown library, API, or algorithm blocks estimation.
- *Example*: Spike to evaluate Playwright video slow-mo encoding performance before building the full test suite.

### 2. **P — Paths** (Alternative Workflows)
- Split the happy path from alternative or edge-case paths.
- *Example*:
  - Story 1: Happy path accepting a 3-month installment plan for €4,800 quote.
  - Story 2: Alternative path handling customer opt-out or decline (`CUSTOMER_DECLINED` / `OPTED_OUT`).

### 3. **I — Interfaces** (Devices / Channels / Formats)
- Split by user interface or channel.
- *Example*:
  - Story 1: Resolve Micro-UI on desktop web.
  - Story 2: Resolve Micro-UI responsive mobile touch layout.

### 4. **D — Data** (Data Subsets / Complexities)
- Split by data complexity or payment terms.
- *Example*:
  - Story 1: Fixed 3-month equal installments without interest.
  - Story 2: Dynamic multi-tier installments (3, 6, 12 months) with interest calculation.

### 5. **R — Rules** (Business Rules & Constraints)
- Split strict policy constraints into progressive increments.
- *Example*:
  - Story 1: Basic opportunity resolution execution.
  - Story 2: Strict enforcement of policy rules R07 (economic eligibility) and R22 (anti-spam throttling).

---

## 4. Acceptance Criteria Format (Gherkin BDD)

Each user story MUST include 2 to 5 concrete acceptance criteria in Gherkin syntax:

```gherkin
Scenario: Customer selects 3-month installment plan
  Given the customer has received a resolution link for quote "Q-4800"
  And the opportunity obstacle is classified as "FINANCIAL_CONSTRAINTS"
  When the customer clicks "Accept 3-Month Plan (€1,600 / mo)"
  Then the system records customer consent with timestamp
  And calls the ResolveTransactionPort with idempotency key
  And updates the transaction state to "COMPLETED"
  And displays an immediate confirmation screen with payment schedule
```
