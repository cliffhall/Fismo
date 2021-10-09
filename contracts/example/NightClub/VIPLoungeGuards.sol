// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "../GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: VIP Lounge
 */
contract VIPLoungeGuards is GuardBase {

    // Enter the VIP Lounge
    // Valid prior states: Dancefloor, Restroom, and Bar
    function Nightclub_VIP_Lounge_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        // TODO: Revert if user isn't a VIP (holds a particular token?)
        if (compare(priorStateName, "Dancefloor")) {
            message = "The DJ is spinning some decade-old Trap track that sounds like a T-Rex destroying the building with lasers. Time to chill.";
        } else if (compare(priorStateName, "Restroom")) {
            message = "A tall guy in a weird manga shirt is talking to some misplaced-looking guys in suits. \"This club has everything. It has Micheal Alig, smart drinks, and this very VIP lounge, which as you know, only admits the criminally insane.\"";
        } else if (compare(priorStateName, "Bar")) {
            message = "Flaunting your expensive drink, you privately smile, knowing none of these other self-important fops are aware you own an NFT worth more than your house.";
        }
    }

    // Exit the VIP Lounge
    // Valid next states: Dancefloor, Restroom, and Bar
    function Nightclub_VIP_Lounge_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, "Dancefloor")) {
            message = "\"Hol' up,\" you say. \"That's may jam!'\" You proceed to get your funk on.";
        } else if (compare(nextStateName, "Restroom")) {
            message = "\"Enough of this nonsense,\" you say, heading for the line outside the restroom. There should be a Super-VIP lounge with its own head. You'll totally do that whenever you open your own club. Totally.";
        } else if (compare(nextStateName, "Bar")) {
            message = "Jostling toward the bar, you wave to the bartender, who is chatting with a group of hip, nattily dressed Danes.";
        }
    }

}