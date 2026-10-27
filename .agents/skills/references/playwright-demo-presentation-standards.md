# Playwright Acceptance Testing & Executive DEMO Presentation Standards

> **Authoritative Reference**: Standard for automating PO acceptance verification via Playwright, generating slow-motion scenario video captures, and creating executive stakeholder DEMO presentations.

---

## 1. Playwright Test Simulation & Slow-Motion Configuration

Acceptance tests authored under the PO perspective are not just regression guards—they are **living product demonstrations**.

### Slow-Motion & Video Recording Configuration
```typescript
// playwright.config.ts or test-scoped context
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on',
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    // slowMo adds human-readable pacing so that videos serve as high-clarity demos
    launchOptions: {
      slowMo: 600, // 600ms delay between actions
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## 2. Structure of an Executive DEMO Presentation Markdown

Every tested User Story produces a dedicated DEMO markdown file (e.g., `docs/demos/demo-US-001.md`).

### Presentation Template

```markdown
# DEMO: <US-XXX Title> — Customer Resolution Journey

> **Executive Summary**: Real-time demonstration of how Mendly resolves financial friction for an abandoned €4,800 heat-pump installation quote via an instant 3-month installment plan.

---

## 1. Business Context & Persona Narrative
- **Persona**: Alex Schneider, homeowner who received a €4,800 installation quote but hesitated due to upfront lump-sum payment friction.
- **Obstacle Addressed**: `FINANCIAL_CONSTRAINTS` (Obstacle 1/12).
- **Target Terminal State**: `COMPLETED`.
- **Governing Policy Rules**: R01 (Detection), R14 (Transparent Pricing), R28 (Consent Before Commitment).

---

## 2. Video Demonstration (Slow-Motion Walkthrough)

![Slow-Motion Demo Video](/docs/media/demos/demo-US-001.webm)

*Paced at 600ms per interaction to illustrate visual micro-animations, price recalculation, and instant confirmation.*

---

## 3. Step-by-Step Scenario Storyboard

| Step | User Action | UI State / Visual Feedback | Policy & System Assertion | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Lands on unique resolve link | Resolve Micro-UI displays quote summary (€4,800) | Token validated, opportunity active | PASSED |
| 2 | Reviews 3 payment choices | 3-month plan highlighted (€1,600/mo) | R14: Zero hidden fee breakdown shown | PASSED |
| 3 | Selects 3-month plan | Card activates with spring animation & border | State stored in frontend ACL | PASSED |
| 4 | Clicks "Confirm Plan" | Button enters loading spinner, calls API | Inbound port invoked with Idempotency Key | PASSED |
| 5 | Success confirmation displayed | Schedule table & download button appear | Terminal state: `COMPLETED`, Audit emitted | PASSED |

---

## 4. Acceptance Criteria Verification Scorecard

| Scenario ID | Description | Assertion Count | Execution Time | Result |
| :--- | :--- | :---: | :---: | :---: |
| **AC-01** | Display Quote & Installment Breakdown | 4 assertions | 1.84s | **PASSED** |
| **AC-02** | Installment Selection & Idempotent Submission | 5 assertions | 2.61s | **PASSED** |
| **AC-03** | Opt-Out Alternative Path | 3 assertions | 1.42s | **PASSED** |

---

## 5. Traceability Anchor
- **Linked User Story**: [US-001](file:///Users/jonatassouza/bin/dev/mendley/docs/user-stories.md#US-001)
- **Affirmations Verified**: `AFM-012`, `AFM-015`, `AFM-028`
- **Playwright Test File**: `tests/e2e/resolve-quote-installment.spec.ts`
```
