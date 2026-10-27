# ProofSight — Hexagonal Architectural Tasks Decomposition

> **Architectural Authority**: Designed according to Hexagonal Architecture (Ports & Adapters), Domain-Driven Design (DDD), and Anti-Corruption Layer (ACL) principles. All domain logic is isolated in a pure Domain Core with zero framework dependencies.

---

## TASK-001: Pure Domain Core Entities, Value Objects & State Machines

### 1. Traceability & Context
- **Linked User Story**: [US-01](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-01), [US-06](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-06)
- **Linked Affirmations**: `AFM-001`, `AFM-002`, `AFM-003`, `AFM-004`, `AFM-005`, `AFM-006`, `AFM-011`, `AFM-012`, `AFM-013`, `AFM-014`, `AFM-015`, `AFM-016`
- **Architectural Layer**: `Domain Core Entity & Value Objects`

### 2. Hexagonal Boundary & Invariants
- **Layer Isolation Guarantee**: ZERO external imports. Pure TypeScript / JavaScript types, classes, and pure functions only.
- **Idempotency & Auditing**:
  - Every mutation on `InspectionSession` appends an immutable `AuditEntry`.
  - State machine transitions strictly enforce permitted transitions from `docs/ontology.md`.

### 3. Interface & Contract Specification
```typescript
export type ComponentStatus = 
  | 'NOT_OBSERVED' 
  | 'UNRESOLVED' 
  | 'SUSPECTED_MISSING' 
  | 'VERIFIED' 
  | 'CONFIRMED_MISSING' 
  | 'ESCALATED';

export type InspectionSessionStatus = 
  | 'CREATED' 
  | 'IN_PROGRESS' 
  | 'ASSESSING' 
  | 'NEEDS_MORE_EVIDENCE' 
  | 'PASSED' 
  | 'REVIEW_REQUIRED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface ComponentRequirement {
  id: string;
  name: string;
  quantity: number;
  isMandatory: boolean;
  expectedRegion: { x: number; y: number; width: number; height: number };
  referenceFeatures?: string[];
}

export interface KitTemplate {
  id: string;
  name: string;
  version: string;
  components: ComponentRequirement[];
  referenceImageUri: string;
}

export interface VisualMeasurement {
  blurVariance: number;
  exposureMean: number;
  featureMatches: number;
  coverageRatio: number;
  isOccluded: boolean;
}

export interface ComponentFinding {
  componentId: string;
  status: ComponentStatus;
  evidenceScore: number;
  supportingObservationId?: string;
  occlusionReason?: string;
}
```

### 4. Implementation Checklist
- [ ] 1. Author failing unit test in `test/domain/entities.spec.js` (TDD Red).
- [ ] 2. Implement pure domain entities and value objects in `src/domain/entities.js`.
- [ ] 3. Verify zero external dependencies and 100% test pass.
- [ ] 4. Link affirmations to `TASK-001`.

---

## TASK-002: Deterministic Policy Engine (Business Rules BR-01 to BR-15)

### 1. Traceability & Context
- **Linked User Story**: [US-05](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-05), [US-09](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-09), [US-10](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-10), [US-11](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-11)
- **Linked Affirmations**: `AFM-008`, `AFM-010`, `AFM-025`, `AFM-026`, `AFM-027`, `AFM-030`, `AFM-031`, `AFM-033`, `AFM-034`, `AFM-098`, `AFM-099`
- **Architectural Layer**: `Domain Core Policy Engine`

### 2. Hexagonal Boundary & Invariants
- **Layer Isolation Guarantee**: Pure deterministic policy functions. No external I/O or network calls.
- **Rules Invariants**:
  - `BR-01`: Inspection must reference an approved versioned kit template.
  - `BR-02`: No component may be marked `VERIFIED` without visual evidence above threshold.
  - `BR-03`: Ambiguous/obscured components MUST resolve to `UNRESOLVED`, never `SUSPECTED_MISSING`.
  - `BR-06`: Quality gate rejects images with `blurVariance < 100` or extreme exposure.
  - `BR-07`: Maximum retries enforced (default: 3). If exceeded, escalate to `REVIEW_REQUIRED`.
  - `BR-09`: Session cannot pass if any mandatory item is not `VERIFIED`.
  - `BR-10`: Human override records supervisor ID, timestamp, and reason, preserving automated findings.

### 3. Interface & Contract Specification
```typescript
export interface PolicyEvaluationResult {
  allowed: boolean;
  ruleId: string;
  reason: string;
  nextStatus?: InspectionSessionStatus;
}

export class DeterministicPolicyEngine {
  static evaluateQualityGate(measurement: VisualMeasurement): PolicyEvaluationResult;
  static evaluateComponentFinding(req: ComponentRequirement, measurement: VisualMeasurement): ComponentStatus;
  static evaluateSessionVerdict(session: InspectionSession): InspectionVerdict;
  static applyHumanOverride(session: InspectionSession, override: HumanOverride): InspectionSession;
}
```

### 4. Implementation Checklist
- [ ] 1. Author failing unit tests in `test/domain/policy-engine.spec.js` (TDD Red).
- [ ] 2. Implement `DeterministicPolicyEngine` enforcing BR-01 to BR-15 in `src/domain/policy-engine.js`.
- [ ] 3. Verify all rules with unit tests.
- [ ] 4. Link affirmations to `TASK-002`.

