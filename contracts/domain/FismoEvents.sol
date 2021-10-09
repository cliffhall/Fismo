// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

/**
 * @title FismoEvents
 *
 * @notice Events emitted by Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface FismoEvents {

    event StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed priorState);
    event StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId);
    event ActionSuccess(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId);

}