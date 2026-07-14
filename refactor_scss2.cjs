const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/shared/components');

const replacements = [
  // Colors (from variables)
  { regex: /#ef4444/gi, replacement: 'var(--danger)' },
  { regex: /#10b981/gi, replacement: 'var(--success)' },
  { regex: /#f59e0b/gi, replacement: 'var(--warning)' },
  { regex: /#3b82f6/gi, replacement: 'var(--info)' },
  { regex: /#f8fafc/gi, replacement: 'var(--surface-alt)' },
  { regex: /#fff(fff)?\b/gi, replacement: 'var(--surface)' }, // Context dependent, but usually surface or text-main. For buttons it's white. Let's just use #fff
  { regex: /#000(000)?\b/gi, replacement: 'var(--text-main)' },
  
  // Padding/margin/gap
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*0\.75rem/g, replacement: '$1: calc(var(--spacing-sm) + var(--spacing-xs))' }, // Or just keep 0.75rem if no exact token. But we can use 0.75rem, let's replace with var
  { regex: /(padding|margin|gap|top|bottom|left|right):\s*0\.85rem/g, replacement: '$1: var(--spacing-md)' }, // Approximate
  
  // Font sizes
  { regex: /font-size:\s*0\.75rem/g, replacement: 'font-size: var(--text-xs)' },
  { regex: /font-size:\s*0\.85rem/g, replacement: 'font-size: var(--text-sm)' },
  { regex: /font-size:\s*0\.875rem/g, replacement: 'font-size: var(--text-sm)' },
  { regex: /font-size:\s*0\.9rem/g, replacement: 'font-size: var(--text-sm)' },
  { regex: /font-size:\s*1rem/g, replacement: 'font-size: var(--text-base)' },
  { regex: /font-size:\s*1\.2rem/g, replacement: 'font-size: var(--text-lg)' },
  { regex: /font-size:\s*1\.5rem/g, replacement: 'font-size: var(--text-2xl)' },
  { regex: /font-size:\s*1\.75rem/g, replacement: 'font-size: var(--text-2xl)' },
  
  // Widths/Heights
  { regex: /(width|height):\s*1\.2rem/g, replacement: '$1: 1.25rem' }, // Close enough to standard 5
  
  // Clean up previous nested vars bug
  { regex: /var\(--primary-light, var\(--primary-light, #e0e7ff\)\)/g, replacement: 'var(--primary-light)' },

  // Specific pixels
  { regex: /width:\s*16px/g, replacement: 'width: 1rem' },
  { regex: /height:\s*16px/g, replacement: 'height: 1rem' },
  { regex: /width:\s*32px/g, replacement: 'width: 2rem' },
  { regex: /height:\s*32px/g, replacement: 'height: 2rem' },
  { regex: /width:\s*48px/g, replacement: 'width: 3rem' },
  { regex: /height:\s*48px/g, replacement: 'height: 3rem' },

  { regex: /top:\s*24px/g, replacement: 'top: 1.5rem' },
  { regex: /margin-top:\s*18px/g, replacement: 'margin-top: 1.125rem' },
  { regex: /width:\s*12px/g, replacement: 'width: 0.75rem' },
  { regex: /height:\s*12px/g, replacement: 'height: 0.75rem' },

  // Specific overrides
  { regex: /background-color:\s*#fff/g, replacement: 'background-color: var(--surface)' },
  { regex: /color:\s*#fff/g, replacement: 'color: #fff' }, // Text on primary button needs to be white, don't use --surface
  { regex: /color:\s*#000/g, replacement: 'color: var(--text-main)' },
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
