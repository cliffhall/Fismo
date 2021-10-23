// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { NightClubGuardBase } from "../NightClubGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: VIP Lounge
 */
contract VIPLoungeGuards is NightClubGuardBase {

    // Enter the VIP Lounge
    // Valid prior states: Dancefloor, Restroom, Bar, and Foyer
    function Nightclub_VIP_Lounge_Enter(address _user, string memory priorStateName)
    external
    view
    returns(string memory message)
    {
        // Can't enter if you're not a VIP
        require(isVIP(_user), "Sorry, you just aren't fabulous enough, loser.");

        if (compare(priorStateName, DANCEFLOOR)) {
            message = "The DJ is spinning some decade-old Trap track that sounds like a T-Rex destroying the building with lasers. Time to chill.";
        } else if (compare(priorStateName, RESTROOM)) {
            message = "A tall guy in a weird manga shirt is talking to some misplaced-looking guys in suits. \"This club has everything. It has Micheal Alig, smart drinks, and this very VIP lounge, which as you know, only admits the criminally insane.\"";
        } else if (compare(priorStateName, BAR)) {
            message = "Flaunting your expensive drink, you privately smile, knowing none of these other self-important fops are aware you own an NFT worth more than your house.";
        } else if (compare(priorStateName, FOYER)) {
            message = "You do a quick walkaround, meeting a few friends, avoiding a few enemies, catching the eye of a few strangers.";
        }
    }

    // Exit the VIP Lounge
    // Valid next states: Dancefloor, Restroom, Bar, and Foyer
    function Nightclub_VIP_Lounge_Exit(address _user, string memory nextStateName)
    external
    pure
    returns(string memory message)
    {
        if (compare(nextStateName, DANCEFLOOR)) {
            message = "\"Hol' up,\" you say. \"That's may jam!'\" You proceed to get your funk on.";
        } else if (compare(nextStateName, RESTROOM)) {
            message = "\"Enough of this nonsense,\" you say, heading for the line outside the restroom. There should be a Super-VIP lounge with its own head. You'll totally do that whenever you open your own club. Totally.";
        } else if (compare(nextStateName, BAR)) {
            message = "Jostling toward the bar, you wave to the bartender, who is chatting with a group of hip, nattily dressed Danes.";
        } else if (compare(nextStateName, FOYER)) {
            message = "You tell everyone you'd like to hang out, but you're too hip, gotta go.";
        }
    }

}