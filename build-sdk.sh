#!/bin/zsh

# Build contracts and extract ABI from artifacts
npx hardhat run scripts/util/extract-abi.js

# Build /sdk/browser/fismo.js
echo "🏭 Building ES6 (browser) lib..."
webpack --mode production

# Place the commonjs domain files in /sdk/node
echo "🏭 Copying commonjs (Node) lib..."
rm -rf sdk/node
cp -R scripts/domain sdk/node
mv sdk/node/index.js sdk/node/fismo.js