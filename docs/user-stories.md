# ProofSight — User Stories (Mike Cohn / INVEST / SPIDR Standard)

> **Methodology Authority**: Formatted according to Mike Cohn (Mountain Goat Software) standards, rigorously assessed against INVEST criteria, decomposed using SPIDR splitting dimensions, and bidirectionally anchored to the Single Source of Truth Affirmation Matrix (`docs/affirmation-matrix.md`).

---

## US-01: Select an Inspection Template

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** to select the specific kit template being inspected from a catalog of approved kits,  
**So that** ProofSight initializes an inspection session with the exact required components, mandatory flags, and reference layout.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-001`, `AFM-002`, `AFM-003`, `AFM-017`, `AFM-025`, `AFM-089`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F03_PERSPECTIVE_MISALIGNMENT`
  - Target Terminal State: `CREATED`
  - Governing Policy Rules: `BR-01` (Approved inspection template)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Inspector selects an approved kit template
  Given an inspector is authenticated on the ProofSight web application
  When the inspector selects "Technician Kit A-104" (version 1.0.0)
  Then an InspectionSession is initialized with status "CREATED"
  And the 8 component requirements are loaded with names, quantities, and mandatory flags
  And the session audit log records the template ID and version timestamp

Scenario: Rejection of undefined kit template
  Given an inspector attempts to start an inspection without a valid template
  When the session initialization is submitted
  Then the system rejects the request with an error "BR-01: Approved template required"
  And no inspection session is created
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Interfaces`
- **Rationale**: Clean split between template catalog selection UI and internal session aggregate initialization.

---

## US-04: Analyze Initial Photograph with OpenCV 5

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** ProofSight to process my initial kit photograph using OpenCV 5 algorithms,  
**So that** I immediately receive deterministic visual measurements for blur, exposure, perspective alignment, and component findings.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-004`, `AFM-005`, `AFM-006`, `AFM-018`, `AFM-019`, `AFM-026`, `AFM-092`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F01_IMAGE_QUALITY_DEFECT`, `F03_PERSPECTIVE_MISALIGNMENT`
  - Target Terminal State: `ASSESSING`
  - Governing Policy Rules: `BR-02` (No unsupported approval), `BR-11` (Evidence traceability)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Clear initial photograph is successfully analyzed
  Given an active inspection session for "Technician Kit A-104"
  When the inspector captures and uploads a clear top-down image
  Then OpenCV 5 computes blur variance, intensity histogram, and homography alignment
  And components with sufficient feature match are marked "VERIFIED"
  And the session transitions to "ASSESSING"
  And bounding boxes and measurement metrics are recorded in the audit trail
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Spike`
- **Rationale**: Isolates OpenCV 5 geometric and perceptual pipeline as a pure port/adapter.

---

## US-05: Reject Inadequate Photographs via Quality Gate

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** ProofSight to immediately detect and reject blurry or poorly exposed images,  
**So that** unusable photographs are intercepted before wasting time or producing ungrounded findings.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-004`, `AFM-005`, `AFM-030`, `AFM-093`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F01_IMAGE_QUALITY_DEFECT`
  - Target Terminal State: `IN_PROGRESS`
  - Governing Policy Rules: `BR-06` (Image quality gate)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Blurry image is rejected by quality gate
  Given an active inspection session
  When an image with Laplacian blur variance < 100 is uploaded
  Then the system rejects the image under policy "BR-06: Image quality gate"
  And displays guidance: "Photograph is blurred (score: 42.1). Please hold camera steady and retake."
  And no component requirements transition to "VERIFIED"
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Rules`
- **Rationale**: Pure deterministic threshold evaluation isolated from higher-level item matching.

---

## US-06: Distinguish Invisible/Obscured Components from Missing

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** ProofSight to classify partially hidden or shadowed items as `UNRESOLVED` rather than `SUSPECTED_MISSING`,  
**So that** inspectors are not misled by false absence alerts when visibility is merely obstructed.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-006`, `AFM-012`, `AFM-013`, `AFM-027`, `AFM-094`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F02_PARTIAL_OCCLUSION`, `F04_UNRESOLVED_AMBIGUITY`
  - Target Terminal State: `ASSESSING`
  - Governing Policy Rules: `BR-03` (Unknown is not missing)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Obscured screwdriver is classified as UNRESOLVED
  Given an initial photograph where compartment 4 is partially obstructed by a cable
  When the OpenCV feature matcher detects occlusion indicators and partial coverage
  Then component "Precision Screwdriver" is marked "UNRESOLVED"
  And the finding explicitly notes "Obstruction detected — visibility insufficient for verification"
  And the system does NOT mark the item as "SUSPECTED_MISSING"
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Data`
- **Rationale**: Enforces 3-state distinction (verified, unresolved, suspected_missing).

---

