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
    
    // Fix imports to activityLogger
    if (content.includes('utils/activityLogger')) {
        content = content.replace(/from\s+['"]([^'"]*)utils\/activityLogger['"]/g, (match, p1) => {
             // if it was importing from ../utils/activityLogger, it should now import from ../shared/utils/activityLogger or similar.
             // We can just use absolute alias if we had one, but we don't.
             // We can just replace utils/activityLogger with shared/utils/activityLogger, assuming the relative depth is the same.
             return match.replace('utils/activityLogger', 'shared/utils/activityLogger');
        });
        hasChanges = true;
    }
    
    if (hasChanges) {
       fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

updateImports();
