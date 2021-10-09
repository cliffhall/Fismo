// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @notice Base functions for guards
 */
contract GuardBase is FismoTypes {

    /**
     * @notice Compare two strings
     */
    function compare(string memory a, string memory b)
    internal
    pure
    returns
    (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

}