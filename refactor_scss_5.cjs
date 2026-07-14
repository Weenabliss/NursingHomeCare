const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  { regex: /z-index:\s*99999?;/g, replacement: 'z-index: var(--z-toast);' },
  { regex: /z-index:\s*99998;/g, replacement: 'z-index: calc(var(--z-toast) - 1);' },
  { regex: /z-index:\s*1000;/g, replacement: 'z-index: var(--z-modal);' },
  { regex: /z-index:\s*1;/g, replacement: 'z-index: var(--z-base);' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  replacements.forEach(({ regex, replacement }) => {
    const newContent = content.replace(regex, replacement);
    if (newContent !== content) {
      content = newContent;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.scss')) {
    processFile(path.join(componentsDir, file));
  }
});

console.log("Done");
