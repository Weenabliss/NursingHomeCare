const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  // Colors
  { regex: /#ef4444/gi, replacement: 'var(--danger)' },
  { regex: /#e11d48/gi, replacement: 'var(--danger)' },
  { regex: /#991b1b/gi, replacement: 'var(--danger)' },
  { regex: /#fef2f2/gi, replacement: 'var(--danger-light)' },
  { regex: /#fee2e2/gi, replacement: 'var(--danger-light)' },
  { regex: /#ffffff/gi, replacement: '#fff' },
  { regex: /#000000/gi, replacement: '#000' },
  { regex: /#e0e7ff/gi, replacement: 'var(--primary-light, #e0e7ff)' }, // using fallback
  { regex: /#eef2ff/gi, replacement: 'var(--primary-light, #eef2ff)' },

  // Fonts
  { regex: /font-size:\s*0\.75rem/g, replacement: 'font-size: var(--text-xs)' },
  { regex: /font-size:\s*0\.8[0-9]*rem/g, replacement: 'font-size: var(--text-sm)' },
  { regex: /font-size:\s*0\.9[0-9]*rem/g, replacement: 'font-size: var(--text-sm)' },
  { regex: /font-size:\s*1rem/g, replacement: 'font-size: var(--text-base)' },
  { regex: /font-size:\s*1\.125rem/g, replacement: 'font-size: var(--text-lg)' },
  
  // Spacing values exact replacements to be safe
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*0\.25rem/g, replacement: '$1: var(--spacing-xs)' },
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*0\.5rem/g, replacement: '$1: var(--spacing-sm)' },
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*1rem/g, replacement: '$1: var(--spacing-md)' },
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*1\.5rem/g, replacement: '$1: var(--spacing-lg)' },
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*2rem/g, replacement: '$1: var(--spacing-xl)' },

  // Multi-value paddings/margins (common ones)
  { regex: /(padding|margin):\s*0\.5rem\s+1rem/g, replacement: '$1: var(--spacing-sm) var(--spacing-md)' },
  { regex: /(padding|margin):\s*0\.25rem\s+0\.75rem/g, replacement: '$1: var(--spacing-xs) 0.75rem' },
  { regex: /(padding|margin):\s*0\.75rem\s+1\.5rem/g, replacement: '$1: 0.75rem var(--spacing-lg)' },
  { regex: /(padding|margin):\s*1\.5rem\s+2rem/g, replacement: '$1: var(--spacing-lg) var(--spacing-xl)' },
  { regex: /(padding|margin):\s*0\.5rem\s+2rem/g, replacement: '$1: var(--spacing-sm) var(--spacing-xl)' },
  { regex: /(padding|margin):\s*0\.5rem\s+0/g, replacement: '$1: var(--spacing-sm) 0' },
  { regex: /(padding|margin):\s*1rem\s+0/g, replacement: '$1: var(--spacing-md) 0' },
  { regex: /(padding|margin):\s*2rem\s+0/g, replacement: '$1: var(--spacing-xl) 0' },
  
  // Radiuses
  { regex: /border-radius:\s*4px/g, replacement: 'border-radius: var(--radius-sm)' },
  { regex: /border-radius:\s*6px/g, replacement: 'border-radius: var(--radius-sm)' },
  { regex: /border-radius:\s*8px/g, replacement: 'border-radius: var(--radius-md)' },
  { regex: /border-radius:\s*12px/g, replacement: 'border-radius: var(--radius-md)' },
  { regex: /border-radius:\s*16px/g, replacement: 'border-radius: var(--radius-lg)' },
  { regex: /border-radius:\s*50%/g, replacement: 'border-radius: var(--radius-full)' }
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
