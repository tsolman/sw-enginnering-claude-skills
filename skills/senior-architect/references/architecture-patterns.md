# Architecture Patterns Reference

## Table of Contents
- [Pattern Selection Matrix](#pattern-selection-matrix)
- [Monolith](#monolith)
- [Modular Monolith](#modular-monolith)
- [Microservices](#microservices)
- [Event-Driven Architecture](#event-driven-architecture)
- [CQRS + Event Sourcing](#cqrs--event-sourcing)
- [Serverless](#serverless)
- [Hybrid Patterns](#hybrid-patterns)

---

## Pattern Selection Matrix

| Factor | Monolith | Modular Monolith | Microservices | Event-Driven | Serverless |
|--------|----------|-------------------|---------------|--------------|------------|
| Team size | 1-8 | 3-20 | 10+ | 5+ | 1-15 |
| Time to MVP | Fastest | Fast | Slow | Medium | Fast |
| Operational complexity | Low | Low | High | High | Medium |
| Independent deployability | No | Partial | Yes | Yes | Yes |
| Data consistency | Simple | Simple | Complex | Eventual | Varies |
| Performance ceiling | High | High | Very high | Very high | Limited (cold starts) |
| Cost at low scale | Low | Low | High | Medium | Very low |
| Cost at high scale | Medium | Medium | Optimizable | Optimizable | Can spike |

**Default recommendation path:**
1. Start with **Modular Monolith** unless there's a strong reason not to
2. Extract to **Microservices** only when a module has genuinely different scaling, deployment, or team ownership needs
3. Add **Event-Driven** patterns where decoupling or async processing provides clear value
4. Use **Serverless** for isolated functions, scheduled jobs, or low-traffic APIs

---

## Monolith

**When to use:**
- Solo developer or very small team (1-3)
- Prototype or proof of concept
- Simple domain with limited bounded contexts
- Speed to market is the only priority

**When to avoid:**
- Multiple teams need to deploy independently
- Parts of the system have vastly different scaling needs

**Key risks:**
- Becomes a "big ball of mud" without discipline
- Deployment coupling increases over time

**Mitigation:** Enforce module boundaries in code even within monolith (clear folder structure, dependency rules, no circular imports).

---

## Modular Monolith

**When to use (default recommendation):**
- Most greenfield applications
- Teams of 3-20
- Domain has clear bounded contexts
- Want monolith simplicity with future extraction path

**Structure:**
```
src/
├── modules/
│   ├── auth/          # Own routes, services, models, types
│   ├── billing/
│   ├── notifications/
│   └── core/
├── shared/            # Cross-cutting: logging, errors, middleware
└── infrastructure/    # DB, cache, queue connections
```

**Rules to enforce:**
- Modules communicate only through defined interfaces (no direct DB access across modules)
- Each module owns its database tables
- Shared kernel kept minimal
- Module dependencies are explicit and acyclic

**Extraction path:** When a module needs independent scaling or deployment, extract it to a service. The interface already exists.

---

## Microservices

**When to use:**
- Multiple teams (3+) need independent deployment cycles
- Parts of the system have genuinely different scaling profiles (e.g., real-time chat vs. batch reporting)
- Different parts need different tech stacks
- Organization is large enough to absorb operational overhead

**When to avoid (push back hard):**
- Team is small (<10 engineers)
- "Because Netflix does it"
- No clear bounded contexts yet
- No investment in DevOps/platform engineering

**Required infrastructure:**
- Service discovery
- API gateway
- Distributed tracing (OpenTelemetry)
- Centralized logging
- Health checks and circuit breakers
- Container orchestration (Kubernetes or managed equivalent)

**Communication patterns:**
- **Synchronous**: REST or gRPC for request-response (prefer gRPC for internal service-to-service)
- **Asynchronous**: Message queue (RabbitMQ, Kafka, SQS) for fire-and-forget or event propagation
- **Avoid**: Direct database sharing between services

---

## Event-Driven Architecture

**When to use:**
- Real-time features (notifications, live updates, dashboards)
- Decoupled workflows (order → payment → shipping → notification)
- Audit trail requirements
- Multiple consumers need to react to the same event
- High-throughput ingestion (IoT, analytics, logging)

**Event bus options:**
| Need | Tool |
|------|------|
| Simple pub/sub, low volume | Redis Pub/Sub |
| Reliable delivery, routing | RabbitMQ |
| High throughput, replay, ordering | Apache Kafka |
| Managed, moderate scale | AWS SNS/SQS, Google Pub/Sub |
| WebSocket to clients | Socket.io / native WS with Redis adapter |

**Key patterns:**
- **Event notification**: Thin events ("OrderCreated" with ID), consumers fetch details
- **Event-carried state transfer**: Fat events with full payload, reduces coupling but increases event size
- **Event sourcing**: Store events as source of truth, derive state (see CQRS section)

**Pitfalls:**
- Eventual consistency confusion: design UIs to handle it (optimistic updates, loading states)
- Event schema evolution: use versioning from day one
- Debugging distributed flows: require correlation IDs in all events

---

## CQRS + Event Sourcing

**When to use:**
- Complex domains with rich business rules (finance, logistics, legal)
- Audit trail is a hard requirement
- Read and write patterns are fundamentally different
- Need temporal queries ("what was the state at time X?")

**When to avoid:**
- Simple CRUD applications
- Team lacks domain-driven design experience
- No clear benefit from separating read/write models

**Implementation approach:**
- Write side: validate commands, emit events, store in event store
- Read side: project events into optimized read models (denormalized tables, search indexes)
- Event store: PostgreSQL with events table, or dedicated store (EventStoreDB)

---

## Serverless

**When to use:**
- Isolated utility functions (image processing, PDF generation)
- Scheduled jobs and cron tasks
- Webhook handlers
- Low-traffic or spiky-traffic APIs
- Cost optimization for idle workloads

**When to avoid:**
- Latency-sensitive real-time applications (cold start problem)
- Long-running processes (>15 min)
- Heavy compute or stateful workloads
- WebSocket connections (use a dedicated service instead)

**Practical guidance:**
- Use for background jobs even in otherwise non-serverless architectures
- Pair with API Gateway for HTTP endpoints
- Use provisioned concurrency for latency-sensitive paths
- Monitor costs carefully at scale — serverless can become expensive at high, consistent load

---

## Hybrid Patterns

Most real-world systems combine patterns. Common combinations:

1. **Modular monolith + event-driven**: Monolith emits events for async workflows (notifications, analytics)
2. **Modular monolith + serverless**: Monolith for core, Lambda/Cloud Functions for isolated tasks
3. **Microservices + event-driven**: Services communicate via events, synchronous calls only where necessary
4. **CQRS within a monolith**: Separate read/write models for complex domains without distributing

**Guidance:** Start simple, add patterns where they solve real problems. Every pattern adds complexity — require justification.
