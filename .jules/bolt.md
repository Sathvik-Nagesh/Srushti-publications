# Bolt's Journal - Critical Learnings

This journal records critical performance learnings, specific bottlenecks, and valuable lessons from rejected changes.

## 2025-02-06 - Build Instability vs Optimization
**Learning:** The codebase currently fails build due to TypeErrors in utility files (`cache.ts`, `preload.ts`) and missing DB environment variables causing runtime errors during SSG.
**Action:** When optimizing in a broken environment, isolate the optimization (e.g., component-level `React.memo`) and verify it independently if full build verification is impossible without architectural fixes.
