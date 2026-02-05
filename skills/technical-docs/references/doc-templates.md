# Documentation Templates and Patterns

This reference provides templates and patterns for generating consistent, professional technical documentation.

## Table of Contents
1. [README Template](#readme-template)
2. [API Documentation Template](#api-documentation-template)
3. [Architecture Decision Record (ADR) Template](#adr-template)
4. [Module/Function Documentation Patterns](#module-function-documentation-patterns)
5. [Inline Code Documentation Patterns](#inline-code-documentation-patterns)

---

## README Template

Use this structure for project README files that serve as the primary entry point for documentation.

```markdown
# [Project Name]

[One-line project description]

[![License][license-badge]][license-link]
[Other relevant badges: build, coverage, version, etc.]

## Overview

[2-3 sentence description of what the project does, its primary use case, and key benefits]

## Installation

### Prerequisites
- [List language/runtime requirements with versions]
- [Required tools or services]

### Setup

[For npm/pip/etc packages:]
\`\`\`bash
npm install project-name
# or
pip install project-name
\`\`\`

[For source installation:]
\`\`\`bash
git clone [repository-url]
cd [project-name]
npm install
npm run build
\`\`\`

## Quick Start

[Simple example showing basic usage in 5-10 lines]

\`\`\`javascript
import { myFunction } from 'project-name';

const result = myFunction({ option: 'value' });
console.log(result);
\`\`\`

## Usage

### Basic Example
[More detailed example with explanation]

### Configuration
[If applicable: configuration options, environment variables, config files]

### Common Patterns
[2-3 most common use cases with code examples]

## API Reference

[Brief intro] See [API Documentation](./docs/API.md) for full reference.

### Key Functions/Endpoints

| Name | Purpose |
|------|---------|
| `functionOne()` | Brief description |
| `functionTwo()` | Brief description |

[Include one inline example of a key function]

## Architecture

[Optional: High-level system architecture, data flow, or major components]

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Building
\`\`\`bash
npm run build
\`\`\`

### Code Style
[Linting and formatting rules if applicable]

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Tests pass (`npm test`)
- Code follows project style guide
- Changes are well-documented

## Troubleshooting

[Common issues and solutions, if applicable]

## License

This project is licensed under the [License Type] License - see [LICENSE](./LICENSE) file for details.

## Resources

- [Full API Documentation](./docs/API.md)
- [Architecture Decisions](./docs/ADRs/)
- [Contributing Guide](./CONTRIBUTING.md)
```

---

## API Documentation Template

Use this structure for REST APIs, library functions, or service endpoint documentation.

```markdown
# API Reference

## Overview
[Brief description of the API, what it does, primary use cases]

## Base URL
\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

[Describe authentication mechanism]

### API Key
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/v1/endpoint
\`\`\`

## Endpoints

### Get [Resource]

Returns a list of [resources].

\`\`\`
GET /resources
\`\`\`

#### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20) |
| `sort` | string | No | Sort field: `name` or `created` |

#### Response

\`\`\`json
{
  "data": [
    {
      "id": "res_123",
      "name": "Example Resource",
      "created": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
\`\`\`

#### Example

\`\`\`bash
curl -X GET "https://api.example.com/v1/resources?page=1&limit=10" \
  -H "Authorization: Bearer your_api_key"
\`\`\`

### Create [Resource]

Creates a new [resource].

\`\`\`
POST /resources
\`\`\`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Name of the resource |
| `type` | string | Yes | Resource type: `type_a` or `type_b` |
| `metadata` | object | No | Additional metadata |

#### Response

\`\`\`json
{
  "id": "res_456",
  "name": "New Resource",
  "type": "type_a",
  "created": "2024-01-15T10:35:00Z"
}
\`\`\`

#### Example

\`\`\`bash
curl -X POST "https://api.example.com/v1/resources" \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Resource",
    "type": "type_a"
  }'
\`\`\`

## Error Handling

### Error Response Format

\`\`\`json
{
  "error": "error_code",
  "message": "Human readable error message",
  "status": 400
}
\`\`\`

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `invalid_request` | 400 | Request parameters are invalid |
| `unauthorized` | 401 | Authentication failed or missing |
| `not_found` | 404 | Resource does not exist |
| `rate_limit` | 429 | Rate limit exceeded |
| `server_error` | 500 | Internal server error |

## Rate Limiting

Requests are limited to 100 requests per minute per API key. Check response headers:

- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Pagination

List endpoints support cursor-based pagination:

\`\`\`bash
curl "https://api.example.com/v1/resources?limit=20&after=cursor_value"
\`\`\`

## Webhooks (if applicable)

### Webhook Events

| Event | Triggered When |
|-------|----------------|
| `resource.created` | A new resource is created |
| `resource.updated` | A resource is modified |
| `resource.deleted` | A resource is removed |

### Webhook Payload

\`\`\`json
{
  "id": "evt_789",
  "type": "resource.created",
  "created": "2024-01-15T10:40:00Z",
  "data": {
    "id": "res_456",
    "name": "New Resource"
  }
}
\`\`\`
```

---

## ADR Template

Use this structure for documenting Architecture Decision Records.

```markdown
# ADR [Number]: [Brief Title]

**Date:** [YYYY-MM-DD]
**Status:** Proposed | Accepted | Deprecated | Superseded
**Supersedes:** [ADR N if applicable]

## Context

[Describe the issue or requirement that prompted this decision. Include:]
- The problem statement
- Current state and limitations
- Constraints or requirements
- Why this decision matters

[Example:]
Our application experienced performance degradation as the user base grew. Database queries that completed in milliseconds began taking seconds. We needed a caching solution to reduce database load while maintaining data freshness for real-time features.

## Decision

[State the decision clearly and concisely. What was chosen and why?]

We will implement Redis as an in-memory cache layer between the application and PostgreSQL database.

## Rationale

[Explain the reasoning behind this decision:]
- Why this approach solves the problem
- Key advantages
- How it fits with existing architecture
- Trade-offs considered

[Example:]
Redis provides:
- Sub-millisecond data access for frequently requested items
- Simple, battle-tested implementation
- Horizontal scaling capabilities
- Built-in expiration and eviction policies
- Strong community and operational tooling

The overhead of maintaining two data stores is acceptable given the performance gains.

## Consequences

### Positive
- [Benefit or positive outcome] - [Reasoning]
- [Benefit or positive outcome] - [Reasoning]

### Negative
- [Trade-off or complexity] - [Mitigation if applicable]
- [Trade-off or complexity] - [Mitigation if applicable]

### Neutral/Future
- [Consideration that may affect future decisions]

[Example for Redis caching:]

**Positive:**
- Reduces database load by 70-80% for read-heavy operations
- Improves response times from 500ms to 10ms for cached data
- Enables real-time feature updates with TTL-based freshness

**Negative:**
- Adds operational complexity: monitoring, backup, failover procedures
- Requires cache invalidation logic, introducing potential consistency issues
- Additional infrastructure cost (~$200/month for managed Redis)

**Neutral:**
- May need to revisit if workload patterns change significantly

## Alternatives Considered

### [Alternative 1 Name]
[Why it was rejected or why this option was better]

**Pros:** [Key advantages]
**Cons:** [Key disadvantages]

### [Alternative 2 Name]
[Why it was rejected or why this option was better]

**Pros:** [Key advantages]
**Cons:** [Key disadvantages]

[Example:]

### Memcached
Simpler than Redis but lacks many features (no complex data structures, no persistence). Rejected for insufficient functionality.

### Application-level caching (e.g., LRU cache)
Rejected because it doesn't share state across multiple application instances and doesn't persist across restarts.

## Implementation Notes

[Optional: Implementation details, migration plan, rollout strategy]

- Implementation timeline: [dates]
- Owner/Champions: [names]
- Related issues/PRs: [links]
- Configuration and deployment: [details]

## References

- [Link to architecture docs or related ADRs]
- [External resources or benchmarks]
- [Implementation PRs or issues]
```

---

## Module/Function Documentation Patterns

### Python Docstring Pattern (Google Style)

```python
def process_data(input_file: str, output_format: str = 'json') -> dict:
    """Processes input file and returns structured data.

    Reads a CSV or JSON file, validates contents, and transforms
    into the requested output format. Handles common data quality
    issues like missing values and type mismatches.

    Args:
        input_file: Path to the input file. Must be .csv or .json.
        output_format: Desired output format ('json' or 'dict').
            Defaults to 'json'.

    Returns:
        Dictionary containing processed data with keys:
            - 'data': List of processed records
            - 'errors': List of validation errors encountered
            - 'summary': Statistics about the processing

    Raises:
        FileNotFoundError: If input_file does not exist.
        ValueError: If output_format is not 'json' or 'dict'.
        IOError: If file cannot be read.

    Example:
        >>> result = process_data('data.csv', output_format='json')
        >>> print(result['summary']['total_records'])
        42
    """
    pass
```

### JavaScript/TypeScript JSDoc Pattern

```javascript
/**
 * Fetches user data from the API and caches the result.
 *
 * Makes an authenticated request to fetch user profile information.
 * Results are cached in memory for 5 minutes to reduce API calls.
 * Automatically refreshes on cache expiration.
 *
 * @async
 * @param {string} userId - The unique identifier of the user to fetch
 * @param {Object} [options={}] - Optional configuration
 * @param {boolean} [options.forceFresh=false] - Bypass cache and fetch fresh data
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds
 *
 * @returns {Promise<Object>} User object with properties:
 *   - id: {string} User ID
 *   - name: {string} User's full name
 *   - email: {string} User's email address
 *   - created: {Date} Account creation date
 *
 * @throws {Error} If userId is empty or invalid
 * @throws {NetworkError} If API request fails
 *
 * @example
 * const user = await fetchUser('user_123');
 * console.log(user.name); // 'John Doe'
 *
 * @example
 * // Force fresh data, bypassing cache
 * const freshUser = await fetchUser('user_123', { forceFresh: true });
 */
async function fetchUser(userId, options = {}) {
    // Implementation
}
```

### Class Documentation Pattern

```javascript
/**
 * Manages application configuration and environment variables.
 *
 * Loads configuration from multiple sources (env vars, config files, defaults)
 * with a defined priority order. Supports hot-reloading of config changes
 * and validation of required values.
 *
 * @class ConfigManager
 *
 * @example
 * const config = new ConfigManager();
 * config.load();
 * console.log(config.get('database.url')); // 'postgresql://...'
 */
class ConfigManager {
    /**
     * Creates a new ConfigManager instance.
     *
     * @constructor
     * @param {Object} [defaults={}] - Default configuration values
     */
    constructor(defaults = {}) {
        this.defaults = defaults;
    }

    /**
     * Loads configuration from all sources.
     *
     * Priority order:
     * 1. Environment variables
     * 2. .env file (if exists)
     * 3. config.json file (if exists)
     * 4. Constructor defaults
     *
     * @returns {Promise<void>}
     * @throws {ConfigError} If required config values are missing
     */
    async load() {
        // Implementation
    }

    /**
     * Gets a configuration value by key.
     *
     * Supports dot notation for nested values: 'database.host.primary'
     *
     * @param {string} key - Configuration key
     * @param {*} [defaultValue] - Value to return if key not found
     * @returns {*} Configuration value
     */
    get(key, defaultValue) {
        // Implementation
    }
}
```

---

## Inline Code Documentation Patterns

### Complex Algorithm Documentation

```python
def calculate_optimal_route(waypoints: List[Tuple[float, float]]) -> List[int]:
    """Calculate the shortest route visiting all waypoints.

    Uses a nearest-neighbor heuristic with 2-opt improvement.
    For small sets (<20 points), considers all permutations.
    For larger sets, uses approximation algorithm.

    Algorithm:
    1. Start with nearest neighbor tour (greedy construction)
    2. Apply 2-opt swaps iteratively until no improvement
    3. For n<20, compare against best permutation result
    4. Return indices in optimal order

    Time complexity:
    - Small (n<20): O(n!) - factorial for permutation check
    - Medium/Large (n>=20): O(n^2) average case for 2-opt

    Args:
        waypoints: List of (latitude, longitude) tuples

    Returns:
        List of indices representing optimal visit order
    """
    pass
```

### Non-obvious Logic Documentation

```javascript
// Check if the value is "falsy" but keep 0 and empty string as valid.
// This is important because we want to distinguish between:
// - false/null/undefined (invalid, use default)
// - 0/"" (valid, user explicitly set)
const isValidValue = value !== false && value != null;
```

### Comment Quality Guidelines

**Good comments explain WHY, not WHAT:**

```python
# Bad: Explains what the code does (which is obvious)
# Increment counter
i += 1

# Good: Explains why this logic is needed
# We start from 1, not 0, because header row contains column names
i = 1

# Good: Explains a non-obvious choice
# Use setTimeout(0) instead of immediate execution to allow
# other event handlers to run (prevents UI blocking)
setTimeout(processQueue, 0);
```

---

## Best Practices

### Use Clear Section Hierarchy
- Use `#` for main heading (one per file)
- Use `##` for major sections
- Use `###` for subsections
- Don't skip levels

### Include Concrete Examples
Every documentation section should include real, runnable examples. Avoid abstract placeholders.

### Keep Descriptions Concise
- First line should be a complete sentence explaining purpose
- Additional details follow
- Assume reader has basic knowledge of the domain

### Maintain Consistent Formatting
- Use consistent code block language identifiers
- Use consistent table formats
- Use consistent list formatting (bullet vs numbered)

### Update with Code Changes
Documentation should be updated whenever:
- Function signatures change
- New parameters are added
- Error behaviors change
- Use cases or examples become obsolete

