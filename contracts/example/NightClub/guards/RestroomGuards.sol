// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Restroom
 */
contract RestroomGuards is NightClubGuardBase {

    // Enter the Restroom
    // Valid prior states: Dancefloor, Bar, VIP Lounge, and Foyer
    function NightClub_Restroom_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, BAR)) {
            message = "You chug the rest of your beer, wave the empty bottle menacingly at a Daft Punk poster for no reason, then enter the restroom.";
        } else if (compare(priorStateName, DANCEFLOOR)) {
            message = "Your boogie shoes are full of sweat and the squishing sounds echo loudly off the tiles. Washing your face and drenching your hair in cold water completes the effect. The mirror reflects a fully walking mer-creature.";
        } else if (compare(priorStateName, VIP_LOUNGE)) {
            message = "Leaving those questionably elite layabouts behind, you join a line of your compatriots in rhythm, waiting for your turn at the facilities.";
        } else if (compare(priorStateName, FOYER)) {
            message = "The night is young and restroom is still fairly unsullied.";
        }
    }

    // Exit the Restroom
    // Valid next states: Dancefloor, Bar, VIP Lounge, and Foyer
    function NightClub_Restroom_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, BAR)) {
            message = "As you head back toward the bar, you get an odd feeling that you're perpetuating a cycle.";
        } else if (compare(nextStateName, DANCEFLOOR)) {
            message = "Whaaaaaat? Is that a Sea of Arrows track? Thump, thump, thump, zzzzzrrrooooowwwww... Lol, no. But still, it slaps.";
        } else if (compare(nextStateName, VIP_LOUNGE)) {
            message = "Aight, time to chillax. Wasn't it the Dali Lama who once said that deep beats like these are best pondered on an equally deep and comfy sofa?";
        } else if (compare(nextStateName, FOYER)) {
            message = "Leaving so soon? It's not the break of dawn yet...";
        }
    }

}