---

## TASK-003: Agentic Evidence Acquisition & Next Observation Selector

### 1. Traceability & Context
- **Linked User Story**: [US-07](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-07), [US-08](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-08)
- **Linked Affirmations**: `AFM-007`, `AFM-020`, `AFM-028`, `AFM-029`, `AFM-037`, `AFM-095`, `AFM-096`
- **Architectural Layer**: `Domain Core / Reasoning Agent`

### 2. Hexagonal Boundary & Invariants
- **Layer Isolation Guarantee**: Implements decision objective maximizing expected uncertainty reduction over capture cost:
  `a* = argmax (E[uncertainty_reduction | a] / capture_cost(a))`.
- **Targeted Action Types**:
  - `RETAKE_IMAGE`: When image fails quality gate (blur/exposure).
  - `CHANGE_ANGLE`: When item is partly occluded by another tool.
  - `CLOSER_VIEW`: When item is too small or resolution insufficient.
  - `ESCALATE_TO_SUPERVISOR`: When retry limit is reached.
  - `FINALIZE_PASS`: When all mandatory items are verified.

### 3. Interface & Contract Specification
```typescript
export interface AgentGuidance {
  actionType: 'RETAKE_IMAGE' | 'CHANGE_ANGLE' | 'CLOSER_VIEW' | 'ESCALATE_TO_SUPERVISOR' | 'FINALIZE_PASS';
  targetComponentId?: string;
  targetComponentName?: string;
  guidanceMessage: string;
  rationale: string;
}

export class ObservationSelector {
  static selectNextAction(session: InspectionSession): AgentGuidance;
}
```

### 4. Implementation Checklist
- [ ] 1. Author failing unit tests in `test/domain/observation-selector.spec.js` (TDD Red).
- [ ] 2. Implement `ObservationSelector` in `src/domain/observation-selector.js`.
- [ ] 3. Validate dynamic branch behavior (different inputs yield different actions).
- [ ] 4. Link affirmations to `TASK-003`.

---

## TASK-004: Inbound Ports & Inspection Application Service

### 1. Traceability & Context
- **Linked User Story**: [US-01](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-01), [US-04](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-04), [US-10](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-10)
- **Linked Affirmations**: `AFM-001`, `AFM-004`, `AFM-008`, `AFM-025`, `AFM-026`, `AFM-033`
- **Architectural Layer**: `Inbound Ports & Application Service`

### 2. Hexagonal Boundary & Invariants
- **Inbound Ports**:
  - `startInspection(templateId: string): Promise<InspectionSession>`
  - `submitCapture(inspectionId: string, imageBuffer: Buffer, metadata?: any): Promise<InspectionSession>`
  - `getNextGuidance(inspectionId: string): Promise<AgentGuidance>`
  - `evaluateVerdict(inspectionId: string): Promise<InspectionVerdict>`
  - `overrideComponent(inspectionId: string, override: HumanOverride): Promise<InspectionSession>`
- **Idempotency & Auditing**: Emits audit records for every step.

### 3. Implementation Checklist
- [ ] 1. Author test in `test/application/inspection-service.spec.js`.
- [ ] 2. Implement `InspectionService` coordinating domain entities and ports in `src/application/inspection-service.js`.
- [ ] 3. Link affirmations to `TASK-004`.

---

## TASK-005: Outbound Perception Engine & Template Adapters (OpenCV 5 Pipeline)

### 1. Traceability & Context
- **Linked User Story**: [US-04](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-04), [US-05](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-05)
- **Linked Affirmations**: `AFM-004`, `AFM-005`, `AFM-030`, `AFM-092`, `AFM-093`
- **Architectural Layer**: `Outbound Adapter (Perception Engine)`

### 2. Hexagonal Boundary & Invariants
- Implements `PerceptionEnginePort`.
- Performs real mathematical OpenCV measurements:
  - Laplacian variance calculation for blur.
  - Luminance intensity histogram for exposure.
  - Template matching / feature distance for component compartments.
  - Occlusion coverage calculation.

### 3. Implementation Checklist
- [ ] 1. Author test in `test/adapters/perception-adapter.spec.js`.
- [ ] 2. Implement OpenCV measurement pipeline in `src/adapters/perception-adapter.js`.
- [ ] 3. Implement `StaticKitCatalog` adapter with "Technician Kit A-104" (8 components) in `src/adapters/kit-catalog.js`.
- [ ] 4. Link affirmations to `TASK-005`.

---

## TASK-006: Frontend Anti-Corruption Layer (ACL) & State Store

### 1. Traceability & Context
- **Linked User Story**: [US-01](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-01), [US-04](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-04), [US-07](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-07), [US-10](file:///Users/jonatassouza/bin/dev/ProofSight/docs/user-stories.md#US-10)
- **Linked Affirmations**: `AFM-001`, `AFM-006`, `AFM-007`, `AFM-010`
- **Architectural Layer**: `Frontend ACL`

### 2. Hexagonal Boundary & Invariants
- Exposes typed DTO client isolating React UI from backend schemas.
- Maps internal findings to user-friendly guided UI representations.

### 3. Implementation Checklist
- [ ] 1. Implement Frontend ACL in `src/ui/acl/inspection-client.js`.
- [ ] 2. Link affirmations to `TASK-006`.
