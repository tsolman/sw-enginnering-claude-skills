#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_SOURCE = path.join(__dirname, '..', 'skills');
const CLAUDE_SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function installSkills() {
  console.log('\n📦 Installing Claude Code skills...\n');

  // Ensure Claude skills directory exists
  if (!fs.existsSync(CLAUDE_SKILLS_DIR)) {
    fs.mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
    console.log(`Created ${CLAUDE_SKILLS_DIR}`);
  }

  // Get list of skills to install
  const skills = fs.readdirSync(SKILLS_SOURCE).filter(file => {
    return fs.statSync(path.join(SKILLS_SOURCE, file)).isDirectory();
  });

  let installed = 0;
  let skipped = 0;

  for (const skill of skills) {
    const srcPath = path.join(SKILLS_SOURCE, skill);
    const destPath = path.join(CLAUDE_SKILLS_DIR, skill);

    if (fs.existsSync(destPath)) {
      console.log(`  ⚠️  ${skill} (already exists, overwriting)`);
    } else {
      console.log(`  ✓  ${skill}`);
    }

    copyRecursive(srcPath, destPath);
    installed++;
  }

  console.log(`\n✅ Successfully installed ${installed} skills to ${CLAUDE_SKILLS_DIR}`);
  console.log('\nRestart Claude Code to use the new skills.\n');
}

try {
  installSkills();
} catch (error) {
  console.error('Error installing skills:', error.message);
  process.exit(1);
}
