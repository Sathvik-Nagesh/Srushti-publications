# Bolt's Journal - Critical Learnings

This journal records critical performance learnings, specific bottlenecks, and valuable lessons from rejected changes.

## 2026-01-26 - Double Debouncing Anti-Pattern
**Learning:** Found usage of `useDeferredValue` combined with `setTimeout` for search API calls. This creates redundant render cycles and delay without added benefit over standard debouncing for network requests.
**Action:** For network request debouncing, prefer standard `setTimeout` (or a debounce utility) inside `useEffect`. Reserve `useDeferredValue` for CPU-heavy UI rendering updates.
