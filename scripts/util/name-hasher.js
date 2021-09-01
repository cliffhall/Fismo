const ethers = require('ethers');
const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;

exports.nameToId = name => keccak256(toUtf8Bytes(name));