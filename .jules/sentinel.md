# Sentinel's Journal

## 2025-02-12 - Critical: Hardcoded Credentials in Client-Side Code
**Vulnerability:** Found hardcoded admin email and password in `src/app/admin/login/page.tsx`, a Client Component. This exposed full admin access to anyone viewing the source code.
**Learning:** Client-side authentication checks (even with localStorage) are fundamentally insecure. Secrets must never exist in client bundles.
**Prevention:** Always move authentication logic to Server Actions or API Routes. Use HttpOnly cookies for session management to prevent XSS theft.

## 2026-01-24 - Critical: Hardcoded Fallback Credentials in Server API
**Vulnerability:** Found hardcoded default admin credentials in `src/app/api/admin/login/route.ts` used as a fallback when environment variables are missing.
**Learning:** Fallback credentials intended for "easy setup" create a massive security hole if environment variables are omitted in production. Also identified `src/lib/adminAuth.ts` as unused dead code containing similar hardcoded secrets and insecure in-memory session storage inappropriate for serverless.
**Prevention:** Never provide default passwords in code. Logic should fail securely (deny access) if required configuration is missing. Aggressively prune unused authentication code to prevent confusion.
