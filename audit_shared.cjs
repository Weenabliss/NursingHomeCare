const fs = require('fs');
const path = require('path');
const dir = 'd:/03. Projects/NursingHomeCare/src/shared/components';

const issues = { scss: [], tsx: [] };

// === SCSS Checks ===
const scssPatterns = [
  { label: 'Hardcoded hex color', regex: /#[0-9a-fA-F]{3,6}/, exclude: /var\(/ },
  { label: 'Hardcoded font-weight number', regex: /font-weight:\s*\d+;/, exclude: /var\(/ },
  { label: 'Hardcoded font-size rem', regex: /font-size:\s*[\d.]+rem;/, exclude: /var\(/ },
  { label: 'Hardcoded z-index', regex: /z-index:\s*\d+;/, exclude: /var\(/ },
  { label: 'Hardcoded border-radius px', regex: /border-radius:\s*\d+px;/, exclude: /var\(/ },
  { label: 'Hardcoded transition (no var)', regex: /transition:.*\d+\.\d+s/, exclude: /var\(--transition/ },
];

// === TSX Checks ===
const i18nViolationFiles = [];
const importOrderViolationFiles = [];
const doubleSemicolonFiles = [];
const hardcodedInlineStyleFiles = [];

fs.readdirSync(dir).forEach(file => {
  const fullPath = path.join(dir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  if (file.endsWith('.scss')) {
    scssPatterns.forEach(({ label, regex, exclude }) => {
      lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith('//') && regex.test(line) && (!exclude || !exclude.test(line))) {
          issues.scss.push({ file, line: i + 1, label, content: trimmed.slice(0, 100) });
        }
      });
    });
  }

  if (file.endsWith('.tsx')) {
    // Check double semicolons
    if (/;;/.test(content)) {
      doubleSemicolonFiles.push(file);
    }

    // Check import mid-file (import after non-import code)
    let seenCode = false;
    let midImportViolation = false;
    lines.forEach(line => {
      const t = line.trim();
      if (t.startsWith('import ') && seenCode) {
        midImportViolation = true;
      }
      if (t && !t.startsWith('import ') && !t.startsWith('//') && !t.startsWith('/*') && !t.startsWith('*') && !t.startsWith('---')) {
        seenCode = true;
      }
    });
    if (midImportViolation) {
      importOrderViolationFiles.push(file);
    }

    // Check hardcoded inline styles (static values not from props)
    const hardcodedInlineStyleRegex = /style=\{\{[^}]*(color:\s*["']#|padding:\s*["']\d|margin:\s*["']\d|fontSize:\s*["']\d)/;
    if (hardcodedInlineStyleRegex.test(content)) {
      hardcodedInlineStyleFiles.push(file);
    }

    // Check Vietnamese text not using t()
    // Look for JSX text content that has Vietnamese characters but isn't wrapped in t()
    const viTextRegex = />([^{<>]*[\u00c0-\u1ef9][^{<>]*)</g;
    let match;
    const viViolations = [];
    while ((match = viTextRegex.exec(content)) !== null) {
      viViolations.push(match[1].trim().slice(0, 60));
    }
    if (viViolations.length > 0) {
      i18nViolationFiles.push({ file, texts: viViolations.slice(0, 3) });
    }
  }
});

// === REPORT ===
console.log('\n========================================');
console.log(' FINAL AUDIT REPORT: src/shared');
console.log('========================================\n');

// SCSS
console.log('--- [1] SCSS Design Tokens ---');
if (issues.scss.length === 0) {
  console.log('  PASS - No hardcoded values found\n');
} else {
  console.log('  FAIL - Violations:');
  issues.scss.forEach(i => {
    console.log('    ' + i.file + ':' + i.line + ' [' + i.label + ']');
    console.log('      => ' + i.content);
  });
  console.log('');
}

// Double semicolons
console.log('--- [2] TSX Syntax (double semicolons) ---');
if (doubleSemicolonFiles.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  FAIL: ' + doubleSemicolonFiles.join(', ') + '\n');
}

// Import order
console.log('--- [3] TSX Import Order ---');
if (importOrderViolationFiles.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  FAIL (imports mid-file): ' + importOrderViolationFiles.join(', ') + '\n');
}

// Hardcoded inline styles
console.log('--- [4] TSX Inline Styles (no hardcoded values) ---');
if (hardcodedInlineStyleFiles.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  FAIL: ' + hardcodedInlineStyleFiles.join(', ') + '\n');
}

// i18n violations
console.log('--- [5] TSX i18n (no hardcoded text) ---');
if (i18nViolationFiles.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  WARN (check if intentional):');
  i18nViolationFiles.forEach(v => {
    console.log('    ' + v.file + ':');
    v.texts.forEach(t => console.log('      "' + t + '"'));
  });
  console.log('');
}

// Hooks check
console.log('--- [6] Hooks (no domain imports) ---');
const hooksDir = 'd:/03. Projects/NursingHomeCare/src/shared/hooks';
let hookViolations = [];
fs.readdirSync(hooksDir).forEach(file => {
  const content = fs.readFileSync(path.join(hooksDir, file), 'utf8');
  if (/from ['"].*\/(contexts|modules|mock|pages)\//.test(content)) {
    hookViolations.push(file);
  }
});
if (hookViolations.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  FAIL (domain dependencies): ' + hookViolations.join(', ') + '\n');
}

// Utils check
console.log('--- [7] Utils (pure functions, no React) ---');
const utilsDir = 'd:/03. Projects/NursingHomeCare/src/shared/utils';
let utilViolations = [];
fs.readdirSync(utilsDir).forEach(file => {
  if (file === 'activityLogger.ts') return; // allowed side effects
  const content = fs.readFileSync(path.join(utilsDir, file), 'utf8');
  if (/from ['"]react['"]/.test(content)) {
    utilViolations.push(file + ' (imports React)');
  }
});
if (utilViolations.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  FAIL: ' + utilViolations.join(', ') + '\n');
}

// File pairing
console.log('--- [8] Component File Pairing (.tsx + .module.scss) ---');
const allFiles = fs.readdirSync(dir);
const tsxFiles = allFiles.filter(f => f.endsWith('.tsx'));
const scssFiles = new Set(allFiles.filter(f => f.endsWith('.module.scss')).map(f => f.replace('.module.scss', '')));
let missingScss = [];
tsxFiles.forEach(f => {
  const base = f.replace('.tsx', '');
  if (!scssFiles.has(base)) {
    missingScss.push(f + ' (missing .module.scss)');
  }
});
if (missingScss.length === 0) {
  console.log('  PASS\n');
} else {
  console.log('  WARN: ' + missingScss.join(', ') + '\n');
}

console.log('========================================');
console.log(' AUDIT COMPLETE');
console.log('========================================\n');
