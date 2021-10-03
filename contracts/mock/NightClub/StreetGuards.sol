// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "./GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Street
 */
contract StreetGuards is GuardBase {

    // Enter the Street
    // Valid prior states: Club and Cab
    function Nightclub_Street_Enter(string memory priorStateName)
    external
    payable
    returns(string memory successMessage)
    {
        if (compare(priorStateName, "Club")) {
            successMessage = "The chill dawn air on your sweaty skin feels disgusting.";
        } else if (compare(priorStateName, "Cab")) {
            successMessage = "From behind an nondescript black door, a deep, bass pulse beckons. The imposing bouncer eyes you from behind the velvet rope.";
        }
    }

    // Exit the Street
    // Valid next states: Club and Cab
    function Nightclub_Street_Exit(string memory nextStateName)
    external
    payable
    returns(string memory successMessage)
    {
        if (compare(nextStateName, "Club")) {
            // TODO: revert if the caller doesn't hold a specific token
            successMessage = "The bouncer checks the list. He gives you another hard look, retracts the velvet rope, and waves you through.";
        } else if (compare(nextStateName, "Cab")) {
            successMessage = "You've barely raised your arm when a yellow cab cuts across three lanes of traffic, and screeches to a halt before you.";
        }
    }

}