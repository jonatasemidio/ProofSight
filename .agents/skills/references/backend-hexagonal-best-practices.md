# Backend Hexagonal Architecture & Domain-Driven Design (DDD) Best Practices

> **Authoritative Reference**: Architectural standard for Mendly backend services, guaranteeing DDD purity, Ports & Adapters decoupling, Anti-Corruption Layer (ACL), and deterministic policy execution.

---

## 1. Hexagonal Core (Ports & Adapters) Principles

The backend architecture separates enterprise business rules from frameworks, user interfaces, databases, and third-party SaaS services.

```
       +--------------------------------------------------------------+
       |                     EXTERNAL WORLD                           |
       |  Next.js API Routes / Spring Boot REST Controllers / Lambdas |
       +------------------------------+-------------------------------+
                                      | calls via Inbound Port
                                      v
       +--------------------------------------------------------------+
       |                     INBOUND PORTS                            |
       |   ResolveTransactionPort | IngestEventPort | OptOutCustomerPort |
       +------------------------------+-------------------------------+
                                      |
                                      v
+=============================================================================+
|                             DOMAIN CORE                                     |
|  * Pure Entities: Opportunity, Quote, Resolution, AuditRecord               |
|  * Value Objects: ObstacleClassification, Money, TerminalState              |
|  * Deterministic Policy Rules: R01–R45 Policy Engine                        |
|  * Domain Events: ResolutionProposed, TransactionCompleted                 |
|  * ZERO DEPENDENCIES (No AWS SDK, No Prisma/TypeORM, No HTTP, No React)     |
+=============================================================================+
                                      |
                                      v
       +--------------------------------------------------------------+
       |                     OUTBOUND PORTS                           |
       |   TransactionRepoPort | CommunicationPort | BedrockDiagnosisPort|
       +------------------------------+-------------------------------+
                                      | implemented by
                                      v
       +--------------------------------------------------------------+
       |                     ADAPTERS                                 |
       |   DynamoDB / In-Memory Adapter | AWS SES / EUM Adapter       |
       |   Bedrock Claude Adapter        | Merchant ERP Adapter       |
       +--------------------------------------------------------------+
```

---

## 2. Invariant Rules for Domain Core

1. **Pure Types Only**:
   - The Domain Core may only import standard TypeScript/JavaScript primitives or internal pure domain modules.
   - Any import of `@aws-sdk/*`, `fs`, `fetch`, `axios`, `next/*`, or external frameworks inside `src/core/` is an architectural violation.

2. **Deterministic Sovereignty (R01–R45)**:
   - AI models (Amazon Bedrock) are treated as **untrusted suggestion engines**. They may classify text or draft messages, but their outputs must pass through the deterministic `PolicyEngine`.
   - The `PolicyEngine` enforces business rules R01 through R45 deterministically. If an AI proposes an action that violates policy (e.g. discounting beyond authorized threshold, unsolicited messaging after opt-out), the policy engine rejects it with a deterministic code.

3. **Value Object Immutability**:
   - Entities (`Opportunity`, `Transaction`) have unique IDs and lifecycles.
   - Value Objects (`Money`, `ObstacleClassification`, `TerminalState`) are immutable and validated on instantiation.

4. **Idempotency & Auditing**:
   - Every state-mutating command MUST require an `idempotencyKey`.
   - Re-executing a command with the same `idempotencyKey` must return the previously computed outcome without re-triggering side effects.
   - Every intervention must emit an immutable `AuditRecord`.

---

## 3. The Anti-Corruption Layer (ACL) for Backend Swappability

The React frontend communicates with the backend solely through an Anti-Corruption Layer:

```typescript
// Example Inbound Port Interface
export interface ResolveTransactionPort {
  resolve(command: ResolveTransactionCommand): Promise<ResolutionResult>;
}

// Example Command
export interface ResolveTransactionCommand {
  idempotencyKey: string;
  opportunityId: string;
  customerId: string;
  selectedInterventionId: string;
  consentedAt: string;
}

// Example Result
export interface ResolutionResult {
  transactionId: string;
  terminalState: TerminalState;
  appliedIntervention: Intervention;
  auditId: string;
}
```

### Future Java / Spring Boot Portability
By maintaining this Hexagonal boundary:
- The React frontend speaks to an HTTP REST ACL adapter (`HttpResolutionClient`).
- Today, the adapter calls Next.js route handlers (`/api/resolve`).
- Tomorrow, swapping to an enterprise Java (Spring Boot / Quarkus) backend requires changing ONLY the HTTP base URL and keeping the DTO schema identical. **Zero frontend code is rewritten.**

---

## 4. Testing Matrix for Hexagonal Systems

1. **Domain Unit Tests (`tests/core/`)**:
   - Test pure business logic, invariants, and R01–R45 rules in memory.
   - Fast, zero I/O, execute in milliseconds with Vitest.
2. **Adapter Contract Tests (`tests/adapters/`)**:
   - Verify that adapters fulfill outbound port contracts using mock or local service containers.
3. **End-to-End Application Tests (`tests/application/`)**:
   - Wire in-memory or integration adapters to inbound ports and verify the entire user journey.
