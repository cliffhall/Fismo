// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title FismoEvents
 *
 * @notice Events emitted by Fismo
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface FismoEvents {

    event MachineAdded(bytes4 indexed machineId, string machineName);
    event StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed priorState);
    event StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId);
    event Transitioned(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId, FismoTypes.ActionResponse response);

}