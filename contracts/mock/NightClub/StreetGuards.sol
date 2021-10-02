// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "../../domain/FismoTypes.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Street
 */
contract StreetGuards {

    // Enter the Street
    function Nightclub_Street_Enter(string storage targetStateName)
    external
    returns(bool pass)
    {
        // Leaving the club
        pass = true;
    }

    // Exit the Street
    // TODO: revert if the caller doesn't hold a specific token
    function Nightclub_Street_Exit(string storage targetStateName)
    external
    payable
    returns(string memory successMessage)
    {
        if (targetStateName == )
        successMessage = "The bouncer eyes you velvet ropes";
    }

}