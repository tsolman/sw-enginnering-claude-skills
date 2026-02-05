---
name: testing-generator
description: |
  Automatically generates comprehensive test suites from code. Analyzes code structure to identify test cases, generates unit tests, integration tests, and test fixtures with mocking strategies. Supports Jest/Vitest (JavaScript/TypeScript), Pytest (Python), Go testing, and PHPUnit. Use this when you need tests for functions, classes, APIs, or when you want to improve test coverage.
  TRIGGERS: "test", "unit test", "integration test", "test coverage", "mock", "fixture", "Jest", "Pytest", "Vitest", "testing"
---

# Testing Generator

## Overview

This skill analyzes your source code and automatically generates comprehensive test suites tailored to your codebase. It identifies test cases, generates properly structured tests with mocking strategies, and suggests coverage improvements for multiple testing frameworks.

## Workflow

The testing generation process follows these steps:

1. **Analyze Code** - Examine the source code structure, functions, classes, dependencies, and edge cases
2. **Identify Test Cases** - Determine what should be tested (happy paths, error states, boundary conditions)
3. **Generate Tests** - Create appropriate test files with setup, assertions, and cleanup
4. **Add Test Utilities** - Include mocks, stubs, and fixtures as needed
5. **Suggest Improvements** - Recommend coverage areas and testing strategies

## Supported Frameworks

The skill generates tests for multiple languages and frameworks:

### JavaScript/TypeScript
- **Jest** - Full-featured testing framework with built-in mocking
- **Vitest** - Modern Vite-native test runner
- Generated tests include: describe blocks, test cases, assertions, mocks, snapshots

### Python
- **Pytest** - Flexible testing framework with fixtures
- Generated tests include: test functions, fixtures, parametrized tests, mocking with unittest.mock

### Go
- **Go testing package** - Standard library testing
- Generated tests include: test functions, table-driven tests, helper functions

### PHP
- **PHPUnit** - Standard PHP testing framework
- Generated tests include: test classes, assertions, setup/teardown, mocking with PHPUnit mocks

## Test Types Generated

### Unit Tests
- Individual functions or methods in isolation
- Mock external dependencies
- Test all code paths and edge cases
- Fast execution, no external resources needed

### Integration Tests
- Multiple components working together
- Database interactions or API calls (mocked when appropriate)
- Setup and teardown procedures included
- Verify component interactions

### E2E Test Scaffolds
- Test user workflows end-to-end
- Basic structure provided for you to fill in
- Suitable for UI testing frameworks (Cypress, Playwright, Selenium)

### Test Data & Fixtures
- Sample data for testing
- Reusable fixture definitions
- Factory functions for test object creation
- Cleanup procedures

## Test Generation Process

### Step 1: Analyze Code
The skill examines:
- Function/method signatures and return types
- External dependencies and imports
- Error conditions and exceptions
- Class hierarchies and interfaces
- Async/await patterns

### Step 2: Identify Test Cases
For each function/method:
- Happy path scenarios
- Error and exception handling
- Boundary conditions (null, undefined, empty, zero, negative)
- Input validation
- State changes
- Return value correctness

### Step 3: Generate Tests
Creates test files with:
- Proper file naming conventions (test.js, _test.go, test.py, etc.)
- Clear test structure and organization
- Descriptive test names
- Setup and teardown
- Assertions and expectations

### Step 4: Add Test Utilities
Includes when needed:
- Mock objects for external services
- Stub functions for dependencies
- Test fixtures and factory functions
- Helper utilities for common assertions

### Step 5: Suggest Improvements
Recommends:
- Uncovered code paths
- Missing edge case tests
- Performance test opportunities
- Test organization improvements
- Coverage metrics to target

## Usage Examples

### JavaScript Function
Provide a JavaScript function and get:
- Jest test suite with describe/test blocks
- Mock implementations for external calls
- Parametrized tests for multiple inputs

### Python Class
Provide a Python class and get:
- Pytest test class with test methods
- Fixtures for setup/teardown
- Parametrized test cases

### Go Function
Provide a Go function and get:
- Table-driven tests
- Subtests for different scenarios
- Error case handling

## Key Features

- **Framework-Aware**: Generates code matching your testing framework's conventions
- **Edge Case Detection**: Automatically identifies boundary conditions and error states
- **Comprehensive Mocking**: Creates appropriate mocks for dependencies
- **Coverage-Focused**: Suggests which code paths need testing
- **Ready to Use**: Generated tests are executable immediately
- **Maintainable**: Clear naming and organization for easy updates

## References

This skill includes testing patterns and best practices in the references directory to guide test generation.

---
