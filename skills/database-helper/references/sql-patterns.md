# SQL Patterns and Best Practices

This reference guide covers common SQL patterns, migration strategies, indexing guidelines, and schema design patterns for production database applications.

## Table of Contents

1. [Common Query Patterns](#common-query-patterns)
2. [Migration Best Practices](#migration-best-practices)
3. [Index Optimization](#index-optimization)
4. [Schema Design Patterns](#schema-design-patterns)

---

## Common Query Patterns

### JOIN Patterns

#### INNER JOIN
Select only matching records from both tables.

```sql
-- Find orders with customer details
SELECT
  o.id,
  o.order_date,
  c.name,
  c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days';
```

**Use when:** You need records that exist in both tables.

#### LEFT JOIN (LEFT OUTER JOIN)
Include all records from the left table, with matching records from the right table.

```sql
-- Find customers and their order counts, including those with no orders
SELECT
  c.id,
  c.name,
  COUNT(o.id) as order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY order_count DESC;
```

**Use when:** You need all records from the primary table, even if no matches exist in the joined table.

#### RIGHT JOIN
Include all records from the right table, with matching records from the left table.

```sql
-- All products, including those never ordered
SELECT
  p.id,
  p.name,
  COUNT(oi.id) as times_ordered
FROM order_items oi
RIGHT JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name;
```

**Use when:** The right table is your primary focus.

#### FULL OUTER JOIN
Include all records from both tables.

```sql
-- All customers and all suppliers (not directly related)
SELECT
  COALESCE(c.id, s.supplier_id) as entity_id,
  c.name as customer_name,
  s.name as supplier_name
FROM customers c
FULL OUTER JOIN suppliers s ON c.supplier_contact = s.contact_email;
```

**Use when:** You need all records from both tables, with nulls for missing matches.

#### Self JOIN
Join a table to itself to find relationships within the same table.

```sql
-- Find employees and their managers
SELECT
  e.id,
  e.name as employee_name,
  m.id as manager_id,
  m.name as manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

**Use when:** You need to find hierarchical relationships.

#### Multiple JOINs
Combine multiple tables for complex queries.

```sql
-- Order details with customer, product, and category information
SELECT
  o.id,
  c.name as customer_name,
  p.name as product_name,
  cat.name as category_name,
  oi.quantity,
  oi.unit_price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
INNER JOIN categories cat ON p.category_id = cat.id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days';
```

### Aggregation Patterns

#### Basic Aggregation
Use aggregate functions with GROUP BY.

```sql
-- Revenue by month
SELECT
  DATE_TRUNC('month', order_date)::DATE as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  MIN(total_amount) as min_order,
  MAX(total_amount) as max_order
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month DESC;
```

#### Aggregation with HAVING
Filter groups after aggregation.

```sql
-- Customers who spent over $5000
SELECT
  c.id,
  c.name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as lifetime_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
HAVING SUM(o.total_amount) > 5000
ORDER BY lifetime_value DESC;
```

#### Nested Aggregation
Aggregate the results of aggregation.

```sql
-- Average revenue per customer
SELECT
  AVG(customer_revenue) as avg_customer_revenue,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY customer_revenue) as median_revenue
FROM (
  SELECT
    customer_id,
    SUM(total_amount) as customer_revenue
  FROM orders
  GROUP BY customer_id
) customer_totals;
```

### Common Table Expressions (CTEs)

#### Single CTE
Simplify complex queries with named subqueries.

```sql
-- Find high-value orders
WITH recent_orders AS (
  SELECT
    id,
    customer_id,
    order_date,
    total_amount
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '90 days'
    AND total_amount > 1000
)
SELECT
  c.name,
  COUNT(ro.id) as high_value_order_count,
  SUM(ro.total_amount) as total_value
FROM recent_orders ro
INNER JOIN customers c ON ro.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY total_value DESC;
```

#### Recursive CTE
Handle hierarchical or tree-structured data.

```sql
-- All descendants in organizational hierarchy
WITH RECURSIVE org_hierarchy AS (
  -- Base case: CEO
  SELECT
    id,
    name,
    manager_id,
    1 as level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case: direct reports
  SELECT
    e.id,
    e.name,
    e.manager_id,
    oh.level + 1
  FROM employees e
  INNER JOIN org_hierarchy oh ON e.manager_id = oh.id
  WHERE oh.level < 10  -- Prevent infinite recursion
)
SELECT * FROM org_hierarchy
ORDER BY level, name;
```

#### Multiple CTEs
Chain multiple CTEs for complex logic.

```sql
WITH monthly_sales AS (
  SELECT
    DATE_TRUNC('month', order_date)::DATE as month,
    SUM(total_amount) as sales
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
),
monthly_avg AS (
  SELECT
    AVG(sales) as avg_monthly_sales
  FROM monthly_sales
)
SELECT
  ms.month,
  ms.sales,
  ma.avg_monthly_sales,
  ROUND(((ms.sales - ma.avg_monthly_sales) / ma.avg_monthly_sales * 100)::NUMERIC, 2) as variance_percent
FROM monthly_sales ms
CROSS JOIN monthly_avg ma
ORDER BY ms.month DESC;
```

### Window Functions

#### ROW_NUMBER / RANK / DENSE_RANK
Assign row numbers and rankings.

```sql
-- Top 3 products by revenue in each category
WITH product_revenue AS (
  SELECT
    p.id,
    p.name,
    cat.name as category,
    SUM(oi.quantity * oi.unit_price) as total_revenue,
    ROW_NUMBER() OVER (PARTITION BY cat.name ORDER BY SUM(oi.quantity * oi.unit_price) DESC) as rank_in_category
  FROM products p
  INNER JOIN categories cat ON p.category_id = cat.id
  LEFT JOIN order_items oi ON p.id = oi.product_id
  GROUP BY p.id, p.name, cat.id, cat.name
)
SELECT * FROM product_revenue
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;
```

#### LAG / LEAD
Compare rows with previous or next rows.

```sql
-- Compare daily sales with previous and next day
SELECT
  order_date,
  daily_sales,
  LAG(daily_sales) OVER (ORDER BY order_date) as prev_day_sales,
  LEAD(daily_sales) OVER (ORDER BY order_date) as next_day_sales,
  ROUND(((daily_sales - LAG(daily_sales) OVER (ORDER BY order_date)) /
    LAG(daily_sales) OVER (ORDER BY order_date) * 100)::NUMERIC, 2) as pct_change
FROM (
  SELECT
    DATE(order_date) as order_date,
    SUM(total_amount) as daily_sales
  FROM orders
  GROUP BY DATE(order_date)
)
ORDER BY order_date DESC
LIMIT 30;
```

#### Running Totals
Calculate cumulative sums.

```sql
-- Running total of revenue by month
SELECT
  month,
  monthly_revenue,
  SUM(monthly_revenue) OVER (ORDER BY month) as running_total,
  SUM(monthly_revenue) OVER (
    ORDER BY month
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) as three_month_rolling_sum
FROM (
  SELECT
    DATE_TRUNC('month', order_date)::DATE as month,
    SUM(total_amount) as monthly_revenue
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
) monthly_sales
ORDER BY month;
```

---

## Migration Best Practices

### Reversible Migrations

Always include both UP and DOWN directions.

```sql
-- UP: Add column with default value
ALTER TABLE products
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- DOWN: Remove column
ALTER TABLE products
DROP COLUMN is_active;
```

### Data Preservation Migrations

Transform data carefully during schema changes.

```sql
-- UP: Add new column, migrate data, then add constraint
BEGIN TRANSACTION;

ALTER TABLE orders
ADD COLUMN order_status VARCHAR(50);

UPDATE orders
SET order_status = CASE
  WHEN shipped_date IS NULL THEN 'pending'
  WHEN delivered_date IS NULL THEN 'shipped'
  ELSE 'delivered'
END;

ALTER TABLE orders
ALTER COLUMN order_status SET NOT NULL;

COMMIT;

-- DOWN: Remove new column
BEGIN TRANSACTION;
ALTER TABLE orders
DROP COLUMN order_status;
COMMIT;
```

### Zero-Downtime Migrations

Use these patterns for large tables without downtime.

#### Pattern 1: Add Column + Default Value
```sql
-- Step 1: Add nullable column
ALTER TABLE customers
ADD COLUMN full_name VARCHAR(255);

-- Step 2: Backfill in batches (application handles this)
UPDATE customers
SET full_name = CONCAT(first_name, ' ', last_name)
WHERE full_name IS NULL
LIMIT 1000;

-- Step 3: Add constraint once complete
ALTER TABLE customers
ALTER COLUMN full_name SET NOT NULL;
```

#### Pattern 2: Rename Columns via Dual Write
```sql
-- Step 1: Add new column alongside old
ALTER TABLE users
ADD COLUMN email_new VARCHAR(255);

-- Step 2: Application writes to both columns
-- Step 3: Backfill new column from old
UPDATE users SET email_new = email WHERE email_new IS NULL;

-- Step 4: Drop old column
ALTER TABLE users DROP COLUMN email;

-- Step 5: Rename new column
ALTER TABLE users RENAME COLUMN email_new TO email;
```

#### Pattern 3: Create New Table + Trigger
```sql
-- Step 1: Create new table with new structure
CREATE TABLE products_new (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Add trigger to sync old table to new
CREATE OR REPLACE FUNCTION sync_products_new()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO products_new (id, name, sku, created_at)
  VALUES (NEW.id, NEW.name, NEW.sku, NEW.created_at)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    sku = EXCLUDED.sku;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_sync AFTER INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION sync_products_new();

-- Step 3: Backfill existing data
INSERT INTO products_new SELECT * FROM products;

-- Step 4: Application switches to reading from new table
-- Step 5: Drop old table when safe
DROP TABLE products;
RENAME TABLE products_new TO products;
```

### Migration Dependencies

Document and order migrations correctly.

```sql
-- Migration file: 001_create_customers.sql
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration file: 002_create_orders.sql (depends on 001)
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration file: 003_add_order_status.sql (depends on 002)
ALTER TABLE orders
ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
```

---

## Index Optimization

### Index Types and Use Cases

#### B-Tree Index (Default)
Best for equality and range queries.

```sql
-- Index for WHERE id = ? and WHERE age > ?
CREATE INDEX idx_users_age ON users(age);

-- Multi-column index for WHERE name = ? AND email = ?
CREATE INDEX idx_users_name_email ON users(name, email);

-- Index supporting ORDER BY
CREATE INDEX idx_orders_date ON orders(order_date DESC);
```

#### Unique Index
Enforce uniqueness and support fast lookups.

```sql
-- Natural unique constraint
CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email));

-- Multi-column unique constraint
CREATE UNIQUE INDEX idx_user_product_review ON reviews(user_id, product_id);
```

#### Partial Index
Index only rows matching a condition.

```sql
-- Index only active products
CREATE INDEX idx_products_active ON products(id) WHERE is_active = true;

-- Index recent orders only
CREATE INDEX idx_orders_recent ON orders(customer_id, order_date)
WHERE order_date >= CURRENT_DATE - INTERVAL '1 year';
```

#### Composite Index
Support multiple query patterns.

```sql
-- Good for WHERE customer_id = ? AND order_date > ?
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Good for SELECT ... WHERE status = ? ORDER BY created_at
CREATE INDEX idx_tickets_status_date ON tickets(status, created_at DESC);
```

### Indexing Strategy

#### Index Foreign Keys
Always index foreign key columns.

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  product_id BIGINT NOT NULL REFERENCES products(id)
);

-- These indexes speed up joins and cascade operations
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
```

#### Index Filter Columns
Add indexes to columns in WHERE clauses.

```sql
-- If you frequently query: SELECT * FROM users WHERE status = 'active' AND age > 18
CREATE INDEX idx_users_status_age ON users(status, age);
```

#### Index Sort Columns
Include columns in ORDER BY.

```sql
-- If you frequently query: SELECT * FROM posts ORDER BY created_at DESC
CREATE INDEX idx_posts_created_at_desc ON posts(created_at DESC);

-- If you combine filtering and sorting: WHERE published = true ORDER BY created_at
CREATE INDEX idx_posts_published_date ON posts(published, created_at DESC);
```

#### Avoid Over-Indexing
Monitor and remove unused indexes.

```sql
-- PostgreSQL: Find unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(relid) DESC;

-- Drop unused index
DROP INDEX idx_unused_index;
```

### Index Performance Analysis

#### EXPLAIN ANALYZE
Understand query execution plans.

```sql
EXPLAIN ANALYZE
SELECT c.name, COUNT(o.id) as order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY order_count DESC
LIMIT 10;

-- Look for:
-- - Sequential Scans (consider indexing)
-- - Index Scans (good - using your indexes)
-- - High "Total Cost" values (consider optimization)
-- - "Rows" estimates that differ greatly from actual rows
```

---

## Schema Design Patterns

### Soft Deletes

Logical deletion instead of hard deletion for audit trails.

```sql
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index to speed up queries filtering out deleted records
CREATE INDEX idx_customers_not_deleted ON customers(id) WHERE is_deleted = false;

-- Query to exclude soft-deleted records
SELECT * FROM customers WHERE is_deleted = false;

-- Soft delete operation
UPDATE customers SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP
WHERE id = 123;
```

### Audit Trail Pattern

Track all changes to important tables.

```sql
-- Main table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  version INT DEFAULT 1
);

-- Audit table
CREATE TABLE products_audit (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
  changed_by VARCHAR(255),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Audit trigger
CREATE OR REPLACE FUNCTION audit_products()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO products_audit (product_id, name, price, action, changed_by)
  VALUES (NEW.id, NEW.name, NEW.price, TG_OP, CURRENT_USER);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_audit AFTER INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION audit_products();
```

### Polymorphic Relations

Store related records of different types.

```sql
-- Flexible approach: activity_type and activity_id
CREATE TABLE activities (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL, -- 'order', 'review', 'comment'
  activity_id BIGINT NOT NULL, -- references id in the activity_type table
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alternative: JSON column (PostgreSQL)
CREATE TABLE activities_json (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  activity_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example activity data
INSERT INTO activities_json (user_id, activity_data)
VALUES (1, '{"type": "order", "order_id": 123, "total": 99.99}');
```

### Temporal Data / Slowly Changing Dimensions

Track history of dimension attributes.

```sql
CREATE TABLE employee_history (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL,
  name VARCHAR(255),
  department VARCHAR(100),
  salary DECIMAL(10, 2),
  valid_from DATE NOT NULL,
  valid_to DATE DEFAULT '9999-12-31',
  is_current BOOLEAN DEFAULT true,
  UNIQUE(employee_id, valid_from)
);

-- Insert initial record
INSERT INTO employee_history (employee_id, name, department, salary, valid_from)
VALUES (1, 'John Doe', 'Engineering', 100000, '2020-01-01');

-- Update: close old record and insert new one
BEGIN TRANSACTION;
UPDATE employee_history
SET valid_to = CURRENT_DATE, is_current = false
WHERE employee_id = 1 AND is_current = true;

INSERT INTO employee_history (employee_id, name, department, salary, valid_from)
VALUES (1, 'John Doe', 'Management', 120000, CURRENT_DATE + 1);
COMMIT;

-- Current view
SELECT * FROM employee_history WHERE is_current = true;

-- Historical view
SELECT * FROM employee_history WHERE employee_id = 1 ORDER BY valid_from;
```

### JSONB Columns (PostgreSQL)

Store flexible semi-structured data.

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert with JSONB
INSERT INTO users (email, name, metadata)
VALUES ('john@example.com', 'John', '{"preferences": {"theme": "dark", "language": "en"}, "tags": ["vip", "early-adopter"]}');

-- Query JSONB
SELECT * FROM users WHERE metadata->>'preferences'->>'theme' = 'dark';

-- Index JSONB for performance
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);
```

### Denormalization for Read Performance

Duplicate data strategically for faster reads.

```sql
-- Original normalized schema
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  total_amount DECIMAL(10, 2)
);

