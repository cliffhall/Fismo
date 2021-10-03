// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "./GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Cab
 */
contract CabGuards is GuardBase {

    // Enter the Cab
    // Valid prior states: Street and Home
    function Nightclub_Cab_Enter(string memory priorStateName)
    external
    payable
    returns(string memory successMessage)
    {
        if (compare(priorStateName, "Street")) {
            successMessage = "Crawling into the cab, you mumble your address to the driver then collapse in a heap on the backseat.";
        } else if (compare(priorStateName, "Home")) {
            successMessage = "\"To the club, with all speed!\" you say. \"And take me through the park. You know how I love the park.";
        }
    }

    // Exit the Cab
    // Valid next states: Street and Home
    function Nightclub_Cab_Exit(string memory nextStateName)
    external
    payable
    returns(string memory successMessage)
    {
        // TODO: revert if the caller hasn't paid the fare
        if (compare(nextStateName, "Street")) {
            successMessage = "\"What, no tip?\" the cabby asks. You adjust your feather boa, throw open the door, and step out of the cab.";
        } else if (compare(nextStateName, "Home")) {
            successMessage = "Ziss your place? Maybe. You dig in your pockets and finally find your keys. Yep, your in. Zzzz...";
        }
    }

}