---
name: technical-docs
description: |
  Generate comprehensive documentation from codebases including READMEs, API references, Architecture Decision Records (ADRs), inline code comments, and module documentation. Use this skill when you need to analyze code and produce technical documentation in Markdown or code-specific formats (JSDoc, docstrings).
  TRIGGERS: "documentation", "docs", "README", "API docs", "ADR", "architecture decision", "document this", "explain this code", "generate documentation"
---

# Technical Docs

## Overview

The technical-docs skill automates the generation of professional documentation from source code. It analyzes codebases to identify structure, purpose, and dependencies, then produces appropriate documentation in multiple formats. This skill supports creating READMEs, API references, Architecture Decision Records (ADRs), inline code documentation, and module-level documentation.

## Workflow: Codebase Analysis to Documentation

The skill follows a systematic process:

1. **Analyze Codebase** - Examine file structure, dependencies, entry points, and key modules to understand the project
2. **Identify Documentation Type** - Determine what type(s) of documentation are needed based on the codebase and user request
3. **Extract Information** - Gather relevant details: functions, endpoints, classes, configuration, workflows, and architectural decisions
4. **Generate Documentation** - Create structured documentation using appropriate templates and formatting
5. **Output** - Deliver documentation in the requested format (Markdown for most, JSDoc/docstrings for inline comments)

## Supported Documentation Types

### README Documentation
Project overview, installation instructions, usage examples, API quick start, and contributing guidelines. Use when onboarding new developers or documenting a public project.

**Generated sections:**
- Project description and badges
- Installation/setup instructions
- Quick start usage examples
- API overview with links to detailed docs
- Contributing guidelines
- License information

### API Reference Documentation
Comprehensive endpoint or function reference with parameters, response formats, and usage examples. Use for REST APIs, Python packages, JavaScript libraries, or similar interfaces.

**Generated sections:**
- Base URL/import information
- Authentication/setup requirements
- Endpoint/function signatures
- Parameters with types and descriptions
- Response examples
- Error codes and handling
- Usage examples

### Architecture Decision Records (ADRs)
Document important architectural decisions with context and consequences. Use when establishing system design patterns or documenting significant technical choices.

**Generated sections:**
- Title: brief description of the decision
- Status: Proposed/Accepted/Deprecated/Superseded
- Context: why the decision was needed
- Decision: what was decided
- Consequences: positive and negative impacts
- Alternatives considered: other options evaluated

### Inline Code Documentation
JSDoc comments, Python docstrings, and inline comments explaining complex logic. Use for improving code readability and IDE documentation support.

**Generated formats:**
- JSDoc for JavaScript/TypeScript (functions, classes, parameters, return values)
- Python docstrings (Google or NumPy style)
- Go documentation comments
- Rust doc comments

### Module/Function Documentation
Detailed documentation for specific modules, classes, or functions including purpose, parameters, and usage patterns.

**Generated sections:**
- Module/function name and purpose
- Parameter descriptions with types
- Return value documentation
- Usage examples
- Related functions/modules

## Example Requests and Generated Output

**Request 1: "Generate a README for this Node.js project"**
- Analyzes package.json, entry point, and source structure
- Creates README with installation, usage, and API overview sections
- Includes development and contributing sections

**Request 2: "Create API documentation for this Python REST service"**
- Examines route definitions, handlers, and response models
- Generates comprehensive endpoint reference with examples
- Documents authentication and error handling

**Request 3: "Write JSDoc comments for the utils module"**
- Analyzes each exported function and class
- Generates JSDoc blocks with parameter and return type documentation
- Maintains consistent formatting with existing code

**Request 4: "Document the architectural decision to use PostgreSQL"**
- Creates an ADR with decision context and consequences
- Documents alternatives that were considered
- Provides a record for future reference

## Resources

### references/
The skill includes documentation templates and patterns for quick reference:

- **doc-templates.md** - Templates for README, API docs, ADR, and module documentation with examples and best practices

---

**To use this skill:** Reference the doc-templates.md file in references/ for consistent documentation patterns and formatting guidelines.
