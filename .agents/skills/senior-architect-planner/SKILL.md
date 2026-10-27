---
name: senior-architect-planner
description: >-
  Architectural design and technical task decomposition adhering to Hexagonal Architecture
  (Ports & Adapters), DDD, pure Domain Core, Anti-Corruption Layer (ACL), and deterministic policy engine rules.
---

# Senior Architect Planner Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It applies **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD)**, and **Anti-Corruption Layer (ACL)** patterns to *any* software project by consuming the project's specific domain ontology (`docs/ontology.md`) and user stories (`docs/user-stories.md`).

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Hexagonal Pattern** | **Generic** | Inbound Ports (use cases), Outbound Ports (gateways/repos), Pure Domain Core, Adapters, Frontend ACL. |
| **Task Decomposition Schema** | **Generic** | Bounded context, invariants, method signatures, test contract, idempotency. |
| **Domain Entities & Value Objects** | **Project-Specific** | Read from `docs/ontology.md` (e.g. Transaction, Quote, Obstacle in Mendly; Account, Trade, Ledger in Fintech). |
| **Policy Invariants** | **Project-Specific** | Derived from the project's deterministic business rules. |

---

## 2. Execution Protocol

### Step 1: Discover Project Boundaries
1. Check `project.config.json` for architectural settings and ontology paths.
2. Review [`docs/ontology.md`](file:///Users/jonatassouza/bin/dev/mendley/docs/ontology.md) to understand domain entities, aggregates, and terminal states.

### Step 2: Technical Task Decomposition
Decompose approved user stories into technical tasks in `docs/technical-tasks.md`:

```markdown
## TASK-XXX: <Component / Architectural Module Name>

### 1. Traceability & Context
- **Linked User Story**: [US-XXX](file:///Users/jonatassouza/bin/dev/mendley/docs/user-stories.md#US-XXX)
- **Linked Affirmations**: `AFM-XXX`, `AFM-YYY`
- **Architectural Layer**: `[Domain Core Entity | Value Object | Inbound Port | Outbound Port | Adapter | Frontend ACL | Micro-UI]`

### 2. Hexagonal Boundary & Invariants
- **Layer Isolation Guarantee**:
  - If Domain Core: ZERO external imports (No framework/database/cloud SDKs). Pure language types only.
  - If Adapter: Implements Outbound Port interface or drives Inbound Port.
  - If Frontend ACL: Exposes typed DTO client isolating UI from backend schema.
- **Idempotency & Auditing**:
  - Command interface must require `idempotencyKey: string`.
  - Emits immutable `AuditRecord`.

### 3. Interface & Contract Specification
```typescript
export interface InboundPortSignature { ... }
```

### 4. Implementation Checklist
- [ ] 1. Author failing unit test in test directory (TDD Red).
- [ ] 2. Implement pure domain logic / port interface.
- [ ] 3. Implement adapter with retry and error boundaries.
- [ ] 4. Run unit tests and type checks.
- [ ] 5. Synchronize Affirmation Matrix.
```

### Step 3: Trigger Affirmation Synchronization
Immediately link the defined technical task to its source affirmations:
```bash
node scripts/affirmation-tracer.mjs link-task AFM-XXX TASK-XXX
```
