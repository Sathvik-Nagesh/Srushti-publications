# Sentinel Journal

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

## 2025-02-24 - High: Logic Flaw in Stock Validation
**Vulnerability:** The order creation logic iterated over items individually to check stock, allowing a user to bypass stock limits by splitting the quantity of a single book across multiple item entries (e.g. purchasing 11 copies as 6+5 when only 10 were available).
**Learning:** Iterating over user-controlled input lists without aggregation can lead to race conditions or logic bypasses against global constraints (like total stock).
**Prevention:** Always aggregate resource usage (quantities, costs, etc.) by resource ID before validating against limits. Use `Map` or similar structures to sum up totals first.
## 2025-02-23 - Critical: Payment Verification Bypass (IDOR)
**Vulnerability:** The `/api/orders/verify-payment` endpoint verified Razorpay signatures based on the request body but failed to verify that the `razorpay_order_id` in the request matched the one associated with the order in the database. This allowed attackers to use valid payment signatures from cheaper orders to mark expensive orders as paid.
**Learning:** Signature verification alone proves the payment is valid, but not that it belongs to the *intended* order. Always verify the link between the payment gateway's order ID and your internal order record.
**Prevention:** In payment verification webhooks or callbacks, strictly validate that the gateway's order ID matches the stored `razorpayOrderId` for the specific internal order before updating its status.

## 2026-02-25 - High: User Enumeration via Timing Attack (Guest Accounts)
**Vulnerability:** The customer login endpoint (`/api/auth/login`) returned immediately if a user existed but had no password (e.g., guest account). This allowed attackers to enumerate guest accounts by measuring response times (~5ms vs ~100ms for normal logins).
**Learning:** Returning early for specific error conditions (like missing password) without simulating the work of a successful request creates a side-channel leak.
**Prevention:** Always ensure that all authentication paths (success or failure) take roughly the same amount of time. Use `verifyDummy` to simulate password hashing for invalid or incomplete accounts.

## 2025-03-02 - [CRITICAL] Fixed IDOR in Invoice Generation Endpoints
**Vulnerability:** Insecure Direct Object Reference (IDOR) / Missing Authorization. The endpoints `/api/invoice/[orderNumber]` and `/api/orders/[id]/invoice` generated and returned invoices containing PII (customer names, emails, addresses, phone numbers) and financial data solely based on the `orderNumber` provided in the URL, with no authentication or authorization checks. Order numbers in this app (`ORD-YYMMDD-XXXX`) are partially predictable (only 10,000 possibilities per day), making enumeration attacks trivial.
**Learning:** Endpoints that generate documents or data representations (like invoices, receipts, or exports) are often overlooked during authorization implementation because they are perceived as "read-only" or utility functions, despite handling highly sensitive aggregate data.
**Prevention:** Always ensure that endpoints returning sensitive data perform authorization checks mirroring the checks used in the primary data access APIs (e.g., mirroring the logic in `/api/orders/[id]`). Implement multi-layered authorization (Admin, Customer Owner, Guest Owner via signed tokens) for any document generation related to an order.

## 2025-03-05 - Critical: Defense in Depth Failure for Admin APIs
**Vulnerability:** Several `/api/admin/*` endpoints (such as `books/[id]`, `customers/[id]`, `offers`, `offers/[id]`, `orders/[id]`) lacked explicit `verifyAdminSession` authorization checks in their route handlers. They relied entirely on Next.js middleware for protection, which creates a single point of failure and violates the principle of defense in depth.
**Learning:** Relying solely on path-based middleware for API protection is brittle. If middleware is misconfigured, accidentally bypassed, or if a route is renamed without updating the middleware matcher, the endpoints become completely unauthenticated, leading to severe data breaches or unauthorized modifications.
**Prevention:** Implement a defense-in-depth strategy where *every* API route handler explicitly verifies the required authorization context (e.g., calling `verifyAdminSession`) at the very beginning of the function, regardless of any overarching middleware protections.

## 2025-03-08 - Critical: Missing Authorization in Admin Reviews Endpoint
**Vulnerability:** The `/api/admin/reviews` GET and PATCH endpoints relied entirely on path-based middleware (`src/middleware.ts`) for authentication. They lacked explicit authorization checks in their route handlers, which violates the principle of defense-in-depth. If middleware were misconfigured or the route path changed, anyone could fetch unapproved reviews or modify/delete them.
**Learning:** Relying solely on path-based middleware creates a single point of failure. API routes must verify authorization context explicitly inside the handler for actions like reading sensitive moderation queues or modifying resource states.
**Prevention:** Apply a defense-in-depth strategy where *every* API route handler explicitly verifies the required authorization context (e.g., calling `verifyAdminSession`) at the very beginning of the function.
## 2025-03-06 - [Information Disclosure in Review Creation Error Response]
**Vulnerability:** The error response payload in `POST /api/reviews` leaked internal error details to the client when a generic `Error` was thrown during review creation. This could expose internal application logic or database implementation details.
**Learning:** Detailed error messages (`error.message`) should not be serialized and returned directly to the client in API responses, as they may contain sensitive context or stack traces.
**Prevention:** Catch errors in API route handlers and return a generic error message (e.g., "Failed to submit review") for a 500 status code response. Detailed error messages should only be logged server-side for debugging purposes.

