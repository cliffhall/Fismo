// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title FismoOperate
 *
 * Operate Fismo state machines
 * The ERC-165 identifier for this interface is 0xcad6b576
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoOperate {

    event StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed priorState);
    event StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId);
    event Transitioned(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId, FismoTypes.ActionResponse response);

    /**
     * Invoke an action on a configured machine
     *
     * Reverts if
     * - caller is not the machine's operator (contract or EOA)
     * - _machineId does not refer to a valid machine
     * - _actionId is not valid for the user's current state in the given machine
     * - any invoked guard logic reverts (revert reason is guard response)
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
    external
    returns(FismoTypes.ActionResponse memory response);

}