#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Anthropic pricing per 1M tokens (USD)
const PRICING = {
  'claude-opus-4-5-20251101': {
    name: 'Claude Opus 4.5',
    input: 15.00,
    output: 75.00,
    cacheRead: 1.50,      // 10% of input
    cacheCreation: 18.75  // 125% of input
  },
  'claude-sonnet-4-20250514': {
    name: 'Claude Sonnet 4',
    input: 3.00,
    output: 15.00,
    cacheRead: 0.30,      // 10% of input
    cacheCreation: 3.75   // 125% of input
  },
  'claude-3-5-sonnet-20241022': {
    name: 'Claude 3.5 Sonnet',
    input: 3.00,
    output: 15.00,
    cacheRead: 0.30,
    cacheCreation: 3.75
  },
  'claude-3-opus-20240229': {
    name: 'Claude 3 Opus',
    input: 15.00,
    output: 75.00,
    cacheRead: 1.50,
    cacheCreation: 18.75
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    input: 0.25,
    output: 1.25,
    cacheRead: 0.025,
    cacheCreation: 0.3125
  }
};

const CLAUDE_STATS_FILE = path.join(os.homedir(), '.claude', 'stats-cache.json');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m'
};

function formatCurrency(amount) {
  return `$${amount.toFixed(4)}`;
}

