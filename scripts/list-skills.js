#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_SOURCE = path.join(__dirname, '..', 'skills');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^(\w[\w-]*):(.*)$/);
    if (!keyMatch) continue;

    const key = keyMatch[1].trim();
    const inlineValue = keyMatch[2].trim();

    // Handle YAML block scalars (| literal, > folded): collect indented lines.
    if (inlineValue === '|' || inlineValue === '>') {
      const blockLines = [];
      while (i + 1 < lines.length && (lines[i + 1].trim() === '' || /^\s/.test(lines[i + 1]))) {
        blockLines.push(lines[++i].trim());
      }
      const joiner = inlineValue === '>' ? ' ' : '\n';
      frontmatter[key] = blockLines.join(joiner).trim();
    } else {
      frontmatter[key] = inlineValue;
    }
  }
  return frontmatter;
}

function listSkills() {
  console.log('\n📚 Available Claude Code Skills\n');
  console.log('=' .repeat(60) + '\n');

  const skills = fs.readdirSync(SKILLS_SOURCE).filter(file => {
    return fs.statSync(path.join(SKILLS_SOURCE, file)).isDirectory();
  });

  for (const skill of skills) {
    const skillPath = path.join(SKILLS_SOURCE, skill, 'SKILL.md');

    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf8');
      const frontmatter = extractFrontmatter(content);

      console.log(`📦 ${frontmatter.name || skill}`);
      if (frontmatter.description) {
        console.log(`   ${frontmatter.description}`);
      }
      console.log('');
    } else {
      console.log(`📦 ${skill}`);
      console.log('   (No description available)');
      console.log('');
    }
  }

  console.log('=' .repeat(60));
  console.log(`\nTotal: ${skills.length} skills\n`);
}

try {
  listSkills();
} catch (error) {
  console.error('Error listing skills:', error.message);
  process.exit(1);
}
