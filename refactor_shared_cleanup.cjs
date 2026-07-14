const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const sharedComponentsDir = path.join(srcDir, 'shared', 'components');
const hrComponentsDir = path.join(srcDir, 'modules', 'hr', 'components');
const residentsComponentsDir = path.join(srcDir, 'pages', 'elderly', 'residents', 'components');

if (!fs.existsSync(hrComponentsDir)) fs.mkdirSync(hrComponentsDir, { recursive: true });
if (!fs.existsSync(residentsComponentsDir)) fs.mkdirSync(residentsComponentsDir, { recursive: true });

const filesToMove = [
  { name: 'AllowanceSelect.tsx', dest: hrComponentsDir, domain: 'hr' },
  { name: 'BankSelect.tsx', dest: hrComponentsDir, domain: 'hr' },
  { name: 'BankSelect.module.scss', dest: hrComponentsDir, domain: 'hr' },
  { name: 'StaffSearchSelect.tsx', dest: hrComponentsDir, domain: 'hr' },
  { name: 'StaffSearchSelect.module.scss', dest: hrComponentsDir, domain: 'hr' },
  { name: 'HealthSelect.tsx', dest: residentsComponentsDir, domain: 'residents' },
  { name: 'SeveritySelect.tsx', dest: residentsComponentsDir, domain: 'residents' }
];

filesToMove.forEach(f => {
  const srcPath = path.join(sharedComponentsDir, f.name);
  const destPath = path.join(f.dest, f.name);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
  }
});

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
        callback(filepath);
      }
    }
  });
}

walkSync(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Fix internal imports in the moved files
  // If the file is now in modules/hr/components or pages/elderly/residents/components
  // It used to import EditableSelect via `./EditableSelect`
  // Now it must import it via `../../../shared/components/EditableSelect` (for HR) 
  // or `../../../../shared/components/EditableSelect` (for Residents)
  if (filepath.includes(path.normalize('/modules/hr/components/AllowanceSelect.tsx')) ||
      filepath.includes(path.normalize('/modules/hr/components/BankSelect.tsx')) ||
      filepath.includes(path.normalize('/modules/hr/components/StaffSearchSelect.tsx'))) {
    content = content.replace(/from "\.\//g, 'from "../../../shared/components/');
    content = content.replace(/from '\.\//g, "from '../../../shared/components/");
    // Fix context imports
    content = content.replace(/\.\.\/\.\.\/contexts/g, '../../../contexts');
    content = content.replace(/\.\.\/\.\.\/mock/g, '../../../mock');
  } else if (filepath.includes(path.normalize('/pages/elderly/residents/components/HealthSelect.tsx')) ||
             filepath.includes(path.normalize('/pages/elderly/residents/components/SeveritySelect.tsx'))) {
    content = content.replace(/from "\.\//g, 'from "../../../../shared/components/');
    content = content.replace(/from '\.\//g, "from '../../../../shared/components/");
    content = content.replace(/\.\.\/\.\.\/contexts/g, '../../../../contexts');
    content = content.replace(/\.\.\/\.\.\/mock/g, '../../../../mock');
  } else {
    // For other files importing these components, we can't reliably do regex replace because relative paths depend on depth.
    // However, we know mostly Staff pages import StaffSearch, Bank, Allowance.
    // Let's replace the basename imports:
    // If a file imports AllowanceSelect from something ending in shared/components/AllowanceSelect
    content = content.replace(/([^"']+)shared\/components\/AllowanceSelect/g, '$1modules/hr/components/AllowanceSelect');
    content = content.replace(/([^"']+)shared\/components\/BankSelect/g, '$1modules/hr/components/BankSelect');
    content = content.replace(/([^"']+)shared\/components\/StaffSearchSelect/g, '$1modules/hr/components/StaffSearchSelect');
    content = content.replace(/([^"']+)shared\/components\/HealthSelect/g, '$1pages/elderly/residents/components/HealthSelect');
    content = content.replace(/([^"']+)shared\/components\/SeveritySelect/g, '$1pages/elderly/residents/components/SeveritySelect');
  }

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(srcDir, filepath)}`);
  }
});

console.log('Cleanup script completed.');
