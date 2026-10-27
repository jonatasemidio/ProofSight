# ProofSight — Design System Component Specifications (6-State Standard)

> **Cross-Functional Authority**: Authored collaboratively by Senior Product Owner (PO) and Senior Frontend UI/UX Architect. Enforces WCAG 2.1 AA/AAA compliance, mobile-first ergonomics, zero cumulative layout shift (CLS), and exhaustive 6-state coverage for every frontline component.

---

## 1. Design Principles &Frontline Inspector Ergonomics

1. **Camera-First, Not Chat-First**: The technician holds a smartphone with one gloved hand; interactions must rely on bold camera overlays, high-contrast badges, and tactile tactile buttons (min 48px touch targets).
2. **Deterministic Clarity**: The system never displays confusing technical jargon (e.g. "homography error", "Laplacian variance"); it provides clear, plain-language operational guidance (e.g. "Image blurred. Please hold steady.").
3. **Continuous Affirmation of State**: The inspector always sees verified vs. unresolved ratios (e.g. "6/8 verified • 1 needs another view").

---

## 2. Exhaustive 6-State Component Specifications

### 2.1 Component: `CameraCaptureViewport`
The primary viewfinder that captures kit photographs, displays target compartment bounding boxes, and shows live blur/exposure feedback.

| State | Visual Behavior | Accessibility (A11y) & Aria |
| :--- | :--- | :--- |
| **1. Default / Resting** | Live video feed with cyan guide reticles (`#00e5ff`) indicating kit boundary. | `aria-label="Inspection camera feed"`, `role="region"` |
| **2. Hover / Focus** | Reticle border transitions to pulsating cyan glow (`boxShadow.cyanGlow`). | `outline: 2px solid #00e5ff`, focus-visible indicator |
| **3. Active / Pressed** | Viewport snaps with 120ms white flash simulation upon shutter trigger. | Haptic feedback vibration (`navigator.vibrate(50)`) |
| **4. Disabled** | Monochrome translucent overlay (`background.overlay`), shutter button dimmed at 40% opacity. | `aria-disabled="true"`, non-interactive |
| **5. Loading / Skeleton** | Shimmering gradient overlay during OpenCV alignment and feature extraction. | `aria-busy="true"`, `aria-live="polite"` "Analyzing image..." |
| **6. Error / Fallback** | Red translucent border (`#ff1744`), inline banner explaining camera permission refusal or stream error. | `role="alert"`, descriptive retry button |

---

### 2.2 Component: `ComponentFindingCard`
Displays an individual kit component, expected compartment, current verification badge, and visual evidence confidence.

| State | Visual Behavior | Accessibility (A11y) & Aria |
| :--- | :--- | :--- |
| **1. Default / Resting** | Sleek glassmorphism card (`background.glass`) with component name, quantity, and status badge. | `role="listitem"`, semantic heading level 4 |
| **2. Hover / Focus** | Card subtly lifts (`transform: translateY(-2px)`), border illuminates to brand indigo. | Tab-focusable with high-contrast outline |
| **3. Active / Pressed** | Scale micro-animation (`scale(0.98)`), expands compartment detail panel. | `aria-expanded="true"` |
| **4. Disabled** | Greyscale filter (50%), pointer-events disabled. | `aria-disabled="true"` |
| **5. Loading / Skeleton** | Pulsing skeleton placeholder matching typography line heights. | `aria-hidden="true"` skeleton container |
| **6. Error / Fallback** | Red accent line (`border-left: 3px solid #ff1744`), displays "Missing / Occluded" alert. | `aria-live="assertive"` |

---

### 2.3 Component: `AgentGuidanceBanner`
The ambient agent guidance card that explains what missing evidence is required and gives specific camera directions.

| State | Visual Behavior | Accessibility (A11y) & Aria |
| :--- | :--- | :--- |
| **1. Default / Resting** | Dark blue glass surface (`#101622`) with glowing cyan accent icon and actionable text. | `role="status"`, `aria-live="polite"` |
| **2. Hover / Focus** | Border lightens to `#334566`, clickable hint to highlight compartment. | Full keyboard access |
| **3. Active / Pressed** | Subtle background tint increase on press. | Touch target > 48px |
| **4. Disabled** | Hidden when no active guidance is pending. | `aria-hidden="true"` |
| **5. Loading / Skeleton** | Animated typing pulse indicator ("Agent evaluating next observation..."). | `aria-busy="true"` |
| **6. Error / Fallback** | Warning amber border (`#ffab00`) when loop limit reached ("Supervisor review required"). | `role="alert"` |

---

### 2.4 Component: `VerdictModal`
The authoritative modal displaying the final inspection outcome (`PASSED`, `REVIEW_REQUIRED`, `FAILED`) and human override controls.

| State | Visual Behavior | Accessibility (A11y) & Aria |
| :--- | :--- | :--- |
| **1. Default / Resting** | Backdrop blur (`backdrop-filter: blur(8px)`), central certificate with status stamp. | `role="dialog"`, `aria-modal="true"`, focus trap |
| **2. Hover / Focus** | Action buttons illuminate with gradient hover effects. | Keyboard ESC closes or confirms |
| **3. Active / Pressed** | Button depression micro-transition. | Clear focus ring |
| **4. Disabled** | Approve button disabled while mandatory items remain unverified. | `aria-disabled="true"` with tooltip explanation |
| **5. Loading / Skeleton** | Spinner inside button while cryptographic audit record is saved. | `aria-busy="true"` |
| **6. Error / Fallback** | Rejection explanation explaining exact policy rule violation (e.g. BR-09). | `role="alert"`, red badge |
