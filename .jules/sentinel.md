# Sentinel's Journal

## 2025-02-12 - Critical: Hardcoded Credentials in Client-Side Code
**Vulnerability:** Found hardcoded admin email and password in `src/app/admin/login/page.tsx`, a Client Component. This exposed full admin access to anyone viewing the source code.
**Learning:** Client-side authentication checks (even with localStorage) are fundamentally insecure. Secrets must never exist in client bundles.
**Prevention:** Always move authentication logic to Server Actions or API Routes. Use HttpOnly cookies for session management to prevent XSS theft.
