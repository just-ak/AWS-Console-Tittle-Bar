#!/bin/bash

npm run sync-versions 
rm -rf ./dist 
rm -rf ./archive 
npm run build
tsc
mkdir -p archive
cd dist
zip -r ../archive/archive.zip . 
cd .. 
npx addons-linter archive/archive.zip