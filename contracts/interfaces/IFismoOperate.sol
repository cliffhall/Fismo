// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title FismoOperate
 *
 * @notice Operate Fismo state machines
 * The ERC-165 identifier for this interface is 0xcad6b576
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismoOperate {

    /// Emitted when a user transitions from one State to another.
    event UserTransitioned(
        address indexed user,
        bytes4 indexed machineId,
        bytes4 indexed newStateId,
        FismoTypes.ActionResponse response
    );

    /**
     * Invoke an action on a configured Machine.
     *
     * Reverts if
     * - Caller is not the machine's operator (contract or EOA)
     * - Machine does not exist
     * - Action is not valid for the user's current State in the given Machine
     * - Any invoked Guard logic reverts
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     *
     * @return response - the response from the action. See {FismoTypes.ActionResponse}
     */
    function invokeAction(
        address _user,
        bytes4 _machineId,
        bytes4 _actionId
    )
    external
    returns(
        FismoTypes.ActionResponse memory response
    );

}