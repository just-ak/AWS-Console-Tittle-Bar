#!/bin/bash

npm run sync-versions $1
rm -rf ./dist 
rm -rf ./archive 
npm run build
tsc
mkdir -p archive
cd dist
zip -r ../archive/archive.zip . 
cd .. 
npx addons-linter archive/archive.zip
cp archive/archive.zip archive/firefoxPlugin.${1}.zip
cp archive/archive.zip archive/chomePlugin.${1}.zip