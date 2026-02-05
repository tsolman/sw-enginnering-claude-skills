# Deliverable Templates

Use these as flexible structures. Adapt sections based on project scope and complexity.

## Table of Contents
- [System Architecture Document](#system-architecture-document)
- [Database Schema Document](#database-schema-document)
- [API Design Document](#api-design-document)
- [Project Structure](#project-structure)
- [Infrastructure Overview](#infrastructure-overview)

---

## System Architecture Document

```markdown
# [Project Name] — System Architecture

## 1. Overview
[One paragraph: what the system does, who it serves, key constraints.]

## 2. Business Context
- **Users**: [Who and how many]
- **Scale expectations**: [Current and projected load]
- **Performance requirements**: [Latency, throughput, availability targets]
- **Compliance/regulatory**: [If applicable]

## 3. Architecture Pattern
[Pattern chosen and why. Reference alternatives considered.]

## 4. System Components

### [Component diagram — describe as text or ASCII]
```
[Client] → [API Gateway / Load Balancer]
               ├→ [Service A]
               ├→ [Service B]
               └→ [Service C]
           [Message Queue] ←→ [Workers]
           [Database] [Cache] [Object Storage]
```

### Component descriptions
| Component | Responsibility | Technology | Why |
|-----------|---------------|------------|-----|
| ... | ... | ... | ... |

## 5. Data Flow
[Describe key data flows for primary use cases.]

### [Use case 1: e.g., User Registration]
1. Client sends POST /api/auth/register
2. API validates input, hashes password
3. Creates user record in PostgreSQL
4. Emits UserCreated event
5. Email service consumes event, sends welcome email

### [Use case 2: ...]

## 6. Integration Points
| External System | Protocol | Purpose | Failure handling |
|----------------|----------|---------|-----------------|
| ... | ... | ... | ... |

## 7. Security Architecture
- **Authentication**: [Method and flow]
- **Authorization**: [RBAC/ABAC/policy engine]
- **Data protection**: [Encryption at rest/transit, PII handling]
- **API security**: [Rate limiting, input validation, CORS]

## 8. Scalability Strategy
- **Current target**: [e.g., 1K concurrent users]
- **Scaling triggers**: [When to scale what]
- **Horizontal scaling**: [What scales horizontally]
- **Bottleneck awareness**: [Known limits and mitigation]

## 9. Trade-offs and Decisions
| Decision | Chosen | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| ... | ... | ... | ... |

## 10. Risks and Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| ... | ... | ... | ... |
```

---

## Database Schema Document

```markdown
# [Project Name] — Database Schema

## 1. Overview
[Brief description of data model approach, key entities, relationships.]

## 2. Entity Relationship Summary
[ASCII or text description of key relationships]

```
User 1──* Order *──* Product
  │                    │
  └──1 Profile     Category
```

## 3. Tables

### [table_name]
[Purpose of this table]

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |
| ... | ... | ... | ... |

**Indexes:**
- `idx_[table]_[column]` on ([column]) — [reason]
- `idx_[table]_[columns]` on ([col1], [col2]) WHERE [condition] — [reason]

**Policies (if RLS):**
- [Policy description]

### [next_table]
...

## 4. Enums / Custom Types
| Type | Values | Used by |
|------|--------|---------|
| ... | ... | ... |

## 5. Migration Strategy
- Tool: [Prisma Migrate / Drizzle Kit / custom SQL]
- Naming: `YYYYMMDDHHMMSS_description.sql`
- Rules: [No destructive migrations without explicit approval, backward-compatible by default]

## 6. Performance Considerations
- **Partitioning**: [If applicable, which tables and strategy]
- **Connection pooling**: [PgBouncer config or Prisma pool settings]
- **Query patterns**: [Key queries and their expected access patterns]
- **Estimated table sizes**: [Projected row counts at 6/12/24 months]
```

---

## API Design Document

```markdown
# [Project Name] — API Design

## 1. Overview
- **Style**: [REST / GraphQL / gRPC / tRPC]
- **Base URL**: `https://api.[domain].com/v1`
- **Authentication**: [Bearer JWT / Session / API Key]
- **Content type**: `application/json`

## 2. Conventions
- **Naming**: kebab-case for URLs, camelCase for JSON fields
- **Pagination**: Cursor-based (`?cursor=xxx&limit=20`) for lists
- **Filtering**: Query params (`?status=active&sort=-created_at`)
- **Error format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [{ "field": "email", "issue": "invalid format" }]
  }
}
```

## 3. Endpoints

### [Domain: Auth]

#### POST /auth/register
**Purpose**: Create new user account
**Auth**: None
**Request body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "Jane Doe"
}
```
**Responses**:
- `201`: Account created, returns user + token
- `409`: Email already registered
- `422`: Validation error

#### [Next endpoint...]

### [Domain: Resources]
...

## 4. WebSocket Events (if applicable)

### Connection
- **URL**: `wss://api.[domain].com/ws`
- **Auth**: Token as query param or first message

### Events
| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| ... | client→server | `{...}` | ... |
| ... | server→client | `{...}` | ... |

## 5. Rate Limiting
| Endpoint group | Limit | Window |
|---------------|-------|--------|
| Auth | 10 req | 15 min |
| API (authenticated) | 100 req | 1 min |
| API (unauthenticated) | 20 req | 1 min |

## 6. Versioning Strategy
[URL versioning (/v1/) or header-based. Migration approach for breaking changes.]
```

---

## Project Structure

```markdown
# [Project Name] — Project Structure

## Monorepo vs Polyrepo
[Decision and reasoning]

## Directory Layout

### [Monorepo example]
```
project-root/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── api.ts
│   │   │   │   │   └── types.ts
│   │   │   │   └── dashboard/
│   │   │   ├── lib/            # Utilities, helpers
│   │   │   └── app/            # Routes / pages
│   │   └── package.json
│   └── api/                    # Node.js backend
│       ├── src/
│       │   ├── modules/        # Feature modules
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   └── auth.types.ts
│       │   │   └── users/
│       │   ├── middleware/
│       │   ├── lib/
│       │   └── index.ts
│       └── package.json
├── packages/
│   └── shared/                 # Shared types, utils, validation schemas
├── docker-compose.yml
├── turbo.json / nx.json
└── package.json
```

## Conventions
- **Feature-based organization**: Group by domain, not by technical layer
- **Barrel exports**: index.ts per feature for clean imports
- **Co-location**: Tests, types, and styles live next to their code
- **Shared code**: Only extract to packages/ when used by 2+ apps
```

---

## Infrastructure Overview

```markdown
# [Project Name] — Infrastructure

## 1. Environments
| Environment | Purpose | URL |
|-------------|---------|-----|
| Local | Development | localhost:3000 / :4000 |
| Staging | Pre-production testing | staging.[domain].com |
| Production | Live | [domain].com |

## 2. Architecture Diagram
```
[CDN] → [Load Balancer]
              ├→ [App Server 1..N]
              └→ [WebSocket Server 1..N]
         [Redis] (cache + sessions + pub/sub)
         [PostgreSQL] (primary + read replica)
         [Object Storage] (S3 / GCS)
```

## 3. Service Configuration
| Service | Provider | Tier/Size | Justification |
|---------|----------|-----------|---------------|
| ... | ... | ... | ... |

## 4. CI/CD Pipeline
```
Push → Lint + Type Check → Test → Build → [Staging Deploy] → [Prod Deploy (manual gate)]
```

## 5. Monitoring
| Concern | Tool | Alerts |
|---------|------|--------|
| Errors | Sentry | P1: immediate, P2: daily digest |
| Uptime | [Tool] | <99.9% triggers page |
| Performance | [Tool] | p95 latency > [X]ms |
| Logs | [Tool] | Error rate spike |

## 6. Backup and Recovery
- **Database**: [Automated daily snapshots, point-in-time recovery window]
- **Object storage**: [Versioning enabled / cross-region replication]
- **RTO/RPO**: [Recovery time / recovery point objectives]

## 7. Cost Estimate
| Service | Monthly estimate | Notes |
|---------|-----------------|-------|
| ... | ... | ... |
| **Total** | **$X/mo** | At current projected scale |
```
