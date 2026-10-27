---
name: senior-po-playwright-tester
description: >-
  Simulates PO acceptance testing via Playwright browser automation with slow-motion
  video recording, generating executive DEMO presentation markdown artifacts and
  updating the Affirmation Matrix to VERIFIED_E2E.
---

# Senior PO Playwright Acceptance Tester & DEMO Producer Skill (Generic / Reusable)

> **Universal Architecture**: This skill is **project-agnostic**. It automates Product Owner acceptance testing using **Playwright slow-motion browser simulation** and produces **Executive DEMO Presentation Markdowns** for *any* web application project.

---

## 1. Generic vs. Project-Specific Separation

| Component | Nature | Description / Location |
| :--- | :---: | :--- |
| **Playwright SlowMo Protocol** | **Generic** | Configured `slowMo` delay (default 600ms) and automated video capture. |
| **Executive DEMO Template** | **Generic** | Executive Summary, Video Walkthrough Embed, Step-by-Step Storyboard Table, Gherkin AC Scorecard, Traceability Anchor. |
| **E2E Test Specs & Flows** | **Project-Specific** | Written against the specific project's routes and user stories (`docs/user-stories.md`). |
| **Deliverable Target Directory** | **Project-Specific** | Read from `project.config.json` (`deliverables.demoPresentationsDirectory`, default: `docs/demos`). |

---

## 2. Execution Protocol

### Step 1: Discover Project Test Configuration
1. Read `project.config.json` -> Locate `testing.e2eTestRunner`, `testing.slowMoDelayMs`, and `deliverables.demoPresentationsDirectory`.
2. Ensure Playwright is configured with video recording enabled and `slowMo`.

### Step 2: Author & Execute Acceptance Test
Author test with Given/When/Then assertions directly verifying the user story scenarios.

### Step 3: Author Executive DEMO Presentation Markdown
Generate `docs/demos/demo-US-XXX.md` following the universal presentation standard:
1. **Executive Summary**: Business problem, persona narrative, quantifiable value recovered/delivered.
2. **Slow-Motion Video Demonstration**: Direct embed of the recorded `.webm`/`.mp4` video.
3. **Step-by-Step Storyboard**: Table detailing Step Number, Customer Action, Visual UI State, System/Policy Assertion, and Result.
4. **Acceptance Criteria Verification Scorecard**: Audit of automated assertions against Cohn scenarios.
5. **Traceability Anchors**: Links to Story, Tech Tasks, and Affirmation IDs.

### Step 4: Trigger Affirmation Synchronization
Immediately update the Affirmation Matrix:
```bash
node scripts/affirmation-tracer.mjs update-status <AFM-ID> VERIFIED_E2E docs/demos/demo-US-XXX.md
```
