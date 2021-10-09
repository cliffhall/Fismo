// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "../GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Bar
 */
contract BarGuards is GuardBase {

    // Enter the Bar
    // Valid prior states: Restroom, Dancefloor, and VIP Lounge
    function Nightclub_Bar_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, "Restroom")) {
            message = "The bartender acknowledges your wave after a few minutes and finally breaks away from the clique of leather spiked punks he was conversing with.";
        } else if (compare(priorStateName, "Dancefloor")) {
            message = "";
        } else if (compare(priorStateName, "VIP_Lounge")) {
            message = "Leaving the questionably elite behind, ";
        }
    }

    // Exit the Bar
    // Valid next states: Restroom, Dancefloor, and VIP Lounge
    function Nightclub_Bar_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, "Restroom")) {
            message = "Gotta swing by the head before advancing to the next stage of your crazy plan.";
        } else if (compare(nextStateName, "Dancefloor")) {
            message = "A rave kid with a lollipop grabs you and says 'Did you hear that orangutan sample at the break? This DJ is amaaaaaaazeballs!' before disappearing into the stomping and gyrating crowd.";
        } else if (compare(nextStateName, "VIP_Lounge")) {
            message = "Well the insanely elaborate drink wasn't quite what you asked for, but too late now, you've already tossed the little umbrella.";
        }
    }

}