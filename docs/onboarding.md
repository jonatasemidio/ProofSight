# ProofSight — Comprehensive System Audit & Onboarding Guide

> **Holistic Audit Authority**: Verified by Master SDLC Orchestrator. Integrates architectural inspections, automated slow-motion (600ms) demonstration videos, and 100% closed-loop affirmation traceability across code and tests.

---

## 1. Executive System Audit (5-Point Certification)

| Audit Dimension | Standard / Invariant | Status | Verification Evidence |
| :--- | :--- | :---: | :--- |
| **1. Traceability Closure** | 0 orphan affirmations; 100% story & task coverage; ≥95% gate | **CERTIFIED** | [Affirmation Matrix](file:///Users/jonatassouza/bin/dev/ProofSight/docs/affirmation-matrix.md): 173/173 linked, 0 unlinked, 100% gate pass. |
| **2. Domain Core Purity** | Pure TypeScript / JavaScript; ZERO external framework / cloud imports | **CERTIFIED** | [`src/domain/entities.js`](file:///Users/jonatassouza/bin/dev/ProofSight/src/domain/entities.js), [`policy-engine.js`](file:///Users/jonatassouza/bin/dev/ProofSight/src/domain/policy-engine.js) contain zero third-party dependencies. |
| **3. Policy Compliance** | Business rules BR-01 through BR-15 enforced deterministically | **CERTIFIED** | 21 unit tests passing with 100% branch coverage across policy and observation logic. |
| **4. Anti-Corruption Layer (ACL)** | Frontend UI decoupled from backend models and schemas | **CERTIFIED** | [`src/ui/acl/inspection-client.js`](file:///Users/jonatassouza/bin/dev/ProofSight/src/ui/acl/inspection-client.js) mediates all UI communication. |
| **5. E2E PO Demo Verification** | Playwright slowMo browser automation with video evidence | **CERTIFIED** | 3/3 Playwright tests passing; 3 slowMo demo presentations authored with embedded recordings. |

---

## 2. Hexagonal Architectural Architecture

ProofSight strictly separates perception measurement, agent reasoning, and deterministic business policy authorization:

```mermaid
graph TD
    subgraph UI_Layer ["Frontline UI & Presentation Layer"]
        A[Mobile-First Camera Viewport] --> B[InspectionClient ACL]
    end

    subgraph Inbound_Ports ["Inbound Ports (Application Layer)"]
        B --> C[InspectionService]
    end

    subgraph Pure_Domain ["Pure Domain Core (Isolated)"]
        C --> D[InspectionSession Aggregate]
        D --> E[DeterministicPolicyEngine BR-01..BR-15]
        D --> F[ObservationSelector Reasoning Agent]
        D --> G[ComponentFinding Entity]
    end

    subgraph Outbound_Adapters ["Outbound Driven Adapters"]
        C --> H[OpenCVPerceptionAdapter (OpenCV 5 Pipeline)]
        C --> I[StaticKitCatalog (8-Component Kit Template)]
    end
```

---

## 3. Executive Slow-Motion Demonstration Gallery

### 3.1 Adaptive Visual Evidence Acquisition (Occlusion -> Angle Guidance -> Approval)
When an item is partially occluded, ProofSight separates `UNRESOLVED` from `MISSING`, provides clear angular camera instructions, re-evaluates the secondary capture, and issues a deterministic cryptographic release certificate.

![Adaptive Occlusion Inspection Demo](./demos/media/demo-adaptive-occlusion.gif)

<video controls autoplay loop muted playsinline width="100%">
  <source src="./demos/media/demo-adaptive-occlusion.mp4" type="video/mp4">
  <source src="./demos/media/demo-adaptive-occlusion.webm" type="video/webm">
</video>

- **Detailed PO Presentation**: [demo-US-01-04-07-10.md](./demos/demo-US-01-04-07-10.md)

---

### 3.2 Image Quality Gate (Blurry Image Interception)
Under policy rule **BR-06**, photographs failing Laplacian variance (<100) or exposure thresholds are immediately intercepted, displaying plain-language corrective guidance.

![Image Quality Gate Demo](./demos/media/demo-quality-gate.gif)

<video controls autoplay loop muted playsinline width="100%">
  <source src="./demos/media/demo-quality-gate.mp4" type="video/mp4">
  <source src="./demos/media/demo-quality-gate.webm" type="video/webm">
</video>

- **Detailed PO Presentation**: [demo-US-05.md](./demos/demo-US-05.md)

---

### 3.3 Supervisor Exception Review & Audit-Traceable Human Override
Under policy rules **BR-10** and **BR-11**, supervisors can review disputed items and enter an override with mandatory justification, preserving original automated findings in the audit trail.

![Supervisor Exception Review Demo](./demos/media/demo-supervisor-override.gif)

<video controls autoplay loop muted playsinline width="100%">
  <source src="./demos/media/demo-supervisor-override.mp4" type="video/mp4">
  <source src="./demos/media/demo-supervisor-override.webm" type="video/webm">
</video>

- **Detailed PO Presentation**: [demo-US-11.md](./demos/demo-US-11.md)

---

## 4. Frontline Domain Primer & Ubiquitous Language

- **InspectionSession**: The aggregate root tracking observations, component findings, retry limits, and final release verdict.
- **ComponentFinding**: Lifecycle states: `NOT_OBSERVED` → `UNRESOLVED` → `VERIFIED` / `SUSPECTED_MISSING` → `CONFIRMED_MISSING` / `ESCALATED`.
- **DeterministicPolicyEngine**: Enforces rules BR-01 through BR-15 (separation of authority: AI proposes; policy authorizes).
- **ObservationSelector**: Solves the optimal action selection objective:
  $$\arg\max_a \left( \frac{\mathbb{E}[\text{uncertainty reduction}\mid a]}{\text{capture cost}(a)} \right)$$

---

## 5. Local Developer Runbook

### Run Unit Tests (TDD Domain Core & Adapters)
```bash
npm test
```
*Executes all 21 unit tests across entities, policy rules, agent observation selector, and OpenCV adapters.*

### Run Playwright Slow-Motion PO Acceptance Tests
```bash
npx playwright test
```
*Executes browser tests with 600ms slowMo delay and records video demonstrations to `test-results/`.*

### Start Local Web Application
```bash
npm run dev
```
*Launches Vite local dev server at `http://localhost:5173`.*

### Affirmation Matrix Audit & Synchronization
```bash
# Verify 95% Plan Affirmation Gate
node scripts/affirmation-tracer.mjs audit

# Synchronize Markdown representation from JSON
node scripts/affirmation-tracer.mjs sync
```