## US-07: Request Next Best Targeted Observation

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** the agent to issue specific, targeted camera instructions (e.g. angle change or close-up) for unresolved components,  
**So that** I know exactly how to point my camera to resolve uncertainty without guessing.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-007`, `AFM-020`, `AFM-028`, `AFM-029`, `AFM-095`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F04_UNRESOLVED_AMBIGUITY`
  - Target Terminal State: `NEEDS_MORE_EVIDENCE`
  - Governing Policy Rules: `BR-04` (Evidence before assertion), `BR-05` (Adaptive guidance)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Agent requests angled view for partly obscured item
  Given an inspection session with 7/8 components verified and "Precision Screwdriver" unresolved
  When the agent observation selector evaluates the unresolved evidence
  Then the session status transitions to "NEEDS_MORE_EVIDENCE"
  And the agent outputs: "The precision screwdriver is partly hidden. Move your camera slightly to the right and capture another photo."
  And the UI highlights the target compartment and displays the requested action
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Paths`
- **Rationale**: Branches dynamically between happy-path single-shot vs multi-view adaptive path.

---

## US-08: Re-evaluate Evidence After Secondary Capture

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** ProofSight to synthesize new photographs with previous observations,  
**So that** previously unresolved items are updated without discarding already-verified components.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-004`, `AFM-006`, `AFM-014`, `AFM-037`, `AFM-096`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F04_UNRESOLVED_AMBIGUITY`
  - Target Terminal State: `ASSESSING`
  - Governing Policy Rules: `BR-13` (Duplicate evidence), `BR-14` (Conflicting evidence)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Follow-up photograph resolves previously obscured component
  Given an inspection where "Precision Screwdriver" was UNRESOLVED
  When the inspector captures the requested angled photograph
  Then OpenCV extracts features from the targeted region
  And "Precision Screwdriver" transitions from "UNRESOLVED" to "VERIFIED"
  And previously verified components maintain their verified status
  And both observations are immutably linked in the session evidence record
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Data`
- **Rationale**: Multi-observation state accumulation and cross-image alignment.

---

## US-09: Enforce Attempt Limits and Terminate Unproductive Loops

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** the system to stop requesting photographs after reaching the configured attempt limit,  
**So that** inspections do not enter infinite loops and uncertain kits are escalated safely to human supervisors.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-008`, `AFM-016`, `AFM-031`, `AFM-097`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F06_UNPRODUCTIVE_LOOP`
  - Target Terminal State: `REVIEW_REQUIRED`
  - Governing Policy Rules: `BR-07` (Maximum retries)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Reaching maximum attempt limit triggers escalation
  Given an inspection session that has reached 3 attempts with 1 mandatory item remaining UNRESOLVED
  When the latest capture fails to provide conclusive evidence
  Then the policy engine invokes rule "BR-07: Maximum retries (limit: 3)"
  And the inspection session transitions to "REVIEW_REQUIRED"
  And the UI displays: "Maximum capture attempts reached. Escalating to supervisor review."
  And automatic approval is strictly prevented
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Rules`
- **Rationale**: Invariant counter threshold enforcement.

---

## US-10: Issue Deterministic Policy-Governed Final Verdict

### 1. Cohn User Story Narrative
**As an** equipment inspector,  
**I want** ProofSight's Deterministic Policy Engine to evaluate all findings and issue an authoritative final verdict (`PASSED`, `REVIEW_REQUIRED`, or `FAILED`),  
**So that** equipment is released only when all mandatory evidence requirements are verified according to business policy.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-008`, `AFM-010`, `AFM-021`, `AFM-033`, `AFM-098`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F05_CONFIRMED_DEFECT_OR_ABSENCE`
  - Target Terminal State: `PASSED`, `REVIEW_REQUIRED`, `FAILED`
  - Governing Policy Rules: `BR-08` (No fabricated confidence), `BR-09` (Mandatory item enforcement), `BR-12` (Separation of authority), `BR-15` (No unsafe autonomy)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Automatic approval when all mandatory items are verified
  Given an inspection where all 8 mandatory components are in state "VERIFIED"
  When the inspector requests final verdict evaluation
  Then the Deterministic Policy Engine verifies all BR-01 through BR-15 invariants
  And transitions the session to "PASSED"
  And generates an immutable cryptographic inspection certificate

Scenario: Prevention of automatic pass when mandatory item is missing or unresolved
  Given an inspection where 1 mandatory component is "UNRESOLVED" or "SUSPECTED_MISSING"
  When final verdict evaluation is requested
  Then the system refuses "PASSED" under rule "BR-09: Mandatory item enforcement"
  And marks the session as "REVIEW_REQUIRED"
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Rules`
- **Rationale**: Separation between automated algorithmic findings and policy authorization.

---

## US-11: Supervisor Review and Traceable Human Override

### 1. Cohn User Story Narrative
**As a** quality supervisor,  
**I want** to examine unverified or disputed visual findings and record an authorized override with reviewer ID and justification,  
**So that** operations can resolve edge cases safely while preserving complete accountability and audit history.

### 2. Affirmation Traceability Anchor
- **Linked Affirmation IDs**: `AFM-009`, `AFM-016`, `AFM-034`, `AFM-099`
- **Domain Ontology Anchor**:
  - Target Classification/Obstacle: `F04_UNRESOLVED_AMBIGUITY`
  - Target Terminal State: `PASSED`, `FAILED`
  - Governing Policy Rules: `BR-10` (Human control), `BR-11` (Evidence traceability)

### 3. Acceptance Criteria (Gherkin BDD Format)
```gherkin
Scenario: Supervisor overrides unverified item with audit reason
  Given an inspection in "REVIEW_REQUIRED" with "Precision Screwdriver" UNRESOLVED
  When a quality supervisor reviews the photos and enters reason "Verified physically present by inspector badge #44"
  Then the component status is updated with a recorded HumanOverride
  And the automated OpenCV finding is preserved in history
  And the session status transitions to "PASSED (OVERRIDDEN)"
  And the audit trail stores reviewer ID, timestamp, and rationale
```

### 4. INVEST Quality Assessment
- [x] **Independent** | [x] **Negotiable** | [x] **Valuable** | [x] **Estimable** | [x] **Small** | [x] **Testable**

### 5. SPIDR Splitting Strategy
- **Splitting Dimension**: `Paths`
- **Rationale**: Supervisor exception handling and override authorization.
