// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "../GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Street
 */
contract StreetGuards is GuardBase {

    // Enter the Street
    // Valid prior states: Club and Cab
    function Nightclub_Street_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, "Club")) {
            message = "The chill dawn air on your sweaty skin feels disgusting.";
        } else if (compare(priorStateName, "Cab")) {
            message = "From behind an nondescript black door, a deep, bass pulse beckons. The imposing bouncer eyes you from behind the velvet rope.";
        }
    }

    // Exit the Street
    // Valid next states: Club and Cab
    function Nightclub_Street_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, "Club")) {
            // TODO: revert if the caller doesn't hold a specific token
            message = "The bouncer checks the list. He gives you another hard look, retracts the velvet rope, and waves you through.";
        } else if (compare(nextStateName, "Cab")) {
            message = "You've barely raised your arm when a yellow cab cuts across three lanes of traffic, and screeches to a halt before you.";
        }
    }

}