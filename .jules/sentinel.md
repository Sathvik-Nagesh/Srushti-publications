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

## 2025-02-15 - High: Timing Attack in Password Verification
**Vulnerability:** The `verifyPassword` function used direct string comparison (`hash === newHash`) for verifying PBKDF2 hashes, allowing potential timing attacks.
**Learning:** Even with secure hashing (PBKDF2), the comparison step must be constant-time to prevent attackers from guessing the hash byte-by-byte based on response time.
**Prevention:** Always use a constant-time comparison function (like `crypto.timingSafeEqual` or a manual XOR loop) for checking sensitive hashes or signatures.

## 2025-02-15 - Critical: Scattered Hardcoded Secret Fallbacks
**Vulnerability:** Multiple files (`auth-edge.ts`, `password.ts`) contained hardcoded fallback strings for `ADMIN_SECRET` directly in the code logic.
**Learning:** Decentralized configuration leads to inconsistency (different fallbacks) and risk of shipping insecure defaults if environment variables fail.
**Prevention:** Centralize all sensitive configuration in a single module (e.g., `src/lib/config.ts`) that strictly validates environment variables in production.

## 2025-02-16 - Critical: Timing Attack in Admin Fallback Login
**Vulnerability:** The admin fallback login (`src/app/api/admin/login/route.ts`) used direct string comparison (`===`) for environment variable credentials. This allowed timing attacks and leaked the length of the secrets.
**Learning:** Even fallback/dev-only authentication paths must be secure. Comparing variable-length secrets directly is never safe.
**Prevention:** Use a hashing-based comparison (`secureCompare`) that hashes both inputs before comparing them constant-time. This masks the length and standardizes the comparison time.

## 2025-02-18 - Critical: Unprotected Site Settings Update
**Vulnerability:** The `/api/site-settings` PUT endpoint was completely unprotected, allowing any user to modify global site configuration (titles, descriptions, contact info).
**Learning:** Middleware path matching (`/api/admin`) is insufficient if sensitive endpoints exist outside that structure (e.g. `/api/site-settings`). Route handlers must enforce their own authentication.
**Prevention:** Created `verifyAdminSession` helper in `src/lib/auth-edge.ts` and mandated its use in all data-modifying API routes.

## 2025-02-18 - High: Inconsistent IP Extraction in Rate Limiting
**Vulnerability:** API routes were manually extracting IP addresses using `request.headers.get('x-forwarded-for') || 'unknown'`, which allows attackers to bypass rate limits by appending random values to the `X-Forwarded-For` header (e.g. `1.2.3.4, random`).
**Learning:** Using the raw `X-Forwarded-For` string as a rate limit key is insecure. The header often contains a comma-separated list of IPs.
**Prevention:** Implemented a centralized `getClientIp` helper in `src/lib/rateLimit.ts` that safely parses the first IP from `X-Forwarded-For` (standard proxy behavior) or falls back to `X-Real-IP`. Refactored all API routes to use this helper.

## 2025-02-19 - Critical: Middleware Trap in API Routes
**Vulnerability:** `POST` endpoints for books and categories (`/api/books`, `/api/categories`) were unprotected because the middleware only targeted `/admin` and `/api/admin` paths.
**Learning:** Relying on path-based middleware for security is brittle. If a developer names an endpoint differently (e.g. for RESTful consistency), it bypasses global protections.
**Prevention:** Always enforce authentication explicitly within the route handler for critical operations (POST/PUT/DELETE), regardless of middleware coverage.

## 2025-02-23 - High: User Enumeration via Timing Attack in Login
**Vulnerability:** The admin login endpoint (`/api/admin/login`) returned significantly faster for non-existent users compared to existing users with incorrect passwords. This happened because `verifyPassword` (PBKDF2) was skipped for non-existent users.
**Learning:** Authentication endpoints must have consistent response times regardless of whether the user exists or not. Skipping expensive operations for invalid users leaks their non-existence.
**Prevention:** Implement a "dummy verification" step. If the user is not found, execute `verifyPassword` against a pre-calculated dummy hash to simulate the processing time of a valid user check.
