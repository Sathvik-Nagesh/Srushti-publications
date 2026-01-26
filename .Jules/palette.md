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
