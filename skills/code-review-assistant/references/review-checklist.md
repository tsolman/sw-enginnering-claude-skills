# Code Review Checklist

This comprehensive checklist provides detailed guidance for reviewing code across multiple dimensions: security, performance, error handling, and code quality.

## Security Review Checklist

### Injection Vulnerabilities

- [ ] **SQL Injection**: No raw SQL strings concatenated with user input
  - Check for parameterized queries or prepared statements
  - Verify ORM usage prevents SQL injection
  - Look for string interpolation in database queries

- [ ] **Command Injection**: No system command execution with user input
  - Check `exec()`, `system()`, backticks, `shell_exec()` (PHP), `subprocess` (Python)
  - Verify input validation before command execution
  - Use library functions instead of shell commands when possible

- [ ] **Template Injection**: Template variables properly escaped
  - Verify template engines use autoescaping
  - Check for `safe` or `raw` filters applied to user input
  - Ensure custom template functions validate input

- [ ] **Path Traversal**: File paths validated and constrained
  - Check for `../` or similar directory traversal sequences
  - Verify resolved paths are within expected directories
  - Use `Path.resolve()` or equivalent to canonicalize paths

- [ ] **LDAP/XML Injection**: Special characters escaped in queries
  - Validate and escape LDAP filters
  - Verify XML parsing doesn't enable XXE attacks
  - Use libraries that handle encoding properly

### Authentication & Authorization

- [ ] **Session Management**: Sessions properly created and invalidated
  - Check session timeout is appropriate
  - Verify session tokens are cryptographically secure
  - Ensure logout properly clears session data
  - HTTPS enforced for session cookies

- [ ] **Password Security**: Passwords properly hashed and salted
  - Check for bcrypt, scrypt, PBKDF2, or Argon2 usage
  - Verify salt is unique per password
  - Ensure password strength requirements exist
  - No plaintext passwords in logs or error messages

- [ ] **Authorization Checks**: Access control enforced at all levels
  - Verify authorization checks before sensitive operations
  - Check role-based access control (RBAC) or attribute-based (ABAC)
  - Ensure authorization isn't bypassed via direct object references
  - Verify admin functions require admin privileges

- [ ] **Token Security**: API tokens and JWTs properly validated
  - Check token signature verification (JWT)
  - Verify token expiration and refresh mechanisms
  - Ensure tokens don't contain sensitive data
  - HTTPS required for token transmission

- [ ] **Multi-Factor Authentication**: MFA properly implemented where needed
  - Check TOTP/HOTP implementations use secure random
  - Verify backup codes are properly hashed
  - Ensure MFA bypass isn't possible through other means

### Data Exposure & Privacy

- [ ] **Sensitive Data Logging**: No passwords, tokens, or PII in logs
  - Search for hardcoded log statements with sensitive data
  - Verify error messages don't leak sensitive information
  - Check debug output is disabled in production
  - Ensure stack traces don't expose credentials

- [ ] **Data at Rest**: Sensitive data is encrypted
  - Check encryption algorithms (AES-256 preferred)
  - Verify keys are properly managed and rotated
  - Ensure encryption keys aren't hardcoded
  - Check database encryption is enabled

- [ ] **Data in Transit**: HTTPS/TLS enforced
  - Verify all sensitive operations use HTTPS
  - Check TLS version is 1.2 or higher
  - Ensure certificate pinning for sensitive operations
  - Verify strong cipher suites are configured

- [ ] **PII Protection**: Personal information handled carefully
  - Check PII isn't unnecessarily logged or cached
  - Verify PII is encrypted when stored
  - Ensure PII isn't exposed in URLs
  - Check GDPR/privacy compliance

- [ ] **Secrets Management**: API keys and credentials properly stored
  - Verify no hardcoded secrets in code
  - Check environment variables or secret management service
  - Ensure secrets aren't logged or leaked in error messages
  - Verify secrets have appropriate access controls

### Dependency Security

- [ ] **Outdated Dependencies**: All dependencies are current
  - Check for known vulnerabilities in dependencies
  - Verify critical security patches are applied
  - Use tools like npm audit, pip audit, or OWASP Dependency-Check
  - Review dependency lock files are committed

- [ ] **Dependency Validation**: Only trusted dependencies used
  - Verify dependency sources are legitimate
  - Check for typosquatting in package names
  - Review dependency permissions and capabilities
  - Ensure dependencies are from trusted registries

- [ ] **Supply Chain Security**: Dependency integrity verified
  - Check package signatures when available
  - Verify checksum/hash of dependencies
  - Ensure no unauthorized modifications possible
  - Review dependency update processes