function formatTokens(tokens) {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(2)}M`;
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
}

function calculateCost(modelId, usage) {
  const pricing = PRICING[modelId];
  if (!pricing) {
    // Default to Sonnet pricing for unknown models
    return calculateCost('claude-sonnet-4-20250514', usage);
  }

  const inputCost = (usage.inputTokens || 0) * pricing.input / 1000000;
  const outputCost = (usage.outputTokens || 0) * pricing.output / 1000000;
  const cacheReadCost = (usage.cacheReadInputTokens || 0) * pricing.cacheRead / 1000000;
  const cacheCreationCost = (usage.cacheCreationInputTokens || 0) * pricing.cacheCreation / 1000000;

  return {
    input: inputCost,
    output: outputCost,
    cacheRead: cacheReadCost,
    cacheCreation: cacheCreationCost,
    total: inputCost + outputCost + cacheReadCost + cacheCreationCost
  };
}

function drawBox(title, content, width = 60) {
  const horizontal = '─'.repeat(width - 2);
  const top = `╭${horizontal}╮`;
  const bottom = `╰${horizontal}╯`;

  console.log(`${colors.cyan}${top}${colors.reset}`);
  console.log(`${colors.cyan}│${colors.reset} ${colors.bold}${title.padEnd(width - 4)}${colors.reset} ${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}├${horizontal}┤${colors.reset}`);

  content.forEach(line => {
    const displayLen = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const padding = width - 4 - displayLen;
    console.log(`${colors.cyan}│${colors.reset} ${line}${' '.repeat(Math.max(0, padding))} ${colors.cyan}│${colors.reset}`);
  });

  console.log(`${colors.cyan}${bottom}${colors.reset}`);
}

function getDateRange(days) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

function displayStats() {
  if (!fs.existsSync(CLAUDE_STATS_FILE)) {
    console.log(`${colors.red}Error: Claude Code stats file not found at ${CLAUDE_STATS_FILE}${colors.reset}`);
    console.log('Make sure you have used Claude Code at least once.');
    process.exit(1);
  }

  const stats = JSON.parse(fs.readFileSync(CLAUDE_STATS_FILE, 'utf8'));
  const today = new Date().toISOString().split('T')[0];

  console.log('\n');

  // ═══════════════════════════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════════════════════════
  console.log(`${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║${colors.reset}       ${colors.bold}💰 CLAUDE CODE TOKEN USAGE & COST TRACKER 💰${colors.reset}        ${colors.bold}${colors.cyan}║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════
  // TOTAL USAGE BY MODEL
  // ═══════════════════════════════════════════════════════════════════
  let totalCost = 0;
  const modelLines = [];

  for (const [modelId, usage] of Object.entries(stats.modelUsage || {})) {
    const pricing = PRICING[modelId];
    const modelName = pricing?.name || modelId;
    const cost = calculateCost(modelId, usage);
    totalCost += cost.total;

    modelLines.push(`${colors.bold}${modelName}${colors.reset}`);
    modelLines.push(`  Input:          ${formatTokens(usage.inputTokens || 0).padStart(10)} → ${colors.green}${formatCurrency(cost.input)}${colors.reset}`);
    modelLines.push(`  Output:         ${formatTokens(usage.outputTokens || 0).padStart(10)} → ${colors.green}${formatCurrency(cost.output)}${colors.reset}`);
    modelLines.push(`  Cache Read:     ${formatTokens(usage.cacheReadInputTokens || 0).padStart(10)} → ${colors.green}${formatCurrency(cost.cacheRead)}${colors.reset}`);
    modelLines.push(`  Cache Creation: ${formatTokens(usage.cacheCreationInputTokens || 0).padStart(10)} → ${colors.green}${formatCurrency(cost.cacheCreation)}${colors.reset}`);
    modelLines.push(`  ${colors.dim}─────────────────────────────────────────${colors.reset}`);
    modelLines.push(`  ${colors.bold}Subtotal:${colors.reset}                        ${colors.yellow}${formatCurrency(cost.total)}${colors.reset}`);
    modelLines.push('');
  }

  drawBox('📊 TOTAL USAGE BY MODEL (All Time)', modelLines);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════
  // DAILY BREAKDOWN (Last 7 days)
  // ═══════════════════════════════════════════════════════════════════
  const last7Days = getDateRange(7);
  const dailyActivity = stats.dailyActivity || [];
  const dailyTokens = stats.dailyModelTokens || [];

  const dailyLines = [];
  let weeklyTotal = 0;

  for (const date of last7Days) {
    const activity = dailyActivity.find(d => d.date === date);
    const tokens = dailyTokens.find(d => d.date === date);

    const isToday = date === today;
    const dateLabel = isToday ? `${date} (today)` : date;

    if (activity || tokens) {
      const msgs = activity?.messageCount || 0;
      const tools = activity?.toolCallCount || 0;

      // Estimate daily cost based on tokens (rough estimate using output tokens)
      let dailyCost = 0;
      if (tokens?.tokensByModel) {
        for (const [model, tokenCount] of Object.entries(tokens.tokensByModel)) {
          const pricing = PRICING[model] || PRICING['claude-sonnet-4-20250514'];
          // Assume tokens are primarily output tokens for estimation
          dailyCost += tokenCount * pricing.output / 1000000;
        }
      }
      weeklyTotal += dailyCost;

      const costStr = dailyCost > 0 ? `${colors.yellow}~${formatCurrency(dailyCost)}${colors.reset}` : `${colors.dim}$0.0000${colors.reset}`;
      dailyLines.push(`${isToday ? colors.cyan : ''}${dateLabel.padEnd(18)}${colors.reset} │ ${String(msgs).padStart(5)} msgs │ ${String(tools).padStart(4)} tools │ ${costStr}`);
    } else {
      dailyLines.push(`${colors.dim}${dateLabel.padEnd(18)} │     0 msgs │    0 tools │ $0.0000${colors.reset}`);
    }
  }
  dailyLines.push(`${colors.dim}─────────────────────────────────────────────────────${colors.reset}`);
  dailyLines.push(`${colors.bold}Weekly Est. Total:${colors.reset}                           ${colors.yellow}~${formatCurrency(weeklyTotal)}${colors.reset}`);

  drawBox('📅 LAST 7 DAYS', dailyLines);
  console.log('');

  // ═══════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════
  const summaryLines = [
    `Total Sessions:     ${colors.cyan}${stats.totalSessions || 0}${colors.reset}`,
    `Total Messages:     ${colors.cyan}${stats.totalMessages || 0}${colors.reset}`,
    `First Used:         ${colors.dim}${stats.firstSessionDate ? new Date(stats.firstSessionDate).toLocaleDateString() : 'N/A'}${colors.reset}`,
    `Last Computed:      ${colors.dim}${stats.lastComputedDate || 'N/A'}${colors.reset}`,
    '',
    `${colors.bold}${colors.green}═══════════════════════════════════════════${colors.reset}`,
    `${colors.bold}   ESTIMATED ALL-TIME COST: ${colors.yellow}${formatCurrency(totalCost)}${colors.reset}`,
    `${colors.bold}${colors.green}═══════════════════════════════════════════${colors.reset}`,
  ];

  drawBox('📈 SUMMARY', summaryLines);

  console.log('');
  console.log(`${colors.dim}Note: Costs are estimates based on Anthropic's published pricing.${colors.reset}`);
  console.log(`${colors.dim}Cache tokens provide significant savings vs regular input tokens.${colors.reset}`);
  console.log('');
}

// Check for command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${colors.bold}Claude Code Token Cost Tracker${colors.reset}

Usage: npx sw-enginnering-claude-skills token-cost [options]

Options:
  --help, -h     Show this help message
  --json         Output raw JSON data instead of formatted display

This tool reads your Claude Code usage statistics and calculates
estimated costs based on Anthropic's published pricing.

Data is read from: ~/.claude/stats-cache.json
`);
  process.exit(0);
}

if (args.includes('--json')) {
  const stats = JSON.parse(fs.readFileSync(CLAUDE_STATS_FILE, 'utf8'));

  // Add cost calculations to the output
  const output = {
    ...stats,
    calculatedCosts: {}
  };

  for (const [modelId, usage] of Object.entries(stats.modelUsage || {})) {
    output.calculatedCosts[modelId] = calculateCost(modelId, usage);
  }

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

displayStats();