-- Denormalized: cache customer name on orders table
ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);

-- Keep denormalized data in sync with trigger
CREATE OR REPLACE FUNCTION update_order_customer_name()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders SET customer_name = NEW.name WHERE customer_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_name_update AFTER UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_order_customer_name();
```

---

## Query Optimization Tips

### Avoid SELECT *
Be specific about columns needed.

```sql
-- Bad: retrieves unnecessary columns
SELECT * FROM orders WHERE customer_id = 1;

-- Good: only needed columns
SELECT id, order_date, total_amount FROM orders WHERE customer_id = 1;
```

### Use EXPLAIN to Verify Performance
Always check execution plans for important queries.

```sql
EXPLAIN ANALYZE
SELECT c.name, COUNT(o.id) FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;
```

### Batch Large Operations
Process large updates in chunks.

```sql
-- Instead of: UPDATE table SET ... WHERE condition (on millions of rows)
-- Do:
DO $$
DECLARE
  deleted_count INT := 0;
BEGIN
  LOOP
    DELETE FROM old_records WHERE id IN (
      SELECT id FROM old_records
      WHERE created_date < NOW() - INTERVAL '2 years'
      LIMIT 10000
    );

    deleted_count := deleted_count + FOUND::int;
    EXIT WHEN NOT FOUND;
  END LOOP;

  RAISE NOTICE 'Deleted % records', deleted_count;
END $$;
```

### Use Transactions Appropriately
Group related operations.

```sql
BEGIN TRANSACTION;
  INSERT INTO orders (...) VALUES (...);
  UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 123;
  INSERT INTO order_items (...) VALUES (...);
COMMIT;
```
