#!/bin/zsh

# Clean sdk folder
echo "🗑 Cleaning SDK folder..."
rm -rf sdk 2> /dev/null
mkdir sdk 2> /dev/null

# Build contracts and extract ABI from artifacts
npx hardhat run scripts/util/extract-abi.js

# Build /sdk/browser/fismo.js
echo "🏭 Building ES6 (browser) lib..."
webpack --mode production

# Place the commonjs domain files in /sdk/node
echo "🏭 Copying commonjs (Node) lib..."
rm -rf sdk/node
cp -R scripts/domain sdk/node