# Technology Decision Framework

## Table of Contents
- [Default Stack](#default-stack)
- [Frontend Layer](#frontend-layer)
- [Backend Layer](#backend-layer)
- [Database Layer](#database-layer)
- [Real-Time Layer](#real-time-layer)
- [Infrastructure Layer](#infrastructure-layer)
- [Cross-Cutting Concerns](#cross-cutting-concerns)

---

## Default Stack

The preferred stack is: **React + TypeScript + Node.js + PostgreSQL + WebSockets**

This stack is the starting point, not a constraint. Deviate when the project's requirements clearly justify it. Every deviation must answer: "What does this solve that the default cannot?"

---

## Frontend Layer

### Default: React + TypeScript

**Strengths:** Ecosystem maturity, hiring pool, component model, TypeScript integration, SSR options (Next.js).

**When to deviate:**

| Scenario | Alternative | Reason |
|----------|-------------|--------|
| Content-heavy site, SEO-critical | Next.js (still React) or Astro | SSR/SSG built-in, better Core Web Vitals |
| Simple marketing/landing pages | Astro, plain HTML | React is overkill |
| Mobile-first with shared codebase | React Native or Flutter | Native performance, single codebase |
| Highly interactive data visualizations | React + D3 or dedicated viz library | React for shell, D3 for canvas/SVG |
| Embedded widget (tiny bundle) | Preact, Svelte, or vanilla JS | Bundle size constraint |
| Internal tool / admin panel | React + component library (Ant Design, shadcn/ui) | Speed of delivery |

**Meta-framework decision:**
- **Vite + React**: SPA, no SEO needs, dashboard/internal tool
- **Next.js**: SSR/SSG needed, public-facing, SEO matters
- **Remix**: Heavy form interactions, progressive enhancement priority

**State management decision:**
- **React Query / TanStack Query**: Server state (API data) — default choice
- **Zustand**: Simple client state
- **Redux Toolkit**: Complex client state with many interdependent slices
- **No library**: If state is trivially managed with useState/useContext

---

## Backend Layer

### Default: Node.js + TypeScript

**Strengths:** Same language as frontend, non-blocking I/O, large ecosystem, fast development, WebSocket native support.

**When to deviate:**

| Scenario | Alternative | Reason |
|----------|-------------|--------|
| CPU-intensive computation | Go, Rust, or Python (with C extensions) | Node.js single-threaded for CPU work |
| ML/AI-heavy backend | Python (FastAPI) | ML ecosystem is Python-native |
| Ultra-low latency / systems programming | Go or Rust | Better performance characteristics |
| Enterprise Java ecosystem integration | Kotlin/Spring Boot | Ecosystem compatibility |
| Simple REST API, small team | Node.js (default) or Go | Both work; Go for stronger typing and performance |

**Node.js framework decision:**
- **Express**: Maximum flexibility, when building custom middleware/patterns
- **Fastify**: Performance-critical APIs, schema-based validation
- **NestJS**: Large team, enterprise patterns (DI, modules, decorators), Angular-like structure
- **Hono**: Edge/serverless deployment, ultra-lightweight

**API style decision:**
- **REST**: Default for most applications. Well understood, good tooling
- **GraphQL**: Client needs flexible queries, multiple frontend consumers with different data needs, mobile + web with varying bandwidth
- **gRPC**: Internal service-to-service, high performance, strict contracts
- **tRPC**: Full-stack TypeScript, end-to-end type safety without schema generation

---

## Database Layer

### Default: PostgreSQL

**Strengths:** ACID compliance, JSON support (quasi-document DB), full-text search, extensions (PostGIS, pg_trgm), battle-tested, free.

**When to deviate or supplement:**

| Scenario | Alternative | Reason |
|----------|-------------|--------|
| Caching / session store | Redis | In-memory speed, TTL, pub/sub |
| Full-text search at scale | Elasticsearch / OpenSearch | Inverted index, relevance scoring, facets |
| Document-oriented, schema-flexible | MongoDB | Genuinely schema-less data (rare — PostgreSQL JSONB often suffices) |
| Time-series data (metrics, IoT) | TimescaleDB (PostgreSQL extension) or InfluxDB | Optimized for time-series queries |
| Graph relationships | Neo4j or PostgreSQL recursive CTEs | Deep relationship traversal |
| Global distribution, extreme scale | CockroachDB, Spanner, DynamoDB | Geo-distribution, planetary scale |
| Simple key-value, ephemeral | Redis or DynamoDB | When relational model is unnecessary |

**ORM / Query builder decision:**
- **Prisma**: Type-safe, great DX, good for most applications
- **Drizzle**: Lighter weight, SQL-closer, better for complex queries
- **Knex.js**: Query builder only, maximum SQL control
- **Raw SQL**: Performance-critical paths, complex analytical queries

**PostgreSQL scaling path:**
1. **Vertical scaling**: Bigger instance (handles most loads up to millions of rows)
2. **Read replicas**: Read-heavy workloads
3. **Connection pooling**: PgBouncer for high connection counts
4. **Partitioning**: Large tables (>100M rows) by date or tenant
5. **Citus extension**: Distributed PostgreSQL for horizontal scaling
6. **Separate services**: Extract bounded contexts with their own databases

---

## Real-Time Layer

### Default: WebSockets (Socket.io or native WS)

**When to use which:**

| Need | Solution |
|------|----------|
| Bidirectional real-time (chat, collaboration) | WebSockets (Socket.io for convenience, ws for performance) |
| Server → client updates (notifications, feeds) | Server-Sent Events (SSE) — simpler, HTTP-based |
| Infrequent updates, simplicity | HTTP polling or long polling |
| Scaling WebSockets horizontally | Redis adapter with Socket.io, or dedicated service |

**Socket.io vs native WebSocket:**
- **Socket.io**: Auto-reconnection, rooms/namespaces, fallback to polling, broader browser support
- **Native ws**: Lower overhead, when Socket.io features aren't needed, better for microservice-to-microservice

**Scaling real-time:**
- Sticky sessions or Redis adapter for multi-instance
- Dedicated real-time service (don't embed in API server at scale)
- Consider managed solutions (Ably, Pusher) if real-time isn't core to the product

---

## Infrastructure Layer

### Containerization
- **Docker**: Default for all deployable services
- **Docker Compose**: Local development, simple deployments
- **Kubernetes**: Production at scale, multiple services, auto-scaling needs
- **Managed containers**: AWS ECS/Fargate, Google Cloud Run, Azure Container Apps — when K8s is too much overhead

### Cloud provider selection

| Factor | AWS | GCP | Azure |
|--------|-----|-----|-------|
| Broadest service catalog | Yes | | |
| Best managed K8s (GKE) | | Yes | |
| Best for ML/AI workloads | | Yes | |
| Enterprise/Microsoft ecosystem | | | Yes |
| Startup credits available | Yes | Yes | Yes |
| Serverless maturity | Lambda (most mature) | Cloud Functions | Azure Functions |
| Managed PostgreSQL | RDS / Aurora | Cloud SQL / AlloyDB | Azure Database |

**Default recommendation:** Choose based on team expertise. If no preference, AWS has the broadest ecosystem.

### CI/CD
- **GitHub Actions**: Default if using GitHub (most common)
- **GitLab CI**: If using GitLab
- **Simple pipeline**: Lint → Type check → Test → Build → Deploy
- **Add as needed**: Security scanning, performance tests, preview deployments

### Monitoring and observability
- **Logging**: Structured JSON logs → centralized aggregation (ELK, CloudWatch, Datadog)
- **Metrics**: Prometheus + Grafana, or managed (Datadog, New Relic)
- **Tracing**: OpenTelemetry for distributed tracing
- **Error tracking**: Sentry
- **Uptime**: Health check endpoints + external monitoring

---

## Cross-Cutting Concerns

### Authentication
| Scenario | Solution |
|----------|----------|
| Standard web app | Session-based (server-side) or JWT |
| SPA + API | JWT with refresh tokens, or BFF (Backend for Frontend) pattern |
| Multi-tenant SaaS | JWT with tenant claim, row-level security |
| Enterprise SSO | OIDC / SAML via Auth0, Keycloak, or cloud provider |
| Simple MVP | Managed auth (Clerk, Auth0, Supabase Auth, Firebase Auth) |

### Caching strategy
1. **HTTP caching**: Cache-Control headers, CDN (CloudFront, Cloudflare)
2. **Application cache**: Redis for frequently accessed data
3. **Query cache**: PostgreSQL materialized views for expensive aggregations
4. **Client cache**: React Query cache with stale-while-revalidate

### Background jobs
- **BullMQ** (Redis-backed): Default for Node.js, supports retries, scheduling, priorities
- **PostgreSQL-based**: pg-boss, graphile-worker — no Redis dependency
- **Cloud-native**: SQS + Lambda, Cloud Tasks + Cloud Functions
- **Heavy processing**: Temporal for complex workflows and long-running processes
