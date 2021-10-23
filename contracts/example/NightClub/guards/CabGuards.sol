// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Cab
 */
contract CabGuards is NightClubGuardBase {

    // Enter the Cab
    // Valid prior states: Street and Home
    function Nightclub_Cab_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, STREET)) {
            message = "Crawling into the cab, you mumble your address to the driver then collapse in a heap on the backseat.";
        } else if (compare(priorStateName, HOME)) {
            message = "\"To the club, with all speed!\" you say. \"And take me through the park. You know how I love the park.";
        }
    }

    // Exit the Cab
    // Valid next states: Street and Home
    function Nightclub_Cab_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        // TODO: revert if the caller can't pay the fare
        if (compare(nextStateName, STREET)) {
            message = "\"What, no tip?\" the cabby asks. You adjust your feather boa, throw open the door, and step out of the cab.";
        } else if (compare(nextStateName, HOME)) {
            message = "Ziss your place? Maybe. You dig in your pockets and finally find your keys. Yep, your in. Zzzz...";
        }
    }

}