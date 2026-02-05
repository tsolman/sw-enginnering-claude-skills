#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_SOURCE = path.join(__dirname, '..', 'skills');

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  });
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
