
import fs from 'fs';
import path from 'path';

const rootPackageJson = require('../package.json');
const websitePackageJsonPath = path.join(__dirname, '../website/package.json');
const manifestJsonPath = path.join(__dirname, '../src/manifest.json');

const updateVersion = (filePath: string, version: string) => {
  const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fileContent.version = version;
  fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
};

updateVersion(websitePackageJsonPath, rootPackageJson.version);
updateVersion(manifestJsonPath, rootPackageJson.version);

console.log(`Synchronized version to ${rootPackageJson.version}`);