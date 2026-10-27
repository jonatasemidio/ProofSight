# 🎯 ProofSight — Hackathon Judge & Organizer Evaluation Dossier

**Project:** ProofSight — Autonomous Visual Evidence Agent  
**Category / Track:** OpenCV AI Competition 2026 — Agentic Vision  
**GitHub Repository:** [github.com/jonatasemidio/ProofSight](https://github.com/jonatasemidio/ProofSight)  
**Live Demo Video:** `media/proofsight-demo-walkthrough.mp4` (Included in this ZIP, 38.6s, 1440x900 H.264)  
**Release Readiness:** 100% Affirmation Gate Pass (173/173 Atomic Affirmations Verified)  

---

## 📌 Executive Summary
In mission-critical equipment handling and frontline manufacturing, conventional computer vision systems fail under visual ambiguity: when a tool is shadowed or occluded, one-shot classifiers hallucinate or trigger costly false "missing item" alarms.

**ProofSight** is an **Autonomous Visual Evidence Agent** that separates **"unknown"** from **"missing"**. Instead of guessing from an imperfect angle, ProofSight:
1. Actively measures line-of-sight obstruction and predicts required viewing vectors.
2. Projects a **3D Artificial Horizon & Pitch Inclinometer HUD** directly over the camera feed to guide technicians to the exact angle needed (+18° pitch tilt).
3. Fuses multi-view observations into an evidence belief state.
4. Enforces a **deterministic policy engine** (pure domain core) and issues cryptographic **SHA-256 Airworthiness Release Certificates** with immutable audit logging.

---

## ⚡ 60-Second Quickstart for Judges

You can run ProofSight locally in 2 ways:

### Option A: Standard Local Run (Node.js 18+)
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite dev server
npm run dev
# -> Opens http://localhost:5173
```

### Option B: 1-Click Docker Compose (Frontend + OpenCV FastAPI Backend)
```bash
docker-compose up --build
# Frontend UI: http://localhost:5173
# OpenCV Backend API: http://localhost:8000/docs
```

### Option C: Run Automated Acceptance Tests (Playwright SlowMo)
```bash
npx playwright test
# Runs 3 end-to-end acceptance tests simulating real operator flows with video recording
```

---

## 📊 Key Evaluation Benchmark Highlights

From our rigorous 30-case empirical benchmark ([`docs/evaluation-report.md`](./docs/evaluation-report.md)):

| Metric | Industry Baseline (One-Shot CV) | ProofSight (Agentic Vision) |
|---|---|---|
| **False Rejection Rate (Type I Error)** | 23.3% (7 false alarms) | **0.0% (Zero false rejections)** |
| **Occlusion Resolution Rate** | 0.0% (Stuck at occlusion) | **100.0% (All resolved via guidance)** |
| **Optical Blur Quality Gate** | Permissive (Risks false pass) | **100% Deterministic Rejection** |
| **Tamper-Evident SHA-256 Audit Trail** | None (Ad-hoc logging) | **Cryptographic Release Certificate** |

---

## 🏗️ Architecture & Domain Isolation

ProofSight follows strict **Hexagonal Architecture (Ports & Adapters)** and **Domain-Driven Design (DDD)**:

```
src/
├── domain/                    # Pure Domain Core (Zero external UI or framework dependencies)
│   ├── entities.js            # Toolkit, Observation, Evidence, ReleaseVerdict
│   ├── policy-engine.js       # Deterministic business rules (BR-01 through BR-10)
│   └── observation-selector.js# Multi-view Bayesian belief state fusion
├── application/               # Application Orchestrator
│   └── inspection-service.js  # Coordinates perception, policy, and certificates
├── adapters/                  # Secondary Adapters
│   ├── perception-adapter.js  # OpenCV 5 blur variance, luminance & ORB keypoints
│   └── kit-catalog.js         # Digital twin kit schemas
└── ui/                        # Primary Driving Adapter (React 18 + CSS)
    ├── components/            # Dual-station cockpit, AR overlay, Inclinometer HUD
    └── acl/                   # Anti-Corruption Layer translating UI events to Domain
```

---

## 📂 Package Contents (This ZIP File)

1. **`JUDGE_DOSSIER.md`**: This evaluation guide.
2. **`README.md`**: Project overview, feature breakdown, and developer documentation.
3. **`media/proofsight-demo-walkthrough.mp4`**: 38-second slow-motion MP4 demo with glowing cursor tracking, element highlighting, step narrative HUD, and soundtrack.
4. **`gallery/`**: 10 high-resolution (2250x1500) 3:2 ratio screenshots capturing each stage of the inspection lifecycle.
5. **`docs/`**:
   - `evaluation-report.md`: 30-case benchmark report.
   - `affirmation-matrix.md` & `affirmation-matrix.json`: 173 verifiable requirements mapped to code.
   - `user-stories.md`: Mike Cohn INVEST user stories.
   - `technical-tasks.md`: Architectural decomposition.
6. **`src/` & `server/`**: Complete source code for both the React Cockpit and OpenCV FastAPI microservice.
7. **`docker-compose.yml` & `Dockerfile.frontend`**: Containerized deployment configurations.

---

## 🏆 Summary Checklist for Reviewers
- [x] **Agentic Vision:** Active angle guidance with 3D artificial horizon inclinometer.
- [x] **Deterministic Safety:** Pure domain policy engine with zero hallucinations.
- [x] **Auditability:** Cryptographic SHA-256 certificate generation.
- [x] **Enterprise Ready:** Real OpenCV 5 blur rejection, mobile orientation compatibility, and dual-station cockpit UX.
