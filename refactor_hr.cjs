const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const hrDir = path.join(srcDir, 'modules', 'hr');
const dirsToCreate = [
  path.join(hrDir, 'components'),
  path.join(hrDir, 'views'),
  path.join(hrDir, 'context'),
  path.join(hrDir, 'types'),
  path.join(hrDir, 'mock'),
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

// 1. Move contexts
const staffContextSrc = path.join(srcDir, 'contexts', 'StaffContext.tsx');
const staffContextDest = path.join(hrDir, 'context', 'StaffContext.tsx');
if (fs.existsSync(staffContextSrc)) fs.renameSync(staffContextSrc, staffContextDest);

// 2. Move Staff UI components and Views
const staffPagesDir = path.join(srcDir, 'pages', 'staff');
if (fs.existsSync(staffPagesDir)) {
  const files = fs.readdirSync(staffPagesDir);
  files.forEach(file => {
    const srcPath = path.join(staffPagesDir, file);
    if (fs.statSync(srcPath).isDirectory()) {
      if (file === 'components' || file === 'modals') {
        moveDirContents(srcPath, path.join(hrDir, 'components'));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.scss')) {
        fs.renameSync(srcPath, path.join(hrDir, 'views', file));
      }
    }
  });
}

// 3. Move departments
const deptPagesDir = path.join(srcDir, 'pages', 'hr');
if (fs.existsSync(deptPagesDir)) {
    // move hr/departments and hr/payroll to modules/hr/views
    // Wait, let's keep it simple. Only move staff and StaffContext for now, OR move everything?
    // Let's just move pages/hr/departments and pages/hr/payroll into modules/hr/views/departments and views/payroll
    const deptDir = path.join(deptPagesDir, 'departments');
    if (fs.existsSync(deptDir)) moveDirContents(deptDir, path.join(hrDir, 'views', 'departments'));

    const payrollDir = path.join(deptPagesDir, 'payroll');
    if (fs.existsSync(payrollDir)) moveDirContents(payrollDir, path.join(hrDir, 'views', 'payroll'));
}


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

// Map of old paths to new paths (relative to src)
// Note: We'll use regex for simpler replacement

walkSync(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Replace StaffContext imports
  content = content.replace(/\/contexts\/StaffContext/g, '/modules/hr/context/StaffContext');
  
  // Replace staff pages imports (App.tsx mostly)
  content = content.replace(/\/pages\/staff\//g, '/modules/hr/views/');
  content = content.replace(/\/pages\/hr\/departments/g, '/modules/hr/views/departments');
  content = content.replace(/\/pages\/hr\/payroll/g, '/modules/hr/views/payroll');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filepath)}`);
  }
});

// We will manually extract the Types and mock data later to avoid parsing errors.

console.log('Refactor script 2 completed successfully.');
