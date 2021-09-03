const ethers = require('ethers');
const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;

function nameToId(name) {
    return keccak256(toUtf8Bytes(name));
}

function validateId(name, id) {
    return  id === nameToId(name);
}

const validateName = /^[a-zA-Z0-9_]*$/gi;

exports = { nameToId, validateName, validateId };
