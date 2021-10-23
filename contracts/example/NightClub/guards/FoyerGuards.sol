// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Foyer
 */
contract FoyerGuards is NightClubGuardBase {

    // Enter the Foyer
    // Valid prior states: Street, Dancefloor, VIP Lounge, Bar, and Restroom
    function Nightclub_Foyer_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, STREET)) {
            message = "The temperature in here is at least twenty degrees hotter, and the beat twenty times louder. You check your coat and tuck the ticket away.";
        } else if (compare(priorStateName, DANCEFLOOR)) {
            message = "Still bouncin' like a clown, you dig through wads of bills and change to find your coat check ticket. Surprise, you didn't lose it this time. You get to be warm on the way home.";
        } else if (compare(priorStateName, VIP_LOUNGE)) {
            message = "Somewhere along the line, you must have lost your coat check ticket. Probably while you were exchanging cards with those NFT startup founders in the lounge. Oh well, it'll be warm in the cab...";
        } else if (compare(priorStateName, BAR)) {
            message = "You toss back the bitter dregs of your last drink and swing by the coat check.";
        } else if (compare(priorStateName, RESTROOM)) {
            message = "The coat check girl points out that you have long strip of toilet paper stuck to your shoe. You thank her, take your coat, and move along.";
        }
    }

    // Exit the Foyer
    // Valid next states: Street, Dancefloor, VIP Lounge, Bar,  and Restroom
    function Nightclub_Foyer_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, STREET)) {
            message = "You head for the door. Behind you the beat goes on. To the break of dawn, they say, but you don't believe a word of it. 4AM at the latest. Leave now and you might be able to get a cab.";
        } else if (compare(nextStateName, DANCEFLOOR)) {
            message = "It is straight up time to dance. Let's gooooo!";
        } else if (compare(nextStateName, VIP_LOUNGE)) {
            message = "Perhaps you *should* grace the elevated ones with your presence. It'll be wonderful fodder for their Instas.";
        } else if (compare(nextStateName, BAR)) {
            message = "Get to the bar early, good move. Before they run out of little umbrellas for the drinks.";
        } else if (compare(nextStateName, RESTROOM)) {
            message = "Happens every time. Why you didn't think to go before you left home is a mystery.";
        }
    }

}