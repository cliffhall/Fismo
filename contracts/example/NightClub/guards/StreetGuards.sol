// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Street
 */
contract StreetGuards is NightClubGuardBase {

    // Enter the Street
    // Valid prior states: Foyer and Cab
    function NightClub_Street_Enter(address _user, string memory _priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_priorStateName, FOYER)) {
            message = "The chill dawn air on your sweaty skin feels disgusting.";
        } else if (compare(_priorStateName, CAB)) {
            message = "From behind an nondescript black door, a deep, bass pulse beckons. The imposing bouncer eyes you from behind the velvet rope.";
        }
    }

    // Exit the Street
    // Valid next states: Foyer and Cab
    function NightClub_Street_Exit(address _user, string memory _nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_nextStateName, FOYER)) {
            message = "The bouncer checks the list. He gives you another hard look, retracts the velvet rope, and waves you through.";
        } else if (compare(_nextStateName, CAB)) {
            message = "You've barely raised your arm when a yellow cab cuts across three lanes of traffic, and screeches to a halt before you.";
        }
    }

}