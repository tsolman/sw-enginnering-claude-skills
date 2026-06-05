# sw-enginnering-claude-skills

A collection of software engineering skills for Claude Code CLI. These skills extend Claude's capabilities with specialized knowledge and workflows for common software engineering tasks.

## Installation

```bash
npm install sw-enginnering-claude-skills
```

The skills will be automatically installed to `~/.claude/skills/` after installation.

### Global Installation

For system-wide access:

```bash
npm install -g sw-enginnering-claude-skills
```

## Skills Included

| Skill | Description |
|-------|-------------|
| **code-review-assistant** | Comprehensive code review tool for analyzing bugs, security issues, performance problems, and style violations |
| **database-helper** | Database schema design, migration generation, and query optimization |
| **product-manager** | Create user flows, PRDs, and maintain team alignment |
| **senior-architect** | Technical application design with system architecture, database schemas, and API designs |
| **senior-engineer** | Senior full-stack software engineer with expertise in TypeScript, React, Node.js, and Rust |
| **technical-docs** | Generate documentation including READMEs, API references, and ADRs |
| **testing-generator** | Automatically generate comprehensive test suites |

## Usage

After installation, the skills are available in Claude Code. Trigger them using their names or associated keywords:

```
/code-review-assistant   - Review code for issues
/database-helper         - Help with database tasks
/product-manager         - Create PRDs and user flows
/senior-architect        - Design system architecture
/senior-engineer         - Build full-stack features
/technical-docs          - Generate documentation
/testing-generator       - Generate test suites
```

## Token Usage & Cost Tracker

This package includes a terminal widget to track your Claude Code token usage and estimated costs.

### View Token Costs

After global installation, run:

```bash
claude-token-cost
```

Or using npm:

```bash
npm run token-cost
```

This displays:
- **Total usage by model** - Input/output tokens and cache usage with costs
- **Last 7 days** - Daily breakdown of messages, tool calls, and estimated costs
- **Summary** - Total sessions, messages, and all-time estimated cost

### Cost Tracker Options

```bash
claude-token-cost --help    # Show help
claude-token-cost --json    # Output raw JSON data
```

### Pricing

Costs are estimated based on Anthropic's published pricing:

| Model | Input | Output | Cache Read | Cache Write |
|-------|-------|--------|------------|-------------|
| Claude Opus 4.5 | $15/1M | $75/1M | $1.50/1M | $18.75/1M |
| Claude Sonnet 4 | $3/1M | $15/1M | $0.30/1M | $3.75/1M |

## Commands

### List available skills

```bash
npm run list-skills
```

### View token costs

```bash
npm run token-cost
```

### Uninstall skills

To remove the skills from `~/.claude/skills/`:

```bash
npm run uninstall-skills
```

### Reinstall skills

Run the postinstall script manually:

```bash
npm run postinstall
```

## Manual Installation

If you prefer to install skills manually:

1. Clone or download this package
2. Copy the contents of the `skills/` directory to `~/.claude/skills/`

```bash
cp -R skills/* ~/.claude/skills/
```

## Updating Skills

To update to the latest version:

```bash
npm update sw-enginnering-claude-skills
```

The postinstall script will automatically overwrite existing skills with the updated versions.

## License

MIT — see [LICENSE](LICENSE) for details.
