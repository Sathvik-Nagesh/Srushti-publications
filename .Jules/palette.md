## 2025-01-28 - Nested Interactive Elements in Cards
**Learning:** Found a common anti-pattern where the entire Card component is wrapped in a Next.js `Link`, but contains interactive buttons (Add to Cart, Quick View). This creates invalid HTML (interactive inside interactive) and confusing screen reader experiences.
**Action:** When refactoring cards, separate the "clickable card area" into specific links (Image, Title) and keep action buttons as siblings to the links, ensuring all are keyboard accessible.
