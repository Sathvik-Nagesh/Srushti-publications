## 2025-01-28 - Nested Interactive Elements in Cards
**Learning:** Found a common anti-pattern where the entire Card component is wrapped in a Next.js `Link`, but contains interactive buttons (Add to Cart, Quick View). This creates invalid HTML (interactive inside interactive) and confusing screen reader experiences.
**Action:** When refactoring cards, separate the "clickable card area" into specific links (Image, Title) and keep action buttons as siblings to the links, ensuring all are keyboard accessible.

## 2025-01-28 - Icon-Only Links Accessibility
**Learning:** Discovered social media links in the Footer and the Cart link in the Header were lacking accessible names. Screen readers would only announce "link" or the URL.
**Action:** Always add `aria-label` to icon-only links or buttons. For multilingual sites, prefer `useTranslations` (as in Header) but hardcoded universal names (like "Facebook") are acceptable in non-internationalized components (like Footer).

## 2025-01-28 - Localized ARIA Labels
**Learning:** When adding accessibility attributes to a localized interface (e.g. Kannada), ensure `aria-label` content is also localized or matches the visual language, rather than defaulting to English, to provide a consistent experience for screen reader users.
**Action:** Check the component's primary language or use `useTranslations` (if available) for `aria-label` values.

## 2025-01-29 - Search Autocomplete Accessibility
**Learning:** Custom search autocompletes often miss the WAI-ARIA Combobox pattern, making them unusable for screen readers. Specifically, using `aria-activedescendant` is crucial to allow keyboard navigation through results (including suggestions like "Recent" and "Popular") while keeping focus on the input for typing.
**Action:** Implement `role="combobox"`, `role="listbox"`, `role="option"` and `aria-activedescendant` on custom search components. Ensure all suggestion types (Recent, Popular, Results) share a unified keyboard navigation index.

## 2025-01-30 - Localized ARIA Labels Consistency
**Learning:** Found components (WishlistButton, QuantitySelector) with hardcoded English `aria-label` attributes while the visible UI was in Kannada (the default locale). This creates a jarring and confusing experience for screen reader users who expect the interface language to be consistent.
**Action:** When using `next-intl` or similar libraries, always wrap `aria-label` strings in translation hooks (e.g., `t('addToCart')`), even for icon-only buttons. Ensure dynamic content in labels (like book titles) is properly interpolated in the translation strings.

## 2025-01-31 - Semantic Retrofitting with ARIA Roles
**Learning:** When refactoring complex layouts (like progress steppers) where changing the DOM structure (e.g., to `<ol>`) would break CSS positioning or flex behavior, using `role="list"` and `role="listitem"` is a safe and effective way to provide correct semantics without visual regressions.
**Action:** Use `role="list"` on the container and `role="listitem"` on children for non-list elements that function as lists. Combine with `aria-current="step"` for process indicators.

## 2025-02-01 - UI Verification in DB-Dependent App
**Learning:** Verified a UI component in a DB-dependent app where `npm run dev` fails due to missing credentials. Created a temporary page `src/app/palette-verify/page.tsx` that bypasses server-side DB calls (like those in `HomePage`), allowing verification of client components (like `ScrollToTop`) within the `RootLayout` context.
**Action:** When verifying UI in a broken or restricted environment, create a dedicated test route/page that isolates the component from failing data dependencies.
