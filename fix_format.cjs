const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function updateImports() {
  walkDir(srcDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Check if file uses formatCurrency, formatCurrencyShort, getInitials from facilityUtils
    if (content.includes('facilityUtils')) {
        let importedNames = [];
        const regex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*)facilityUtils['"]/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
             const items = match[1].split(',').map(s => s.trim());
             const formatItems = items.filter(i => ['formatCurrency', 'formatCurrencyShort', 'getInitials'].includes(i));
             if (formatItems.length > 0) {
                 importedNames.push(...formatItems);
                 
                 const otherItems = items.filter(i => !['formatCurrency', 'formatCurrencyShort', 'getInitials'].includes(i));
                 const importPath = match[2] + 'facilityUtils';
                 const newFormatImportPath = importPath.replace('utils/facilityUtils', 'shared/utils/format');
                 
                 let newImportStr = '';
                 if (otherItems.length > 0) {
                     newImportStr += `import { ${otherItems.join(', ')} } from "${importPath}";\n`;
                 }
                 newImportStr += `import { ${formatItems.join(', ')} } from "${newFormatImportPath}";`;
                 
                 content = content.replace(match[0], newImportStr);
                 hasChanges = true;
             }
        }
    }
    
    if (hasChanges) {
       fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

updateImports();
