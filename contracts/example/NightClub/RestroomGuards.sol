// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "../GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: Restroom
 */
contract RestroomGuards is GuardBase {

    // Enter the Restroom
    // Valid prior states: Dancefloor, Bar, and VIP Lounge
    function Nightclub_Restroom_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(priorStateName, "Bar")) {
            message = "You chug the rest of your beer, wave the empty bottle menacingly at a Daft Punk poster for no reason, then enter the restroom.";
        } else if (compare(priorStateName, "Dancefloor")) {
            message = "Your boogie shoes are full of sweat and the squishing sounds echo loudly off the tiles. Washing your face and drenching your hair in cold water completes the effect. The mirror reflects a fully walking mer-creature.";
        } else if (compare(priorStateName, "VIP_Lounge")) {
            message = "Leaving those questionably elite layabouts behind, you join a line of your compatriots in rhythm, waiting for your turn at the facilities.";
        }
    }

    // Exit the Restroom
    // Valid next states: Dancefloor, Bar, and VIP Lounge
    function Nightclub_Restroom_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, "Bar")) {
            message = "As you head back toward the bar, you get an odd feeling that you're perpetuating a cycle.";
        } else if (compare(nextStateName, "Dancefloor")) {
            message = "Whaaaaaat? Is that a Sea of Arrows track? Thump, thump, thump, zzzzzrrrooooowwwww... Lol, no. But still, it slaps.";
        } else if (compare(nextStateName, "VIP_Lounge")) {
            message = "Aight, time to chillax. Wasn't it the Dali Lama who once said that deep beats like these are best pondered on an equally deep and comfy sofa?";
        }
    }

}