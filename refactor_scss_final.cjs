const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  // Remaining paddings and margins
  { regex: /(padding|margin):\s*var\(--spacing-sm\)\s+2rem/g, replacement: '$1: var(--spacing-sm) var(--spacing-xl)' },
  { regex: /(padding|margin):\s*3rem/g, replacement: '$1: var(--spacing-2xl)' },
  { regex: /(padding|margin):\s*2rem/g, replacement: '$1: var(--spacing-xl)' },
  { regex: /(padding|margin):\s*1\.5rem/g, replacement: '$1: var(--spacing-lg)' },
  { regex: /(padding|margin):\s*1rem/g, replacement: '$1: var(--spacing-md)' },
  
  // Specific spacing token fixes
  { regex: /padding:\s*0\s+0\.5rem/g, replacement: 'padding: 0 var(--spacing-sm)' },
  { regex: /padding:\s*var\(--spacing-sm\)\s+1rem/g, replacement: 'padding: var(--spacing-sm) var(--spacing-md)' },
  { regex: /margin:\s*0\s+0\s+0\.5rem\s+0/g, replacement: 'margin: 0 0 var(--spacing-sm) 0' },
  
  // Colors that I missed due to specific exact matching
  { regex: /#f1f5f9/g, replacement: 'var(--background-alt)' },
  { regex: /#bbf7d0/g, replacement: 'var(--success-light)' },
  { regex: /#15803d/g, replacement: 'var(--success-dark)' },
  { regex: /#166534/g, replacement: 'var(--success-dark)' },
  { regex: /#fecaca/g, replacement: 'var(--danger-border)' },
  { regex: /rgba\(99,\s*91,\s*255,\s*0\.15\)/g, replacement: 'rgba(var(--primary-rgb), 0.15)' },
  { regex: /rgba\(99,\s*91,\s*255,\s*0\.08\)/g, replacement: 'rgba(var(--primary-rgb), 0.08)' }
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
