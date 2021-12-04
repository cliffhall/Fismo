// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismo
 *
 * Interface for Fismo implementations
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismo {

    /**
     * Invoke an action on a configured machine
     *
     * Reverts if caller is not the machine's operator contract
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the target machine
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
    external
    returns(FismoTypes.ActionResponse memory response);

    /**
     * @notice Add a new Machine
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(FismoTypes.Machine memory _machine)
    external;

    /**
     * @notice Add a state to an existing Machine
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to add to the machine
     */
    function addState(bytes4 _machineId, FismoTypes.State memory _state)
    external;

    /**
     * @notice Update an existing state to an existing machine
     *
     * State name / id cannot be changed.
     *
     * Use this if:
     * - adding more than one transition
     * - removing one or more transitions
     * - changing exitGuarded and/or enterGuarded
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to update
     */
    function updateState(bytes4 _machineId, FismoTypes.State memory _state)
    external;

    /**
     * @notice Add a transition to an existing state of an existing machine
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _transition - the transition to add to the state
     */
    function addTransition(bytes4 _machineId, bytes4 _stateId, FismoTypes.Transition memory _transition)
    external;

}