### Cryptography

- [ ] **Random Number Generation**: Secure random generators used
  - Check `Math.random()` not used for security
  - Verify cryptographic PRNG used (crypto.randomBytes, SecureRandom, etc.)
  - Ensure seeds are truly random

- [ ] **Hashing**: Appropriate hash algorithms used
  - Check for MD5 or SHA1 in security contexts (use SHA-256+)
  - Verify salt is used for password hashing
  - Ensure hash functions are collision-resistant

- [ ] **Encryption**: Strong encryption algorithms and modes
  - Check AES is used for symmetric encryption
  - Verify appropriate mode (GCM preferred over CBC)
  - Ensure IV/nonce is random and unique
  - Check RSA key sizes (2048+ bits)

### Security Headers & Configuration

- [ ] **HTTP Security Headers**: Appropriate security headers present
  - Content-Security-Policy (CSP) configured
  - X-Content-Type-Options: nosniff set
  - X-Frame-Options configured to prevent clickjacking
  - Strict-Transport-Security (HSTS) enabled
  - X-XSS-Protection configured

- [ ] **CORS Configuration**: CORS policy properly configured
  - Verify specific origins allowed (not `*` for sensitive operations)
  - Check allowed methods are necessary
  - Ensure credentials aren't exposed unnecessarily
  - Verify preflight requests handled

- [ ] **Input Validation**: All user input validated
  - Type checking enforced
  - Length limits verified
  - Format validation (email, URL, etc.)
  - Range checks for numeric input
  - Whitelist approach preferred over blacklist

---

## Performance Review Checklist

### Database Performance

- [ ] **N+1 Queries**: No N+1 query patterns
  - Check for loops with database queries
  - Verify eager loading of related data
  - Use JOINs instead of separate queries
  - Analyze query execution with EXPLAIN

- [ ] **Query Optimization**: Queries are efficient
  - Verify indexes exist on frequently queried columns
  - Check for unnecessary SELECT * queries
  - Ensure WHERE clauses are selective
  - Review query execution plans

- [ ] **Connection Pooling**: Database connections properly pooled
  - Check connection pool size is configured
  - Verify connections are reused
  - Ensure connections are properly closed
  - Monitor for connection leaks

- [ ] **Caching**: Appropriate caching strategy
  - Database query results cached where appropriate
  - Cache invalidation strategy exists
  - TTL/expiration times are reasonable
  - Cache key collisions avoided

### Memory Performance

- [ ] **Memory Leaks**: No objects retained unnecessarily
  - Check event listeners are removed
  - Verify timers are cleared
  - Ensure circular references are broken
  - Check for memory growth in long-running processes

- [ ] **Memory Allocation**: Efficient memory usage
  - Verify large objects not duplicated unnecessarily
  - Check for unnecessary array/object copies
  - Ensure streaming for large data sets
  - Look for memory hoarding in caches

- [ ] **Garbage Collection**: GC-friendly code patterns
  - Avoid creating temporary objects in hot paths
  - Verify large objects are not retained in closures
  - Check for excessive string concatenation
  - Use object pools for frequently created objects

### Computational Performance

- [ ] **Algorithmic Efficiency**: Appropriate algorithms used
  - Check Big O complexity of algorithms
  - Verify sorting algorithms are efficient (O(n log n))
  - Search operations are optimal
  - Recursion doesn't cause stack overflow

- [ ] **Unnecessary Computation**: No wasted processing
  - Check for repeated calculations (move outside loops)
  - Verify lazy evaluation where appropriate
  - Ensure short-circuit evaluation used
  - Look for dead code that could be removed

- [ ] **Blocking Operations**: Long operations don't block
  - Async/await used for I/O operations
  - Web workers for CPU-intensive tasks
  - Callbacks for long-running processes
  - Progress indicators for user-facing operations

### Frontend Performance

- [ ] **DOM Manipulation**: Efficient DOM updates
  - Batch DOM updates together
  - Avoid layout thrashing
  - Use documentFragment for multiple insertions
  - Verify event delegation used where appropriate

- [ ] **Bundle Size**: Code is properly optimized
  - Tree shaking removes unused code
  - Code splitting for large applications
  - Minification and compression enabled
  - Unnecessary dependencies removed

- [ ] **Asset Loading**: Resources loaded efficiently
  - Images optimized and compressed
  - Lazy loading for off-screen images
  - CSS/JS split appropriately
  - Resource hints (prefetch, preload) used

