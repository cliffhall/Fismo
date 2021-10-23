// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubConstants } from "./NightClubConstants.sol";

/**
 * @title NightClubLib
 *
 * @notice NightClub storage
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
library NightClubLib {

    bytes32 internal constant NIGHTCLUB_SLOT = keccak256("nightclub.storage.slot");

    struct NightClubSlot {

        // Maps a user's address to a an array of Position structs, accumulated over time
        //  user wallet => array of Positions
        mapping(address => string) userHistory;

    }

    /**
     * @notice Get the Fismo storage slot
     *
     * @return nightClubStorage - Fismo storage slot
     */
    function nightClubSlot()
    internal
    pure
    returns (NightClubSlot storage nightClubStorage)
    {
        bytes32 position = NIGHTCLUB_SLOT;
        assembly {
            nightClubStorage.slot := position
        }
    }

    /**
     * @notice Hash a name into a bytes4 id
     */
    function nameToId(string memory _name)
    internal
    pure
    returns
    (bytes4 id)
    {
        id = bytes4(keccak256(bytes(_name)));
    }

    /**
     * @notice Concatenate two strings
     * @param _a the first string
     * @param _b the second string
     * @return result the concatenation of `_a` and `_b`
     */
    function strConcat(string memory _a, string memory _b)
    internal
    pure
    returns(string memory result)
    {
        result = string(abi.encodePacked(bytes(_a), bytes(_b)));
    }

}