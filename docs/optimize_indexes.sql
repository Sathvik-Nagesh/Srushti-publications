-- ====================================================================
-- Srushti Publications - Index Optimization Migration
-- Supabase Postgres Best Practices (Rule 1.3 + 1.5)
-- Run this in Supabase SQL Editor to apply the new indexes
-- ====================================================================

-- DROP OLD REDUNDANT SINGLE-COLUMN INDEXES ON Book
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isNewRelease_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isBestSeller_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isOnSale_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_categoryId_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_createdAt_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_sellingPrice_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_salesCount_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_isFeatured_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_isActive_stockQuantity_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_title_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Book_author_idx";

-- CREATE NEW OPTIMIZED COMPOSITE INDEXES
-- Rule 1.5: Partial composite indexes (isActive=true rows only)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_category_idx"
  ON "Book" ("isActive", "categoryId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_newest_idx"
  ON "Book" ("isActive", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_popular_idx"
  ON "Book" ("isActive", "salesCount" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_price_idx"
  ON "Book" ("isActive", "sellingPrice");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_featured_idx"
  ON "Book" ("isActive", "isFeatured");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_bestseller_idx"
  ON "Book" ("isActive", "isBestSeller");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_newrelease_idx"
  ON "Book" ("isActive", "isNewRelease");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_onsale_idx"
  ON "Book" ("isActive", "isOnSale");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_active_stock_idx"
  ON "Book" ("isActive", "stockQuantity");

-- Rule 6.3: Cursor-based pagination support
CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_cursor_idx"
  ON "Book" ("createdAt", "id");

-- Text search indexes (B-tree, supports prefix/LIKE queries from admin)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_title_idx"
  ON "Book" ("title");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_author_idx"
  ON "Book" ("author");

-- ====================================================================
-- ORDER TABLE - Composite indexes (Rule 1.3)
-- ====================================================================
DROP INDEX CONCURRENTLY IF EXISTS "Order_status_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Order_paymentStatus_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Order_createdAt_idx";
DROP INDEX CONCURRENTLY IF EXISTS "Order_customerEmail_idx";

CREATE INDEX CONCURRENTLY IF NOT EXISTS "order_status_date_idx"
  ON "Order" ("status", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "order_payment_date_idx"
  ON "Order" ("paymentStatus", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "order_email_date_idx"
  ON "Order" ("customerEmail", "createdAt" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "order_cursor_idx"
  ON "Order" ("createdAt", "id");

-- ====================================================================
-- OPTIONAL: Add pg_trgm for fuzzy Kannada book search (Rule 8.2)
-- Uncomment if you want 100x faster search over LIKE queries:
-- ====================================================================
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_title_trgm_idx"
--   ON "Book" USING gin (title gin_trgm_ops);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS "book_author_trgm_idx"
--   ON "Book" USING gin (author gin_trgm_ops);

-- VERIFY: Check index sizes after creation
SELECT
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid::regclass)) AS index_size
FROM pg_stat_user_indexes
WHERE relname IN ('Book', 'Order')
ORDER BY pg_relation_size(indexrelid::regclass) DESC;
