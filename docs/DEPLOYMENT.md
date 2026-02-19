# Srushti Publications — Deployment Guide

## Required Environment Variables (Vercel Dashboard)

Set all of these in **Vercel → Project → Settings → Environment Variables**:

```
# Database (Supabase)
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# Admin
ADMIN_SECRET_KEY=<generate a long random string>
```

> ⚠️ **DIRECT_URL is critical** — Prisma uses it for schema migrations. Without it,
> migrations fail because Supabase's PgBouncer (port 6543) doesn't support
> the `SET` commands Prisma needs.
> PORT 5432 = direct connection (for migrations)  
> PORT 6543 = pooled connection (for queries)

---

## Supabase Postgres Best Practices Applied

### Indexes (Rule 1.3 + 1.5)

The schema uses **partial composite indexes** on `Book` model:

- All browse/filter queries use `(isActive, ...)` composite indexes
- These are 5-20× smaller than full-table indexes since only active books (typically 95%+) are indexed
- Order model uses `(status, createdAt)` composite for admin dashboard queries

### Connection Pooling (Rule 2.3)

- Supabase PgBouncer (port 6543) is used for all application queries
- `?pgbouncer=true&connection_limit=1` in DATABASE_URL ensures compatibility with serverless

### Full-Text Search (Rule 8.2)

- Book title/author search uses Prisma's `contains` which maps to `ILIKE`
- For production scale (1000+ books), consider adding pg_trgm extension:
  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_trgm;
  CREATE INDEX book_title_trgm_idx ON "Book" USING gin (title gin_trgm_ops);
  CREATE INDEX book_author_trgm_idx ON "Book" USING gin (author gin_trgm_ops);
  ```

### Rate Limiting (Rule 2.2)

- `/api/orders` is rate-limited to 5 requests/minute per IP
- For multi-instance/edge deployment, replace in-memory store with Upstash Redis

---

## Applying DB Schema Changes in Production

Since Supabase requires direct connection for migrations:

```bash
# Option 1: Prisma migrate (requires DIRECT_URL)
DIRECT_URL="postgresql://..." npx prisma migrate deploy

# Option 2: Raw SQL via Supabase CLI
supabase db push

# Option 3: Manual via Supabase SQL editor
# Paste the SQL directly
```

---

## Post-Deployment Checklist

- [ ] Set all env vars in Vercel
- [ ] Verify `DIRECT_URL` includes port 5432 (not 6543)
- [ ] Test book upload end-to-end
- [ ] Test order creation (rate limit should allow 5/min)
- [ ] Verify Cloudinary images appear
- [ ] Test admin login
- [ ] Check Razorpay payment flow on live key
