// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { console } from "hardhat/console.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: LockableDoor
 * - Guards: Locked/Exit
 */
contract LockableDoorGuards {

    // -------------------------------------------------------------------------
    // TRANSITION GUARDS
    // -------------------------------------------------------------------------

    // Locked / Exit
    // Valid next states: Closed
    function LockableDoor_Locked_Exit(address _user, string calldata _nextStateName)
    public
    view
    returns(string memory message)
    {
        // User must have key to unlock door
        bool hasKey = true; // TODO: check if user holds NFT representing key
        require(hasKey, "User must hold key to unlock.");

        // Success response message
        message = "Door unlocked.";

    }

}