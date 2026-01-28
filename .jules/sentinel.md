# Sentinel's Journal

## 2025-02-12 - Critical: Hardcoded Credentials in Client-Side Code
**Vulnerability:** Found hardcoded admin email and password in `src/app/admin/login/page.tsx`, a Client Component. This exposed full admin access to anyone viewing the source code.
**Learning:** Client-side authentication checks (even with localStorage) are fundamentally insecure. Secrets must never exist in client bundles.
**Prevention:** Always move authentication logic to Server Actions or API Routes. Use HttpOnly cookies for session management to prevent XSS theft.

## 2025-02-12 - Critical: Middleware Auth Bypass for API Routes
**Vulnerability:** The middleware only checked `pathname.startsWith('/admin')` to protect admin routes, causing `/api/admin/*` endpoints to be completely unprotected.
**Learning:** `pathname` for API routes includes `/api` prefix, so checks must explicitly account for it. Frontend-focused middleware logic often misses API protection.
**Prevention:** Always explicitly define protected route patterns, covering both page routes and API routes. Use strict matching or a centralized route configuration.

## 2025-02-13 - Critical: Price Manipulation in Order Creation
**Vulnerability:** The `/api/orders` endpoint accepted `items` with client-provided `price` and `totals`. A malicious user could send a request with `price: 1` to purchase expensive items for cheap.
**Learning:** Never trust client-side calculations for sensitive data like prices or totals. "Mass Assignment" vulnerabilities can occur when API endpoints blindly accept objects from the client.
**Prevention:** Always recalculate prices and totals on the server using trusted data sources (database) before processing payments or orders. Validate existence of referenced IDs.

## 2025-02-14 - Critical: Unprotected File Upload and Deletion
**Vulnerability:** The `/api/upload` endpoint was completely unprotected, allowing any user to upload files to Cloudinary or delete existing images using `publicId`.
**Learning:** `middleware.ts` protections often miss standalone API routes (like `/api/upload`) if they don't fall under the standard `/admin` or `/api/admin` prefix. Security must be applied explicitly to all sensitive endpoints, not just assumed by path conventions.
**Prevention:** Audit all API routes for authentication checks, especially those handling external services (like Cloudinary) or state modification. Use shared authentication helpers inside route handlers as a second layer of defense.
