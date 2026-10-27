# Frontend Architecture & Design System Best Practices

> **Authoritative Reference**: Standard for Mendly frontend engineering, UI/UX excellence, Design Token integration, accessibility, and high-performance Web application delivery.

---

## 1. Design Token System Architecture

Frontend styling must not use arbitrary, hardcoded hex values, magic numbers, or random paddings. All visual attributes must stem from the authoritative Design System tokens in [`design-system/tokens/tokens.json`](file:///Users/jonatassouza/bin/dev/mendley/design-system/tokens/tokens.json).

### Token Hierarchy
1. **Global / Primitive Tokens**: Pure color scales, raw typography scales, spacing units (e.g., `colors.slate.900`, `spacing.4`).
2. **Semantic / Intent Tokens**: Purpose-driven abstractions (e.g., `background.surface`, `text.primary`, `action.primary.bg`, `status.obstacle.financial`).
3. **Component Tokens**: Scoped to specific UI widgets (e.g., `card.border-radius`, `badge.installment.padding`).

---

## 2. Core UI/UX Engineering Principles

1. **Rich Aesthetics & Premium Feel**:
   - Curated harmonious palettes with dark mode support and sleek gradients.
   - Glassmorphic panels with subtle borders (`rgba(255, 255, 255, 0.08)` on dark surfaces).
   - Micro-interactions on buttons, cards, and selections (e.g., `hover:scale-[1.01]`, smooth spring transitions).

2. **Zero Cumulative Layout Shift (CLS)**:
   - Always specify explicit aspect ratios and bounding boxes for dynamic content and media.
   - Use skeleton loaders matching exact component geometry during asynchronous data fetching.

3. **Accessibility (WCAG 2.1 Level AA Minimum)**:
   - High-contrast text readability (4.5:1 ratio for normal text, 3:1 for large text).
   - Semantic HTML elements (`<main>`, `<section>`, `<article>`, `<button>`, `<nav>`).
   - Accessible ARIA attributes (`aria-expanded`, `aria-live="polite"`, `role="alert"`).
   - Full keyboard navigation: every interactive element must have a visible focus ring (`focus-visible:ring-2 focus-visible:ring-primary-500`).

4. **Component State Completeness**:
   Every UI component must explicitly handle and display all 5 states:
   - **Default / Resting State**
   - **Hover / Focus State**
   - **Active / Pressed State**
   - **Disabled State**
   - **Loading / Skeleton State**
   - **Error / Fallback State**

---

## 3. Frontend Anti-Corruption Layer (ACL) Integration

UI components should never ingest backend domain entities directly. Instead, UI components consume **View Models** supplied by the Frontend ACL.

```typescript
// View Model for the Resolve Micro-UI
export interface InstallmentPlanViewModel {
  readonly id: string;
  readonly monthlyAmountFormatted: string; // e.g., "€1,600.00 / mo"
  readonly termMonths: number;             // e.g., 3
  readonly totalAmountFormatted: string;   // e.g., "€4,800.00"
  readonly isRecommended: boolean;
  readonly savingsOrAdvantageText: string;
  readonly isSelectable: boolean;
}
```

The component renders only the view model, ensuring high cohesion, simplified testing, and immunity to backend schema modifications.
