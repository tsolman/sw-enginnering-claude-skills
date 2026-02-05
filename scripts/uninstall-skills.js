#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_SOURCE = path.join(__dirname, '..', 'skills');
const CLAUDE_SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

function removeRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

function uninstallSkills() {
  console.log('\n🗑️  Uninstalling Claude Code skills...\n');

  if (!fs.existsSync(CLAUDE_SKILLS_DIR)) {
    console.log('No skills directory found. Nothing to uninstall.');
    return;
  }

  // Get list of skills from this package
  const packageSkills = fs.readdirSync(SKILLS_SOURCE).filter(file => {
    return fs.statSync(path.join(SKILLS_SOURCE, file)).isDirectory();
  });

  let removed = 0;

  for (const skill of packageSkills) {
    const skillPath = path.join(CLAUDE_SKILLS_DIR, skill);

    if (fs.existsSync(skillPath)) {
      removeRecursive(skillPath);
      console.log(`  ✓  Removed ${skill}`);
      removed++;
    } else {
      console.log(`  -  ${skill} (not found)`);
    }
  }

  console.log(`\n✅ Removed ${removed} skills from ${CLAUDE_SKILLS_DIR}`);
  console.log('\nRestart Claude Code to apply changes.\n');
}

try {
  uninstallSkills();
} catch (error) {
  console.error('Error uninstalling skills:', error.message);
  process.exit(1);
}
