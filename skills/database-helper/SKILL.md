---
name: database-helper
description: |
  Database schema design, migration generation, and query optimization. Helps create migrations, write optimized queries, document schemas, suggest indexes, and design scalable database structures. Supports PostgreSQL, MySQL, SQLite, and popular ORMs including Prisma, Drizzle, TypeORM, SQLAlchemy, and Django ORM.
  TRIGGERS: "database", "schema", "migration", "SQL", "query", "ORM", "table", "foreign key", "index", "PostgreSQL", "MySQL", "SQLite"
---

# Database Helper

## Overview

The Database Helper skill provides comprehensive support for database schema design, migration generation, and query optimization. Whether you're designing a new schema, creating migrations, writing complex queries, or optimizing database performance, this skill helps you follow best practices and generate production-ready database code.

## Core Capabilities

### 1. Schema Design & Documentation

Generate well-structured database schemas with:
- Entity relationship diagram (ERD) descriptions
- Table definitions with appropriate field types
- Constraints and relationships (primary keys, foreign keys, unique constraints)
- Index strategies for query performance
- Schema versioning and evolution planning

Supported approaches:
- Raw SQL table definitions
- ORM schema definitions (Prisma, TypeORM, SQLAlchemy, Django models)
- Schema documentation with rationale

### 2. Migration Generation

Create safe, reversible migrations that:
- Preserve existing data during schema changes
- Support zero-downtime deployments
- Include rollback functionality
- Follow migration best practices
- Minimize locking and blocking

Supports:
- Adding/removing tables and columns
- Modifying column types and constraints
- Creating/dropping indexes
- Renaming fields and tables
- Data transformations
- Multi-step migrations for complex changes

### 3. Query Optimization

Write efficient SQL queries using:
- Advanced JOIN patterns for complex data retrieval
- Aggregation functions and grouping
- Common Table Expressions (CTEs) for readability
- Window functions for analytical queries
- Subqueries and derived tables
- Query analysis and EXPLAIN plan interpretation

### 4. Index Strategy

Suggest optimal indexes for:
- Frequently queried columns
- JOIN conditions and foreign keys
- WHERE clause filtering
- ORDER BY and GROUP BY operations
- Composite indexes for query patterns
- Index maintenance and monitoring

### 5. Schema Pattern Implementation

Apply proven design patterns:
- Soft deletes (logical deletion with timestamp flags)
- Audit trails and change tracking
- Polymorphic relationships
- Temporal tables for historical data
- Denormalization strategies for read performance
- JSONB columns for flexible schemas (PostgreSQL)

## Workflow: Schema → Migration → Query

### Step 1: Understand Your Requirements

When working on database tasks:
- Clarify the data model and relationships
- Identify query patterns and access patterns
- Consider scale and growth projections
- Review existing schema if modifying
- Determine ORM or SQL approach preference

### Step 2: Design or Modify Schema

Create or update the database schema:
- Define tables and relationships
- Choose appropriate data types
- Add constraints and validation
- Plan for indexing strategy
- Document design decisions

### Step 3: Generate Migrations

For schema changes:
- Create reversible migrations
- Write data transformation logic
- Plan for zero-downtime deployment
- Include rollback steps
- Test migration safety

### Step 4: Write Optimized Queries

Develop efficient queries:
- Use appropriate JOIN types
- Leverage indexes effectively
- Write readable, maintainable SQL
- Consider performance implications
- Document complex query logic

### Step 5: Document Changes

Record all modifications:
- Update schema documentation
- Document migration rationale
- Add query comments and explanations
- Track index usage and performance
- Maintain ERD diagrams

## Supported Databases

- **PostgreSQL** - Full support including advanced features (JSONB, window functions, CTEs)
- **MySQL** - MySQL 8.0+ with support for JSON, window functions
- **SQLite** - Suitable for development and small-scale applications
- **MongoDB** - Schema design and query patterns (document-oriented)

## Supported ORMs & Query Builders

- **Prisma** - Schema definition, migrations, and query generation
- **Drizzle ORM** - TypeScript-first schema and query building
- **TypeORM** - Entity definitions and repository patterns
- **SQLAlchemy** - Python SQLAlchemy ORM definitions
- **Django ORM** - Django models and query optimization
- **Raw SQL** - Direct SQL for maximum control

## Best Practices Applied

### Schema Design
- Normalize data to appropriate normal form (typically 3NF)
- Use surrogate keys for primary identifiers
- Add meaningful indexes on foreign keys
- Include audit columns (created_at, updated_at)
- Document relationships and constraints

### Migrations
- Make migrations small and focused
- Always include rollback logic
- Test migrations on data copies first
- Use zero-downtime strategies when needed
- Document migration purpose and dependencies

### Queries
- Use EXPLAIN ANALYZE to verify performance
- Leverage indexes effectively
- Avoid SELECT * in production code
- Use appropriate JOIN types (INNER, LEFT, etc.)
- Write readable, well-commented SQL

### Indexes
- Index foreign keys automatically
- Add indexes to frequently filtered columns
- Consider multi-column indexes for common query patterns
- Monitor unused indexes and remove them
- Balance read performance with write costs

### Data Integrity
- Use constraints to enforce business rules
- Implement soft deletes when needed
- Include audit trails for compliance
- Validate data at application and database layers
- Plan for data consistency across services

## Common Query Patterns

See `references/sql-patterns.md` for detailed examples and best practices for:
- JOIN patterns (INNER, LEFT, RIGHT, FULL OUTER)
- Aggregations with GROUP BY and HAVING
- Common Table Expressions (CTEs) for complex queries
- Window functions for analytical workloads
- Migration patterns and zero-downtime strategies
- Index optimization guidelines
- Schema design patterns

## Example Scenarios

**Scenario 1: Design a new e-commerce database**
- Create tables for products, orders, customers, inventory
- Define relationships and constraints
- Plan indexes for search and filtering
- Generate migration scripts
- Document the schema with ERD description

**Scenario 2: Add an audit trail to existing tables**
- Design audit logging pattern
- Create migration to add audit columns/tables
- Write queries to track changes
- Document the implementation

**Scenario 3: Optimize slow queries**
- Analyze query patterns with EXPLAIN
- Suggest appropriate indexes
- Rewrite queries for better performance
- Document optimization rationale

**Scenario 4: Implement soft deletes**
- Add is_deleted flag and deleted_at timestamp
- Create migration with data preservation
- Update queries to filter deleted records
- Document the soft delete strategy

**Scenario 5: Migrate between database systems**
- Map data types between systems
- Generate schema creation scripts
- Create data migration scripts
- Plan for zero-downtime migration

## Resources

### references/
- **sql-patterns.md** - Common SQL patterns, migration best practices, index optimization, and schema design patterns

### Typical Workflow

1. User describes database need or current schema issue
2. Skill provides schema design or migration strategy
3. Generate appropriate SQL or ORM code
4. Suggest indexes and optimizations
5. Document changes and provide explanation
