## 2025-01-28 - Nested Interactive Elements in Cards
**Learning:** Found a common anti-pattern where the entire Card component is wrapped in a Next.js `Link`, but contains interactive buttons (Add to Cart, Quick View). This creates invalid HTML (interactive inside interactive) and confusing screen reader experiences.
**Action:** When refactoring cards, separate the "clickable card area" into specific links (Image, Title) and keep action buttons as siblings to the links, ensuring all are keyboard accessible.

## 2025-01-28 - Icon-Only Links Accessibility
**Learning:** Discovered social media links in the Footer and the Cart link in the Header were lacking accessible names. Screen readers would only announce "link" or the URL.
**Action:** Always add `aria-label` to icon-only links or buttons. For multilingual sites, prefer `useTranslations` (as in Header) but hardcoded universal names (like "Facebook") are acceptable in non-internationalized components (like Footer).

## 2025-01-28 - Ghost Clicks on Opacity Transitions
**Learning:** Elements transitioned to `opacity: 0` remain interactive and block clicks to underlying content unless `pointer-events: none` is applied. This is critical for card overlays that cover main navigation links.
**Action:** Always pair `opacity: 0` with `pointer-events: none` for overlay containers, and restore `pointer-events: auto` on hover/focus.
