---
description: Universal domain ontology discovery, Hexagonal Architecture, and project ontology ruling
globs: ["**/*"]
alwaysApply: true
---

# Universal Domain Ontology & Hexagonal Architecture Rule

> **SOVEREIGN DIRECTIVE**: All new files, entities, database schemas, API DTOs, and foundational logic in any repository MUST adhere to the **Project Domain Ontology** before writing implementation code.

---

## 1. Project Domain Ontology Discovery & Scaffolding Protocol

1. **Locate the Project Ontology File**:
   - Check `project.config.json` for `ontology.definitionFile` (default: [`docs/ontology.md`](file:///Users/jonatassouza/bin/dev/mendley/docs/ontology.md)) or [`AGENTS.md`](file:///Users/jonatassouza/bin/dev/mendley/AGENTS.md).
   - If the project ontology does NOT exist yet in the project directory, the AI assistant MUST create/scaffold it at `docs/ontology.md` with:
     - **Ubiquitous Language & Core Entities**: Explicit nouns, aggregates, and definitions.
     - **Friction Taxonomies / Classification States**: Domain-specific obstacle/problem taxonomies.
     - **Canonical Terminal States**: Strict, finite conclusion states for all workflows.
     - **Deterministic Policy Rules**: Numerical business invariants (e.g. R01–RXX) binding on all operations.

2. **The Sovereign Rule of Policy**:
   - Probabilistic AI models (LLMs, Bedrock, Gemini) only interpret, classify, and propose.
   - The deterministic Policy Engine defined in the project ontology has ultimate authority to evaluate, permit, or reject execution.

---

## 2. Ports & Adapters (Hexagonal Architecture) + DDD Standards

1. **Pure Domain Core**:
   - `src/core/` or the domain directory MUST contain zero framework dependencies (no database drivers, no HTTP clients, no cloud SDKs).
2. **Inbound & Outbound Ports**:
   - Inbound ports model pure use case interfaces.
   - Outbound ports model gateway/repository contracts implemented by infrastructure adapters.
3. **Anti-Corruption Layer (ACL)**:
   - User interfaces must NEVER bind directly to infrastructure or raw database schemas.
   - The frontend communicates solely through a typed Anti-Corruption Layer, ensuring that swapping the backend implementation requires zero UI changes.
