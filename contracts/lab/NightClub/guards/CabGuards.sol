// SPDX-License-Identifier: BSD-3-Clause
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
    function NightClub_Cab_Enter(address _user, string memory _priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_priorStateName, STREET)) {
            message = "Crawling into the cab, you mumble your address to the driver then collapse in a heap on the backseat.";
        } else if (compare(_priorStateName, HOME)) {
            message = "\"To the club with all speed, good sir!\" you say to the driver. \"And take me through the park; you know how I love the park.";
        }
    }

    // Exit the Cab
    // Valid next states: Street and Home
    function NightClub_Cab_Exit(address _user, string memory _nextStateName)
    external
    pure
    returns(string memory message)
    {
        // TODO: revert if the caller can't pay the fare
        if (compare(_nextStateName, STREET)) {
            message = "\"What, no tip?\" the cabby asks. You adjust your feather boa, throw open the door, and step out of the cab.";
        } else if (compare(_nextStateName, HOME)) {
            message = "Ziss your place? Maybe. You dig in your pockets and finally find your keys. Yep, your in. Zzzz...";
        }
    }

}