// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title StopWatchGuardBase
 *
 * @notice Constants used by the StopWatch example
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract StopWatchGuardBase {

    // States
    string constant READY   = "Ready";
    string constant RUNNING = "Running";
    string constant PAUSED  = "Paused";

    // Storage slot id
    bytes32 constant STOPWATCH_SLOT = keccak256("fismo.example.stopwatch.storage.slot");

    // Storage slot structure
    struct StopWatchSlot {

        //  user wallet => block timestamp
        mapping(address => uint256) userTime;

    }

    /**
     * @notice Get the StopWatch machine's storage slot
     *
     * @return stopWatchStorage - StopWatch storage slot
     */
    function stopWatchSlot()
    internal
    pure
    returns (StopWatchSlot storage stopWatchStorage)
    {
        bytes32 position = STOPWATCH_SLOT;
        assembly {
            stopWatchStorage.slot := position
        }
    }

    /**
     * @notice Compare two strings
     */
    function compare(string memory a, string memory b)
    internal
    pure
    returns
    (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

}