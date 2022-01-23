// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";
import { FismoTypes } from "../domain/FismoTypes.sol";

/**
 * @title IFismo
 *
 * Interface for Fismo implementations
 * The ERC-165 identifier for this interface is 0x284a083c.
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
interface IFismo is IERC165 {

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

    /**
     * @notice Add a new Machine
     *
     * Reverts if
     * - operator address is zero
     * - machine id is not valid
     * - machine id already exists
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(FismoTypes.Machine memory _machine)
    external;

    /**
     * @notice Add a state to an existing Machine
     *
     * Reverts if
     * - state id is invalid
     * - machine does not exist
     * - any contained transition is invalid
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
     * Reverts if:
     * - machine does not exist
     * - state does not exist
     * - state id is invalid
     * - any contained transition is invalid
     *
     * Use this when:
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
     * Reverts if:
     * - machine does not exist
     * - state does not exist
     * - transition id is invalid
     * - any contained transition is invalid
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _transition - the transition to add to the state
     */
    function addTransition(bytes4 _machineId, bytes4 _stateId, FismoTypes.Transition memory _transition)
    external;
/*

    */
/**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the address of the user
     *
     * @return state - the user's current state in the given machine
     *//*

    function getUserState(address _user, bytes4 _machineId)
    external
    view
    returns (FismoTypes.State storage state);
*/

}