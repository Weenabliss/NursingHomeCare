const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  // Z-index
  { regex: /z-index:\s*10;/g, replacement: 'z-index: var(--z-sticky);' },
  { regex: /z-index:\s*50;/g, replacement: 'z-index: var(--z-dropdown);' },
  { regex: /z-index:\s*100;/g, replacement: 'z-index: var(--z-tooltip);' },
  
  // Font Weights
  { regex: /font-weight:\s*400;/g, replacement: 'font-weight: var(--font-weight-normal);' },
  { regex: /font-weight:\s*500;/g, replacement: 'font-weight: var(--font-weight-medium);' },
  { regex: /font-weight:\s*600;/g, replacement: 'font-weight: var(--font-weight-semibold);' },
  { regex: /font-weight:\s*700;/g, replacement: 'font-weight: var(--font-weight-bold);' },
  { regex: /font-weight:\s*800;/g, replacement: 'font-weight: var(--font-weight-extrabold);' },
  
  // Cleanup bad redundant variables from previous script
  { regex: /var\(--success-border,\s*var\(--success-light\)\)/g, replacement: 'var(--success-border, var(--success-light))' }, // This was right but maybe I should just use `var(--success-border)` without fallback if it's not needed. Wait, actually I will remove the fallback entirely!
  { regex: /var\(--([a-z-]+),\s*var\(--\1\)\)/g, replacement: 'var(--$1)' }, // like var(--success-dark, var(--success-dark))
  { regex: /var\(--success-border,\s*var\(--success-light\)\)/g, replacement: 'var(--success-border)' }, 
  { regex: /var\(--danger-light,\s*var\(--danger-border\)\)/g, replacement: 'var(--danger-border)' }, // the fallback wasn't really needed
  { regex: /var\(--danger-border,\s*var\(--danger-border\)\)/g, replacement: 'var(--danger-border)' },
  { regex: /var\(--primary-light,\s*var\(--background-alt\)\)/g, replacement: 'var(--primary-light)' },
  { regex: /var\(--primary-light,\s*var\(--primary-light\)\)/g, replacement: 'var(--primary-light)' },

  // Remaining px values (min-width, max-width, etc.)
  { regex: /min-width:\s*160px/g, replacement: 'min-width: 10rem' },
  { regex: /min-width:\s*250px/g, replacement: 'min-width: 15rem' }
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

  // Check for any hardcoded hex that's not a CSS variable
  // Not replacing blindly, just logging them so I can fix them.
  const hexMatch = content.match(/#[0-9a-fA-F]{3,6}/g);
  if (hexMatch) {
      // console.log(`Found HEX in ${filePath}: ${hexMatch}`);
  }

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
