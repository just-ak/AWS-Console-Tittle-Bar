import fs from 'fs';
import path from 'path';

const rootPackageJson = require('../package.json');
const websitePackageJsonPath = path.join(__dirname, '../website/package.json');
const manifestJsonPath = path.join(__dirname, '../src/manifest.json');
const pluginPageHtmlPath = path.join(__dirname, '../src/plugin_page/inc/footer.html');
const preferencesPageHtmlPath = path.join(__dirname, '../src/preferences/index.html');

const referencesPath = path.join(__dirname, '../src/common/reference.tsx');

const updateVersion = (filePath: string, version: string) => {
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fileContent.version = version;
  fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
};

const updateHtmlVersion = (filePath: string, version: string) => {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  fileContent = fileContent.replace(/<span id="version-number">Version: [^<]+<\/span>/, `<span id="version-number">Version: ${version}</span>`);
  fs.writeFileSync(filePath, fileContent, 'utf8');
};

const updateDataVersion = (filePath: string, version: string) => {
  let fileContent = fs.readFileSync(filePath, 'utf8');

  //  data.version = '1.0';
  fileContent = fileContent.replace(/data\.version\s*=\s*'[^']*';/, `data.version = '${version}';`);
  fs.writeFileSync(filePath, fileContent, 'utf8');
};

updateDataVersion(referencesPath, rootPackageJson.version);
updateVersion(websitePackageJsonPath, rootPackageJson.version);
updateVersion(manifestJsonPath, rootPackageJson.version);
updateHtmlVersion(pluginPageHtmlPath, rootPackageJson.version);
updateHtmlVersion(preferencesPageHtmlPath, rootPackageJson.version);


console.log(`Synchronized version to ${rootPackageJson.version}`);
console.log(`Updated HTML version to ${rootPackageJson.version}`);