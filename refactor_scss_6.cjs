const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  // Common specific px to spacing vars
  { regex: /padding:\s*4px/g, replacement: 'padding: var(--spacing-xs)' },
  { regex: /padding:\s*8px/g, replacement: 'padding: var(--spacing-sm)' },
  { regex: /padding:\s*12px/g, replacement: 'padding: 0.75rem' }, // No exact var, but 0.75rem is standard
  { regex: /padding:\s*16px/g, replacement: 'padding: var(--spacing-md)' },
  { regex: /padding:\s*0\s+12px/g, replacement: 'padding: 0 0.75rem' },
  { regex: /padding:\s*10px\s+12px/g, replacement: 'padding: 0.625rem 0.75rem' },
  
  { regex: /margin-bottom:\s*2px/g, replacement: 'margin-bottom: 2px' }, // 2px is fine for micro adjustments
  
  // Heights and widths in px
  { regex: /min-height:\s*42px/g, replacement: 'min-height: 2.625rem' },
  { regex: /max-height:\s*300px/g, replacement: 'max-height: 18.75rem' },
  { regex: /max-height:\s*400px/g, replacement: 'max-height: 25rem' },
  
  // Gap
  { regex: /gap:\s*2px/g, replacement: 'gap: 2px' }, // micro gap
  { regex: /gap:\s*4px/g, replacement: 'gap: var(--spacing-xs)' },
  { regex: /gap:\s*8px/g, replacement: 'gap: var(--spacing-sm)' },
  { regex: /gap:\s*12px/g, replacement: 'gap: 0.75rem' },
  { regex: /gap:\s*16px/g, replacement: 'gap: var(--spacing-md)' }
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

  // Convert any remaining Xpx to X/16rem except 1px and 2px
  // Be very careful here.
  const pxRegex = /(:|\s)(3|4|5|6|7|8|9|10|11|12|13|14|15|16|18|20|24|32|40|48|64)px/g;
  let newContent = content.replace(pxRegex, (match, p1, p2) => {
      const val = parseInt(p2, 10);
      const rem = val / 16;
      return `${p1}${rem}rem`;
  });
  
  if (newContent !== content) {
      content = newContent;
      hasChanges = true;
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

console.log("Done px cleanup");