## 2025-03-09 - High: XSS via Unescaped JSON-LD Structured Data
**Vulnerability:** The application dynamically generated JSON-LD structured data (e.g., in `src/components/StructuredData.tsx`, `src/app/layout.tsx`, etc.) and directly injected it into the DOM using `dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}`. If any user-controlled data (like book titles, descriptions, or URLs) contained `</script>` tags, an attacker could prematurely close the `<script type="application/ld+json">` tag and execute arbitrary JavaScript, leading to Cross-Site Scripting (XSS).
**Learning:** `JSON.stringify` does not escape HTML characters by default. When embedding JSON directly into an HTML document inside a `<script>` tag, it is vulnerable to breakout attacks if the JSON string contains `</script>`.
**Prevention:** Always escape HTML-sensitive characters (`<` and `>`) when serializing JSON for inclusion in HTML script tags. Created a `safeJsonLdStringify` helper in `src/lib/jsonld.ts` that replaces `<` with `\u003C` and `>` with `\u003E`, and applied it globally to all JSON-LD injections.

## 2025-03-10 - Critical: Missing Defense-in-Depth for Admin APIs
**Vulnerability:** Similar to previous discoveries, several endpoints under `/api/admin` (`/api/admin/inventory`, `/api/admin/orders/export`, `/api/admin/settings`) lacked explicit `verifyAdminSession` authorization checks in their route handlers. They relied completely on Next.js path-based middleware for protection. If the middleware failed or was bypassed, unauthenticated users could manipulate inventory, download full order histories containing PII, or change global site settings.
**Learning:** Defense-in-depth is crucial and needs to be systematically applied. Route-level explicit authorization checks act as the primary defense mechanism against middleware configuration errors, bypasses, or accidental public exposure of administrative routes.
**Prevention:** Enforce a strict policy where *every* administrative or restricted API route handler explicitly invokes an authorization verification function (e.g., `verifyAdminSession`) at the very beginning of its execution, regardless of the overarching middleware. Regularly audit API route handlers for missing authorization checks.
## 2025-03-14 - [Authorization Bypass via Missing Route Verification]
**Vulnerability:** The `/api/admin/change-password` endpoint lacked an explicit `verifyAdminSession(request)` check, relying instead on parsing the `userId` from the session token. However, if no valid token was provided, it fell back to allowing a password change if the user supplied the original `ADMIN_PASSWORD` (stored in env vars) as the "currentPassword", permitting unauthenticated users to change the admin password if they knew or guessed the environment variable.
**Learning:** Middleware alone is insufficient for securing critical routes. Fallback mechanisms (like env-variable based auth for initialization) must be carefully guarded to ensure they do not become active for unauthenticated requests when they should only be accessible to authenticated users.
**Prevention:** Always implement defense-in-depth by explicitly invoking authorization checks (e.g., `verifyAdminSession`) at the very beginning of the route handler for all sensitive API endpoints, regardless of any middleware protections or internal token parsing.
## 2024-03-15 - [Guest Order Password Creation Vulnerability]
**Vulnerability:** Inconsistent password hashing algorithm (`bcryptjs` instead of `PBKDF2`) was being used during guest checkout account creation, rendering created accounts unable to login.
**Learning:** Hardcoded hashing logic specific to one module when a shared auth library exists creates fragmented authentication and security bugs. The application relied on `verifyPassword` (which uses PBKDF2) but created new accounts during checkout using `bcryptjs`.
**Prevention:** All components must use the central `src/lib/password.ts` library for password operations (`hashPassword`, `verifyPassword`).

## 2025-03-24 - High: Missing Input Sanitization and Rate Limiting on Profile Update
**Vulnerability:** The `/api/auth/me` POST endpoint updated customer profile fields (name, phone, address, city, state, pincode) directly with user input without sanitization, leaving the application vulnerable to Stored Cross-Site Scripting (XSS). Additionally, the endpoint lacked rate limiting, making it susceptible to Denial of Service (DoS) attacks via rapid profile update spamming.
**Learning:** All endpoints that accept user input and store it in the database must sanitize the input to prevent XSS. Furthermore, mutative endpoints should be protected by rate limiting to prevent abuse and ensure service availability.
**Prevention:** Implement input sanitization using utility functions like `sanitize` from `src/lib/sanitization.ts` for all user-provided data before updating database records. Apply rate limiting (e.g., using `checkRateLimit` from `src/lib/rateLimit.ts`) to mutative endpoints to mitigate DoS vulnerabilities.
