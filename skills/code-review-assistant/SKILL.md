---
name: code-review-assistant
description: |
  Comprehensive code review tool for solo engineers. Analyzes code for bugs, security issues, performance problems, and style violations.
  TRIGGERS: "review", "code review", "PR review", "check my code", "security review", "find bugs"
---

# Code Review Assistant

## Overview

The Code Review Assistant is a comprehensive tool designed for solo engineers to review their own code thoroughly. It helps identify bugs, security vulnerabilities, performance issues, and coding standard violations through a structured review workflow. Whether you're preparing for a pull request, auditing existing code, or learning best practices, this skill guides you through a complete code analysis.

## When to Use This Skill

Use the Code Review Assistant when you need to:
- Review code before submitting a pull request
- Perform security audits on your codebase
- Check for performance bottlenecks
- Identify potential bugs or edge cases
- Verify code follows your project's standards
- Learn about code quality improvements
- Audit dependencies and third-party code

## Code Review Workflow

The Code Review Assistant follows this structured workflow:

### 1. Understand Context
Begin by understanding the code's purpose and environment:
- What does this code do?
- What language/framework is it using?
- What dependencies does it have?
- What is the expected input/output?
- Are there existing tests or documentation?

### 2. Check for Logic Errors
Verify the code's correctness:
- Does the logic match the intended functionality?
- Are there off-by-one errors or boundary conditions missed?
- Could infinite loops occur?
- Are all code paths covered?
- Are variables initialized before use?

### 3. Security Scan
Identify security vulnerabilities:
- Injection vulnerabilities (SQL, command, template)
- Authentication/authorization issues
- Data exposure risks
- Insecure dependencies
- Cryptographic weaknesses
- Input validation gaps

### 4. Performance Analysis
Look for performance problems:
- N+1 query patterns
- Memory leaks or inefficient allocation
- Unnecessary computation
- Blocking operations that should be async
- Missing caching opportunities

### 5. Style & Patterns Review
Evaluate code quality:
- Naming conventions
- Code duplication (DRY principle)
- Function/class complexity
- Test coverage
- Documentation completeness

### 6. Summarize Findings
Provide actionable feedback:
- Organize issues by severity
- Highlight critical problems first
- Provide specific recommendations
- Suggest refactoring opportunities

## Review Checklist Categories

### Logic Errors
- [ ] All variables initialized before use
- [ ] Boundary conditions handled correctly
- [ ] Loop conditions prevent infinite loops
- [ ] All code paths return expected values
- [ ] Type conversions are explicit and safe
- [ ] Null/undefined values handled
- [ ] Off-by-one errors avoided
- [ ] Operator precedence correct

### Security Issues
- [ ] No SQL injection vulnerabilities
- [ ] No command injection risks
- [ ] Input properly validated and sanitized
- [ ] Authentication checks in place
- [ ] Authorization properly enforced
- [ ] Sensitive data not logged
- [ ] Dependencies are current and patched
- [ ] Cryptographic operations correct
- [ ] CORS/CSP headers appropriate
- [ ] Secrets not hardcoded

### Performance
- [ ] No N+1 query patterns
- [ ] Efficient algorithms used
- [ ] Unnecessary DOM manipulation avoided
- [ ] Proper caching implemented
- [ ] Async/await used where needed
- [ ] Memory not unnecessarily allocated
- [ ] Bundle size optimized
- [ ] Slow operations documented

### Code Style
- [ ] Consistent naming conventions
- [ ] Function names describe purpose
- [ ] Variable names are clear and concise
- [ ] Comments explain "why" not "what"
- [ ] No dead code
- [ ] Proper indentation and formatting
- [ ] Lines not excessively long
- [ ] No magic numbers

### Edge Cases
- [ ] Empty input handled
- [ ] Very large input handled
- [ ] Null/undefined values checked
- [ ] Type mismatches handled
- [ ] Network failures considered
- [ ] Concurrent access handled
- [ ] Boundary values tested
- [ ] Error states covered

### Error Handling
- [ ] All exceptions caught appropriately
- [ ] Error messages are informative
- [ ] Graceful degradation on errors
- [ ] Resources cleaned up on error
- [ ] No silent failures
- [ ] Async errors properly handled
- [ ] Validation errors descriptive
- [ ] Logging appropriate detail level

## Output Format for Review Findings

Structure your findings with the following format:

```
## Review Summary
[1-2 sentence overview of code quality and main concerns]

## Critical Issues
**Issue 1: [Title]**
- Severity: CRITICAL
- Location: [file:line or function name]
- Problem: [Description of the issue]
- Impact: [What could go wrong]
- Recommendation: [How to fix it]

## High Priority Issues
**Issue 2: [Title]**
- Severity: HIGH
- Location: [file:line or function name]
- Problem: [Description]
- Impact: [Potential consequences]
- Recommendation: [Solution]

## Medium Priority Issues
**Issue 3: [Title]**
- Severity: MEDIUM
- Location: [file:line or function name]
- Problem: [Description]
- Impact: [Minor but worth fixing]
- Recommendation: [Improvement]

## Low Priority Issues
**Issue 4: [Title]**
- Severity: LOW
- Location: [file:line or function name]
- Problem: [Description]
- Recommendation: [Nice-to-have improvement]

## Strengths
- [Positive aspects of the code]
- [Good patterns observed]
- [Well-handled edge cases]

## Recommendations
1. [High-level improvement suggestion]
2. [Refactoring opportunity]
3. [Best practice to adopt]
```

## Severity Levels

- **CRITICAL**: Could cause data loss, security breach, or system crash. Fix immediately.
- **HIGH**: Significant bug, security vulnerability, or performance issue. Fix before merging.
- **MEDIUM**: Code quality issue, edge case not handled, or minor performance problem. Should fix soon.
- **LOW**: Style preference, naming suggestion, or optional improvement. Consider for future refactoring.

## Quick Commands

When working with the Code Review Assistant:

**For a quick security review:**
"security review [code]" - focuses on vulnerabilities and compliance

**For performance audit:**
"performance review [code]" - highlights optimization opportunities

**For PR preparation:**
"review my code" - comprehensive analysis before pull request

**For learning:**
"what could be improved?" - educational feedback with explanations

**For specific issues:**
"check for [logic errors/bugs/edge cases]" - targeted analysis

## Using the Review Checklist

Reference the detailed checklists in `references/review-checklist.md` when:
- Performing domain-specific reviews (security, performance, etc.)
- Training junior developers on code standards
- Creating team code review guidelines
- Setting up automated code quality checks
- Establishing best practices for your project