- [ ] **Rendering Performance**: No unnecessary re-renders
  - React: memoization where appropriate
  - Virtual scrolling for large lists
  - Avoid inline object/function creation in render
  - CSS animations preferred over JS animations

### Caching Strategy

- [ ] **Cache Validity**: Cache data is current
  - Cache TTL appropriate for data freshness
  - Cache invalidation triggers on updates
  - Stale cache handled gracefully
  - Cache warming for critical data

- [ ] **Cache Efficiency**: Cache hits are maximized
  - Cache keys are consistent
  - Cache size limits prevent memory issues
  - Efficient eviction policy
  - Monitoring of cache hit/miss ratios

---

## Error Handling Checklist

### Edge Cases

- [ ] **Null/Undefined Values**: Properly handled throughout
  - Type guards check for null/undefined
  - Optional chaining used safely
  - Nullish coalescing applied correctly
  - No unsafe access on potentially null values

- [ ] **Empty Collections**: Empty arrays/objects handled
  - Empty array iterations don't fail
  - Empty object property access safe
  - Empty strings handled appropriately
  - First/last element access safe

- [ ] **Boundary Values**: Edge values processed correctly
  - Off-by-one errors avoided
  - Minimum/maximum values handled
  - Zero handled correctly
  - Negative values where unexpected caught

- [ ] **Type Mismatches**: Type errors prevented
  - Type coercion avoided or explicit
  - String/number conversions checked
  - Array/object type verification
  - Truthy/falsy behavior considered

- [ ] **Large/Invalid Input**: Edge cases for data size
  - Very large numbers handled
  - Very long strings processed
  - Deep object nesting handled
  - Circular references detected

- [ ] **Concurrent Access**: Race conditions prevented
  - Shared state access is synchronized
  - Order of operations doesn't matter
  - Atomic operations used
  - Locks/mutexes where needed

### Exception Handling

- [ ] **Try/Catch Coverage**: Exceptions caught appropriately
  - Try/catch blocks around error-prone operations
  - Specific exception types caught
  - Broad catches avoided
  - Finally blocks clean up resources

- [ ] **Error Messages**: Exceptions provide useful information
  - Error messages are descriptive
  - Error context included (stack trace, variables)
  - User-facing errors are clear
  - Debug errors have sufficient detail

- [ ] **Resource Cleanup**: Resources freed on error
  - Files/connections closed in finally
  - Database transactions rolled back
  - Memory released
  - State restored to consistent state

- [ ] **Graceful Degradation**: Failures don't cascade
  - Non-critical errors don't break application
  - Fallback options available
  - User notified of failures
  - Operations can retry or continue

### Asynchronous Error Handling

- [ ] **Promise Error Handling**: Errors in promises caught
  - `.catch()` attached to promise chains
  - Async/await with try/catch
  - Unhandled promise rejections prevented
  - Error propagation works correctly

- [ ] **Callback Error Handling**: Callback errors handled
  - Callbacks check for error parameter
  - Error passed to next callback
  - No error silently ignored
  - Error state properly tracked

- [ ] **Timeout Handling**: Long operations timeout
  - Timeouts set for network operations
  - Timeout errors properly caught
  - Retry logic considers timeouts
  - User feedback during timeouts

- [ ] **Concurrent Operation Errors**: Multiple async ops handled
  - Promise.all errors handled
  - Promise.race error handling
  - Race conditions prevented
  - Partial failures handled

### Validation

- [ ] **Input Validation**: User input validated before use
  - Type validation performed
  - Length constraints checked
  - Format validation (email, URL, date)
  - Range checks for numeric input
  - Whitelist validation preferred

- [ ] **API Response Validation**: External data validated
  - Response schema verified
  - Data types validated
  - Required fields present
  - No assumptions about data format

- [ ] **Configuration Validation**: Config values validated
  - Required settings present
  - Value ranges appropriate
  - Type conversions explicit
  - Defaults used when appropriate

---

## Code Quality Checklist

### Naming Conventions

- [ ] **Variable Names**: Clear, descriptive names
  - Names describe purpose
  - Avoid single letters except loop indices
  - No ambiguous abbreviations
  - Consistent naming style throughout
  - Names aren't misleading

- [ ] **Function Names**: Functions named by action/purpose
  - Verbs used for action functions (getUser, calculateTotal)
  - Boolean functions start with is/has/can
  - Names describe what function does
  - Avoid generic names like process or handle
  - Consistent verb usage

- [ ] **Class/Type Names**: Classes named as nouns
  - Names describe what object represents
  - PascalCase consistently used
  - Abstract classes prefixed with Abstract (if applicable)
  - Interface names follow conventions
  - Avoid generic names like Helper or Manager

