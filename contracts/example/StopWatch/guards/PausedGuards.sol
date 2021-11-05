// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { StopWatchGuardBase } from "../StopWatchGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: StopWatch
 * - State: Paused
 */
contract PausedGuards is StopWatchGuardBase {

    // Events
    event StopWatchPaused(address indexed user, uint256 timestamp);

    // Valid prior states: Running
    function StopWatch_Paused_Enter(address _user, string memory priorStateName)
    external
    pure
    returns(string memory message)
    {
        stopWatchSlot().userTime[_user] = block.timestamp;
        emit StopWatchPaused(_user, block.timestamp);
    }

}