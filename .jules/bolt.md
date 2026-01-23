# Bolt's Journal - Critical Learnings

This journal records critical performance learnings, specific bottlenecks, and valuable lessons from rejected changes.

## 2024-05-22 - Font Optimization & React Compiler
**Learning:** This Next.js 15 project has `reactCompiler: true` enabled, rendering manual `React.memo` optimizations redundant. The font loading was unoptimized (manual `@import` and `<link>`), causing render blocking.
**Action:** Use `next/font` for all font loading to leverage self-hosting and zero-layout-shift. Trust React Compiler for component memoization instead of adding manual optimizations unless profiled otherwise.
