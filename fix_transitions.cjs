const fs = require('fs');
const path = require('path');
const dir = 'd:/03. Projects/NursingHomeCare/src/shared/components';

const transitions = [
  // all 0.2s → var(--transition-fast) (0.15s) or keep as all 0.2s → new token "all 0.2s ease" = --transition-normal? 
  // Actually 0.2s is between fast(0.15) and normal(0.25). Let's add a base token.
  // For now: map common patterns
  { regex: /transition:\s*all\s+0\.15s[^;]*/g, replacement: 'transition: all var(--transition-fast)' },
  { regex: /transition:\s*all\s+0\.2s\s*ease;/g, replacement: 'transition: all var(--transition-fast);' },
  { regex: /transition:\s*all\s+0\.2s;/g, replacement: 'transition: all var(--transition-fast);' },
  { regex: /transition:\s*all\s+0\.25s[^;]*/g, replacement: 'transition: all var(--transition-normal)' },
  { regex: /transition:\s*all\s+0\.3s\s*cubic-bezier[^;]*/g, replacement: 'transition: var(--transition-smooth)' },
  { regex: /transition:\s*border-color\s+0\.2s,\s*box-shadow\s+0\.2s;/g, replacement: 'transition: var(--transition-color);' },
  { regex: /transition:\s*border-color\s+0\.2s;/g, replacement: 'transition: var(--transition-color);' },
  { regex: /transition:\s*background-color\s+0\.2s;/g, replacement: 'transition: var(--transition-bg);' },
  { regex: /transition:\s*transform\s+0\.2s;/g, replacement: 'transition: transform var(--transition-fast);' },
];

let totalFixed = 0;

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.scss')) return;
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  transitions.forEach(({ regex, replacement }) => {
    const newContent = content.replace(regex, replacement);
    if (newContent !== content) {
      content = newContent;
      changed = true;
      totalFixed++;
    }
  });

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed: ' + file);
  }
});

console.log('Total fixes: ' + totalFixed);
