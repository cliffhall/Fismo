// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoAccess } from "./FismoAccess.sol";
import { FismoEvents } from "../domain/FismoEvents.sol";
import { IFismoUpdate } from "../interface/IFismoUpdate.sol";

/**
 * @title FismoUpdate
 *
 * @notice Fismo storage update functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoUpdate is IFismoUpdate, FismoAccess, FismoEvents {

    /**
     * @notice Add a new Machine
     *
     * Reverts if:
     * - caller is not contract owner
     * - operator address is zero
     * - machine id is not valid
     * - machine id already exists
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(Machine memory _machine)
    external
    override
    onlyOwner
    {
        // Make sure operator address is not the black hole
        require(_machine.operator != address(0), "Invalid operator address");

        // Make sure machine id is valid
        require(_machine.id == nameToId(_machine.name), "Invalid machine ID");

        // Get the machine's storage location
        Machine storage machine = getStore().machine[_machine.id];

        // Make sure machine doesn't already exist
        require(machine.id != _machine.id, "Machine already exists");

        // Store the machine
        machine.operator = _machine.operator;
        machine.id = _machine.id;
        machine.initialStateId = _machine.initialStateId;
        machine.name = _machine.name;
        machine.uri = _machine.uri;

        // Store and map the machine's states
        //
        // Struct arrays cannot be copied from memory to storage,
        // so states must be added to the machine individually
        uint256 length = _machine.states.length;
        for (uint256 i = 0; i < length; i+=1) {

            // Get the state from memory
            State memory state = _machine.states[i];

            // Store the state
            addState(_machine.id, state);
        }

        // Alert listeners to change of state
        emit MachineAdded(_machine.id, _machine.name);

    }

    /**
     * @notice Add a state to an existing Machine
     *
     * Reverts if:
     * - caller is not contract owner
     * - state id is invalid
     * - machine does not exist
     * - any contained transition is invalid
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to add to the machine
     */
    function addState(bytes4 _machineId, State memory _state)
    public
    override
    onlyOwner
    {
        // Make sure state id is valid
        require(_state.id == nameToId(_state.name), "State ID is invalid");

        // Get the machine's storage location
        Machine storage machine = getMachine(_machineId);

        // Zero init a new states array element in storage
        machine.states.push();

        // Get the new state's storage location
        uint256 index = machine.states.length - 1;

        // Map state id to index of state in machine's states array
        mapStateIndex(_machineId, _state.id, index);

        // Store the new state in the machine's states array
        storeState(machine, _state, index);

        // Alert listeners to change of state
        emit StateAdded(_machineId, _state.id, _state.name);

    }

    /**
  * @notice Add a transition to an existing state of an existing machine
     *
     * Reverts if:
     * - caller is not contract owner
     * - machine does not exist
     * - state does not exist
     * - action id is invalid
     * - target state id is invalid
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _transition - the transition to add to the state
     */
    function addTransition(bytes4 _machineId, bytes4 _stateId, Transition memory _transition)
    public
    override
    onlyOwner
    {
        // Make sure action id is valid
        require(_transition.actionId == nameToId(_transition.action), "Action ID is invalid");

        // Make sure target state id is valid
        require(_transition.targetStateId == nameToId(_transition.targetStateName), "Target State ID is invalid");

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Get the state's index in the machine's states array
        uint256 index = getStateIndex(_machineId, _stateId);

        // Get the target state
        State storage state = machine.states[index];

        // Zero init a new transitions array element in storage
        state.transitions.push();

        // Get the new transition's storage index in the state's transitions array
        index = state.transitions.length - 1;

        // Overwrite the state in the machine's states array
        Transition storage transition = state.transitions[index];
        transition.actionId = _transition.actionId;
        transition.action = _transition.action;
        transition.targetStateId = _transition.targetStateId;
        transition.targetStateName = _transition.targetStateName;

        // Alert listeners to change of state
        emit TransitionAdded(_machineId, state.id, transition.action, transition.targetStateName);

    }

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
    function updateState(bytes4 _machineId, State memory _state)
    public
    override
    onlyOwner
    {
        // Make sure state id is valid
        require(_state.id == nameToId(_state.name), "State ID is invalid");

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Make sure state exists
        uint256 index = getStateIndex(_machineId, _state.id);
        require(machine.states[index].id == _state.id, "State does not exist");

        // Overwrite the state in the machine's states array
        storeState(machine, _state, index);

        // Alert listeners to change of state
        emit StateUpdated(_machineId, _state.id, _state.name);
    }

    /**
     * @notice Store a state
     *
     * Reverts if:
     * - No code is found at a guarded state's guardLogic address
     *
     * Shared by addState and updateState
     *
     * @param _machine - the machine's storage location
     * @param _state - the state's storage location
     * @param _index - the state's index within the machine's states array
     */
    function storeState(Machine storage _machine, State memory _state, uint256 _index)
    internal
    {
        // Overwrite the state in the machine's states array
        State storage state = _machine.states[_index];
        state.id = _state.id;
        state.name = _state.name;
        state.exitGuarded = _state.exitGuarded;
        state.enterGuarded = _state.enterGuarded;
        if (_state.exitGuarded || _state.enterGuarded) {
            enforceHasContractCode(_state.guardLogic, strConcat("Codeless guard address for state ", _state.name));
            state.guardLogic = _state.guardLogic;
        }

        // Store the state's transitions
        //
        // Struct arrays cannot be copied from memory to storage,
        // so transitions must be added to the state individually
        uint256 length = _state.transitions.length;
        for (uint256 i = 0; i < length; i+=1) {

            // Get the transition from memory
            Transition memory transition = _state.transitions[i];

            // Store the transition
            addTransition(_machine.id, _state.id, transition);

        }

        // Update the the state guards
        updateStateGuards(_machine, _state);
    }

    /**
     * @notice Map a state's index in machine's states array
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     * @param _index - the index of the state within the array
     */
    function mapStateIndex(bytes4 _machineId, bytes4 _stateId, uint256 _index)
    internal
    {
        // Add mapping: machine id => state id => states array index
        getStore().stateIndex[_machineId][_stateId] = _index;
    }

    /**
     * @notice Update the guard function selector mappings for given state
     *
     * @param _machine - the machine. see {Machine}
     * @param _state - the state. see {State}
     */
    function updateStateGuards(Machine memory _machine, State memory _state)
    internal
    {
        // determine enter guard function signature for state
        // Ex. keccak256 hash of: MachineName_StateName_Enter(address _user)
        bytes4 enterGuardSelector = getGuardSelector(_machine.name, _state.name, Guard.Enter);

        // Map the enter guard function selector to the address of the guard logic implementation for this state
        getStore().guardLogic[enterGuardSelector] = (_state.enterGuarded) ? _state.guardLogic : address(0);

        // determine exit guard function signature for state
        // Ex. keccak256 hash of: MachineName_StateName_Exit(address _user)
        bytes4 exitGuardSelector = getGuardSelector(_machine.name, _state.name, Guard.Exit);

        // Map the exit guard function selector to the address of the guard logic implementation for this state
        getStore().guardLogic[exitGuardSelector] = (_state.exitGuarded) ?  _state.guardLogic : address(0);
    }

    /**
     * @notice Set the current state for a given user in a given machine.
     *
     * @param _user - the address of the user
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state within the given machine
     */
    function setUserState(address _user, bytes4 _machineId, bytes4 _stateId)
    internal
    {
        // Store the user's new state in the given machine
        getStore().userState[_user][_machineId] = _stateId;

        // Push user's current location onto their history stack
        getStore().userHistory[_user].push(
            Position(_machineId, _stateId)
        );
    }

    /**
     * @notice Set the contract owner
     *
     * TODO: Send owner changed event
     *
     * @param _owner - the contract owner address
     */
    function setOwner(address _owner)
    internal
    {
        getStore().owner = _owner;
    }

}