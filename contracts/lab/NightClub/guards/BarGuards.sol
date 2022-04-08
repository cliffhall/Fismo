// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Bar
 */
contract BarGuards is NightClubGuardBase {

    // Enter the Bar
    // Valid prior states: Restroom, Dancefloor, VIP Lounge, and Foyer
    function NightClub_Bar_Enter(address _user, string calldata _action, string calldata _priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_priorStateName, RESTROOM)) {
            message = "The bartender acknowledges your wave after a few minutes and finally breaks away from the clique of leather spiked punks he was conversing with.";
        } else if (compare(_priorStateName, DANCEFLOOR)) {
            message = "There is only so much dancing a person can do in one go anyway. Gotta stay hydrated.";
        } else if (compare(_priorStateName, VIP_LOUNGE)) {
            message = "Leaving the questionably elite behind, you jostle your way up to the bar. It's all ravers wanting water.";
        } else if (compare(_priorStateName, FOYER)) {
            message = "Wow, it's packed in here. Be prepared to wait awhile.";
        }
    }

    // Exit the Bar
    // Valid next states: Restroom, Dancefloor, VIP Lounge, and Foyer
    function NightClub_Bar_Exit(address _user, string calldata _action, string calldata _nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_nextStateName, RESTROOM)) {
            message = "Gotta swing by the head before advancing to the next stage of your crazy plan.";
        } else if (compare(_nextStateName, DANCEFLOOR)) {
            message = "A rave kid with a lollipop grabs you and says 'Did you hear that orangutan sample at the break? This DJ is amaaaaaaazeballs!' before disappearing into the stomping and gyrating crowd.";
        } else if (compare(_nextStateName, VIP_LOUNGE)) {
            message = "Well the insanely elaborate drink wasn't quite what you asked for, but too late now, you've already tossed the little umbrella.";
        } else if (compare(_nextStateName, FOYER)) {
            message = "Time to hit the old dusty trail.";
        }
    }

}