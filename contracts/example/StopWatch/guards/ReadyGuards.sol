// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { StopWatchGuardBase } from "../StopWatchGuardBase.sol";

/**
 * @notice Transition guard functions
 *
 * - Machine: StopWatch
 * - State: Ready
 */
contract ReadyGuards is StopWatchGuardBase {

    // Events
    event StopWatchReset(address indexed user);

    // Initial state
    // Valid prior states: Paused
    function StopWatch_Ready_Enter(address _user, string memory priorStateName)
    external
    returns(string memory message)
    {
        delete stopWatchSlot().userTime[_user];
        if (compare(priorStateName, PAUSED)) emit StopWatchReset(_user);
        message = READY;
    }

}