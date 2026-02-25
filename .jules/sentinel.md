# Sentinel Journal

## 2024-05-23 - Critical IDOR in Order Access
**Vulnerability:** The `GET /api/orders/[id]` endpoint was completely unprotected, allowing any user to access full order details (PII) by guessing or enumerating order IDs.
**Learning:** Guest checkout flows often create a security gap where orders exist without an authenticated owner. Developers often leave these endpoints public to support the "Order Success" page.
**Prevention:** Always implement a "Guest Token" mechanism (signed cookie or URL token) upon resource creation to grant temporary, scoped access to unauthenticated creators. Never rely on obscurity (CUIDs/Order Numbers) for access control.
