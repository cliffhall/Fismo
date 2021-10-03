// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @notice Base functions for guards
 */
contract GuardBase {

    /**
     * @notice Compare two strings
     */
    function compare(string memory a, string memory b)
    internal
    returns
    (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

}