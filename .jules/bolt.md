# Bolt's Journal - Critical Learnings

This journal records critical performance learnings, specific bottlenecks, and valuable lessons from rejected changes.

## 2025-02-14 - Unused Optimized Components
**Learning:** The codebase contains specialized performance components (like `BookCoverImage` in `OptimizedImage.tsx`) that are not consistently used, leading to unoptimized `img` tags in critical list components like `BookCard`.
**Action:** Before optimizing a component, search for existing "Optimized" or specialized versions of common elements (Images, Links) to avoid duplication and ensure consistency.
