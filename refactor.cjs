const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dirsToCreate = [
  path.join(srcDir, 'shared', 'components'),
  path.join(srcDir, 'shared', 'hooks'),
  path.join(srcDir, 'shared', 'utils'),
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to move files
function moveDirContents(source, dest) {
  if (!fs.existsSync(source)) return;
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const srcPath = path.join(source, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      moveDirContents(srcPath, destPath);
      fs.rmdirSync(srcPath);
    } else {
      fs.renameSync(srcPath, destPath);
    }
  });
}

// Move Atoms and Molecules to shared/components
moveDirContents(path.join(srcDir, 'components', 'atoms'), path.join(srcDir, 'shared', 'components'));
moveDirContents(path.join(srcDir, 'components', 'molecules'), path.join(srcDir, 'shared', 'components'));

// Move specific hooks
const hooksToMove = ['useActivityLog.ts', 'useFormModal.ts'];
hooksToMove.forEach(hook => {
  const srcHook = path.join(srcDir, 'hooks', hook);
  const destHook = path.join(srcDir, 'shared', 'hooks', hook);
  if (fs.existsSync(srcHook)) {
    fs.renameSync(srcHook, destHook);
  }
});

// Walk through all TS/TSX/SCSS files to update imports
function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx') || filepath.endsWith('.scss')) {
        callback(filepath);
      }
    }
  });
}

walkSync(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Replace component imports
  content = content.replace(/\/components\/atoms\//g, '/shared/components/');
  content = content.replace(/\/components\/molecules\//g, '/shared/components/');
  
  // Replace hook imports
  content = content.replace(/\/hooks\/useActivityLog/g, '/shared/hooks/useActivityLog');
  content = content.replace(/\/hooks\/useFormModal/g, '/shared/hooks/useFormModal');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filepath)}`);
  }
});

console.log('Refactor script completed successfully.');