- [ ] **Constant Names**: Constants clearly identified
  - UPPER_SNAKE_CASE for constants
  - Names indicate purpose not just type
  - Magic numbers extracted to named constants
  - Enum values are descriptive

### Code Organization & Structure

- [ ] **Function Complexity**: Functions are simple
  - Single responsibility principle followed
  - Functions don't exceed reasonable length (typically < 50 lines)
  - Cyclomatic complexity is low
  - Deeply nested code refactored

- [ ] **Class Design**: Classes are well-designed
  - Single responsibility principle
  - Classes don't have too many methods
  - Related functionality grouped together
  - No god objects
  - Inheritance hierarchy is sensible

- [ ] **Module Organization**: Code logically organized
  - Related code in same module
  - Modules have clear purpose
  - No circular dependencies
  - Public/private interfaces clear
  - Module size reasonable

- [ ] **Comments & Documentation**: Code is well-documented
  - Comments explain "why" not "what"
  - Complex logic explained
  - Assumptions documented
  - Function purpose clear (docstrings/JSDoc)
  - No obsolete comments

### DRY Principle

- [ ] **Code Duplication**: Minimal code duplication
  - Copy-paste code refactored to functions
  - Common patterns extracted
  - Shared utilities created
  - Constants not duplicated
  - Business logic centralized

- [ ] **Configuration Duplication**: Config values not repeated
  - Magic strings/numbers extracted
  - Configuration centralized
  - Environment-specific config separate
  - Constants reused

### Code Patterns & Best Practices

- [ ] **Null Safety**: Null values handled consistently
  - Null checks before access
  - Optional chaining used where available
  - Default values provided
  - Null propagation prevented

- [ ] **Immutability**: Data immutability where beneficial
  - Objects not unnecessarily mutated
  - Immutable data structures used
  - Function parameters not modified
  - Return new objects rather than modify

- [ ] **Error States**: Error states modeled explicitly
  - Success/failure explicitly represented
  - Result types or Option types used
  - Null not used as error indicator
  - Error details captured

- [ ] **Resource Management**: Resources properly managed
  - Connections closed after use
  - Streams properly closed
  - File handles released
  - Timers cleared

### Testing & Testability

- [ ] **Test Coverage**: Code has adequate tests
  - Critical paths covered
  - Edge cases tested
  - Error conditions tested
  - Happy path and sad paths included
  - Target coverage (typically 70%+)

- [ ] **Testability**: Code is testable
  - Dependencies injectable
  - Pure functions preferred
  - Side effects isolated
  - Mocking/stubbing possible
  - No hidden dependencies

- [ ] **Test Quality**: Tests are well-written
  - Tests are independent
  - Tests are deterministic
  - No test interdependencies
  - Clear test names
  - Single assertion per test (generally)

---

## Language-Specific Considerations

### JavaScript/TypeScript
- [ ] No `var` declarations (use `let`/`const`)
- [ ] Type safety with TypeScript
- [ ] Async operations properly chained
- [ ] Prototype pollution not possible
- [ ] Template literals for string building

### Python
- [ ] Proper indentation (4 spaces)
- [ ] Type hints for public functions
- [ ] Docstrings for modules, classes, functions
- [ ] Context managers for resource handling
- [ ] F-strings for formatting

### Java
- [ ] Proper access modifiers
- [ ] Resource-try statements for cleanup
- [ ] Null checks or Optional usage
- [ ] Consistent naming conventions
- [ ] Exception hierarchy properly used

### Go
- [ ] Error returns checked
- [ ] Defer used for cleanup
- [ ] Goroutine leaks prevented
- [ ] Channels properly closed
- [ ] Race conditions detected/prevented

---

## Framework-Specific Considerations

### React
- [ ] Hooks rules followed (dependencies, etc.)
- [ ] No unnecessary re-renders
- [ ] Key props correct on lists
- [ ] Event handlers properly bound
- [ ] State updates are immutable

### Django
- [ ] ORM used to prevent SQL injection
- [ ] CSRF protection enabled
- [ ] Database migrations in version control
- [ ] Queryset optimization (select_related, prefetch_related)
- [ ] Security middleware configured

### Express.js
- [ ] Input validation middleware
- [ ] Error handling middleware
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Request/response logging

### Spring
- [ ] Dependency injection properly configured
- [ ] Security annotations used
- [ ] Transaction boundaries clear
- [ ] JPA/Hibernate mappings correct
- [ ] Rest controller validation
