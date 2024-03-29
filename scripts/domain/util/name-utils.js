const ethers = require('ethers');
const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;
const hexDataSlice = ethers.utils.hexDataSlice;

/**
 * Convert any string to a bytes4-truncated, keccak256 hash
 *
 * @param name
 * @returns {*}
 */
function nameToId(name) {
    const hash = keccak256(toUtf8Bytes(name))
    return hexDataSlice(hash, 0, 4);
}

/**
 * Id validator
 *
 *  Must be first four bytes of keccak256 hash of name
 *
 * @param name
 * @param id
 * @returns {boolean}
 */
function validateId(name, id) {
    return id === nameToId(name);
}

/**
 * Lax Name validator
 *
 * Lax names are used for action and machine names
 * Allow mixed case with numbers, underscores, and spaces
 *
 * @param name
 * @returns {boolean}
 */
function validateNameLax(name) {
    let pattern = new RegExp("^[a-zA-Z0-9_ ]*$", "g");
    return pattern.test(name);
}

/**
 * Strict Name validator
 *
 * Strict names are used in deterministic function name creation
 * Starting with a letter, allow mixed case with numbers and underscores
 *
 * @param name
 * @returns {boolean}
 */
function validateNameStrict(name) {
    let pattern = new RegExp("^[a-zA-Z_]+[a-zA-Z0-9_]*$", "g");
    return pattern.test(name);
}

exports.nameToId = nameToId;
exports.validateId = validateId;
exports.validateNameLax = validateNameLax;
exports.validateNameStrict = validateNameStrict;