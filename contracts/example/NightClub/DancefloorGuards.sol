// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "../GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Dancefloor
 */
contract DancefloorGuards is GuardBase {

    // Enter the Dancefloor
    // Valid prior states: Restroom, Bar, and VIP Lounge
    function Nightclub_Dancefloor_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, "Restroom")) {
            message = "You feel refreshed, though it's totally pressed hams out here, so that feeling won't last long. But this beat is undeniable.";
        } else if (compare(priorStateName, "Bar")) {
            message = "Within mere moments, your drink is jackhammered and jiggled out of its cup and onto the floor. Didn't think this through, did ya?";
        } else if (compare(priorStateName, "VIP_Lounge")) {
            message = "As you begin to dance, you are struck by the contrast between the lizards back in the lounge all focused on themselves, and these dancers focused on nothing but the music.";
        }
    }

    // Exit the Dancefloor
    // Valid next states: Restroom, Bar, and VIP Lounge
    function Nightclub_Dancefloor_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, "Restroom")) {
            message = "Getting hot out here and the ridiculous breaks spinning right now will be the death of you. You need to get out of the throng and splash a little water on your face.";
        } else if (compare(nextStateName, "Bar")) {
            message = "In the middle of Shpongle Falls, it hits you just how incredible it would be to have something with lime in it just now.";
        } else if (compare(nextStateName, "VIP_Lounge")) {
            message = "You overhear someone saying \"Hey, check out that weird guy over in the lounge.\" You turn to see a guy with tall, plastic Elvis hair wearing dark glasses with blinking lights behind the lenses and a laptop hanging from his neck, displaying a fractal hellscape. You wave to your friend.";
        }
    }

}