// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { NightClubConstants } from "./NightClubConstants.sol";

/**
 * @title NightClubLib
 *
 * @notice NightClub Machine storage
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
library NightClubLib {

    bytes32 internal constant NIGHTCLUB_SLOT = keccak256("fismo.example.nightclub.storage.slot");

    struct NightClubSlot {

        //  user wallet => TODO: What are we storing here?
        mapping(address => string) userStuff;

    }

    /**
     * @notice Get the NightClub storage slot
     *
     * @return nightClubStorage - NightClub storage slot
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

}