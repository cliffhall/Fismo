// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Dancefloor
 */
contract DancefloorGuards is NightClubGuardBase {

    // Enter the Dancefloor
    // Valid prior states: Restroom, Bar, VIP Lounge, and Foyer
    function NightClub_Dancefloor_Enter(address _user, string memory _priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_priorStateName, RESTROOM)) {
            message = "You feel refreshed, though it's totally pressed hams out here, so that feeling won't last long. But this beat is undeniable.";
        } else if (compare(_priorStateName, BAR)) {
            message = "Within mere moments, your drink is jackhammered and jiggled out of its cup and onto the floor. Didn't think this through, did ya?";
        } else if (compare(_priorStateName, VIP_LOUNGE)) {
            message = "As you begin to dance, you are struck by the contrast between the lizards back in the lounge all focused on themselves, and these dancers focused on nothing but the music.";
        } else if (compare(_priorStateName, FOYER)) {
            message = "The atmosphere is electric in here tonight. You shake off the day and start to groove.";
        }
    }

    // Exit the Dancefloor
    // Valid next states: Restroom, Bar, VIP Lounge, and Foyer
    function NightClub_Dancefloor_Exit(address _user, string memory _nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(_nextStateName, RESTROOM)) {
            message = "Getting hot out here and the ridiculous breaks spinning right now will be the death of you. You need to get out of the throng and splash a little water on your face.";
        } else if (compare(_nextStateName, BAR)) {
            message = "In the middle of Shpongle Falls, it hits you just how incredible it would be to have something with lime in it just now.";
        } else if (compare(_nextStateName, VIP_LOUNGE)) {
            message = "You overhear someone saying \"Hey, check out that weird, shiny dude over there.\" You turn to see a tall guy in a skintight silver outfit with plastic Elvis hair and a laptop hanging from his neck, displaying some fractal hellscape. His face is lit by blinking lights behind the lenses of his dark glasses. You wave to your friend and head toward the VIP Lounge.";
        } else if (compare(_nextStateName, FOYER)) {
            message = "That's it, you're officially beat. Time to roll.";
        }
    }

}