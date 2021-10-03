// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { GuardBase } from "./GuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: Nightclub
 * - State: VIP Lounge
 */
contract VIPLoungeGuards is GuardBase {

    // Enter the VIP Lounge
    // Valid prior states: Dancefloor, Restroom, and Bar
    function Nightclub_VIP_Lounge_Enter(string memory priorStateName)
    external
    returns(string memory successMessage)
    {
        // TODO: Revert if user isn't a VIP
        if (compare(priorStateName, "Dancefloor")) {
            successMessage = "The DJ is spinning some decade-old Trap track that sounds like a T-Rex destroying the building with lasers. Time to chill.";
        } else if (compare(priorStateName, "Restroom")) {
            successMessage = "Feeling much lighter now, you can relax in style.";
        } else if (compare(priorStateName, "Bar")) {
            successMessage = "Flaunting your expensive drink, you privately smile, since none of the other VIPs know you own an NFT worth more than your house.";
        }
    }

    // Exit the VIP Lounge
    // Valid next states: Dancefloor, Restroom, and Bar
    function Nightclub_VIP_Lounge_Exit(string memory nextStateName)
    external
    payable
    returns(string memory successMessage)
    {
        if (compare(nextStateName, "Dancefloor")) {
            successMessage = "Hold, up, that's your jam! It's time to get your funk on.";
        } else if (compare(nextStateName, "Restroom")) {
            successMessage = "With urgency in your step, you weave through the crowd, keeping the door to the restroom in sight.";
        } else if (compare(nextStateName, "Bar")) {
            successMessage = "Jostling toward the bar, you wave to the bartender, who is chatting with a group of hip, nattily dressed Danes.";
        }
    }

}