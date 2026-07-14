const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'src', 'modules', 'hr', 'views');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // They were in pages/staff/ so to reach shared they used ../../shared/
  // Now they are in modules/hr/views/ so they need ../../../shared/
  content = content.replace(/\.\.\/\.\.\/shared\//g, '../../../shared/');
  
  // To reach contexts it was ../../contexts
  content = content.replace(/\.\.\/\.\.\/contexts\//g, '../../../contexts/');

  // To reach mock it was ../../mock
  content = content.replace(/\.\.\/\.\.\/mock/g, '../../../mock');

  // They used to import components via ./components/
  // Now components are at ../components/
  content = content.replace(/\.\/components\//g, '../components/');

  // They used to import modals via ./modals/
  // Now modals are at ../components/ (because in refactor_hr I moved modals into components folder, wait, let's check what I did)
  // In refactor_hr.cjs:
  // if (file === 'components' || file === 'modals') { moveDirContents(srcPath, path.join(hrDir, 'components')); }
  // Oh, so I merged modals into components!
  // So ./modals/ -> ../components/
  content = content.replace(/\.\/modals\//g, '../components/');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
}

fixFile(path.join(viewsDir, 'StaffDetail.tsx'));
fixFile(path.join(viewsDir, 'StaffList.tsx'));

// Wait, what about StaffDetail.module.scss?
const scssFile = path.join(viewsDir, 'StaffDetail.module.scss');
if (fs.existsSync(scssFile)) {
  let content = fs.readFileSync(scssFile, 'utf8');
  content = content.replace(/\.\.\/\.\.\/styles\//g, '../../../styles/');
  fs.writeFileSync(scssFile, content, 'utf8');
  console.log('Fixed', scssFile);
}
const listScssFile = path.join(viewsDir, 'StaffList.module.scss');
if (fs.existsSync(listScssFile)) {
  let content = fs.readFileSync(listScssFile, 'utf8');
  content = content.replace(/\.\.\/\.\.\/styles\//g, '../../../styles/');
  fs.writeFileSync(listScssFile, content, 'utf8');
  console.log('Fixed', listScssFile);
}

console.log('Imports fixed.');
