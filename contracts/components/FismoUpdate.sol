// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoOwner } from "./FismoOwner.sol";
import { IFismoOwner } from "../interfaces/IFismoOwner.sol";
import { IFismoUpdate } from "../interfaces/IFismoUpdate.sol";

/**
 * @title FismoUpdate
 *
 * @notice Fismo storage update functionality
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoUpdate is IFismoUpdate, FismoOwner {

    /**
     * @notice Install a Fismo Machine that requires no initialization.
     *
     * Emits:
     * - MachineInstalled
     * - StateAdded
     * - TransitionAdded
     *
     * Reverts if:
     * - Caller is not contract owner
     * - Operator address is zero
     * - Machine id is not valid for Machine name
     * - Machine already exists
     *
     * @param _machine - the machine definition to install
     */
    function installMachine(Machine memory _machine)
    external
    override
    onlyOwner
    {
        // Add the new machine to Fismo's storage
        addMachine(_machine);
    }

    /**
     * @notice Install a Fismo Machine and initialize it.
     *
     * Emits:
     * - MachineInstalled
     * - StateAdded
     * - TransitionAdded
     *
     * Reverts if:
     * - Caller is not contract owner
     * - Operator address is zero
     * - Machine id is not valid for Machine name
     * - Machine already exists
     * - Initializer has no code
     * - Initializer call reverts
     *
     * @param _machine - the machine definition to install
     * @param _initializer - the address of the initializer contract
     * @param _calldata - the encoded function and args to pass in delegatecall
     */
    function installAndInitializeMachine(
        Machine memory _machine,
        address _initializer,
        bytes memory _calldata
    )
    external
    override
    onlyOwner
    {
        // Make sure this is actually a contract
        requireContractCode(_initializer, CODELESS_INITIALIZER);

        // Add the new machine to Fismo's storage
        addMachine(_machine);

        // Delegate the call to the initializer contract
        (bool success, bytes memory error) = _initializer.delegatecall(_calldata);

        // Handle failure
        if (!success) {
            revert (
                (error.length > 0)
                    ? string(error)
                    : INITIALIZER_REVERTED
            );
        }

    }

    /**
     * @notice Add a State to an existing Machine.
     *
     * Note:
     * - The new state will not be reachable by any action
     * - Add one or more transitions to other states, targeting the new state
     *
     * Emits:
     * - StateAdded
     * - TransitionAdded
     *
     * Reverts if:
     * - Caller is not contract owner
     * - State id is invalid for State name
     * - Machine does not exist
     * - Any contained transition is invalid
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
        require(_state.id == nameToId(_state.name), INVALID_STATE_ID);

        // Get the machine's storage location
        Machine storage machine = getMachine(_machineId);

        // Zero init a new states array element in storage
        machine.states.push();

        // Get the new state's storage location
        uint256 index = machine.states.length - 1;

        // Map state id to index of state in machine's states array
        mapStateIndex(_machineId, _state.id, index);

        // Store the new state in the machine's states array
        storeState(machine, _state, false);

        // Alert listeners to change of state
        emit StateAdded(_machineId, _state.id, _state.name);

    }

    /**
     * @notice Add a Transition to an existing State of an existing Machine.
     *
     * Note:
     * - State name and id cannot be changed.
     *
     * Reverts if:
     * - Caller is not contract owner
     * - Machine does not exist
     * - State does not exist
     * - State id is invalid
     * - Any contained transition is invalid
     *
     * Use this when:
     * - Adding more than one transition
     * - Removing one or more transitions
     * - Changing exitGuarded, enterGuarded, guardLogic params
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to update
     */
    function updateState(bytes4 _machineId, State memory _state)
    external
    override
    onlyOwner
    {
        // Make sure state id is valid
        require(_state.id == nameToId(_state.name), INVALID_STATE_ID);

        // Get the machine
        Machine storage machine = getMachine(_machineId);

        // Overwrite the state in the machine's states array
        storeState(machine, _state, true);

        // Alert listeners to change of state
        emit StateUpdated(_machineId, _state.id, _state.name);
    }

    /**
     * @notice Add a Transition to an existing State of an existing Machine
     *
     * Emits:
     * - TransitionAdded
     *
     * Reverts if:
     * - Caller is not contract owner
     * - Machine does not exist
     * - State does not exist
     * - Action id is invalid
     * - Target state id is invalid
     *
     * Use this when:
     * - Adding only a single transition (use updateState for multiple)
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
        require(_transition.actionId == nameToId(_transition.action), INVALID_ACTION_ID);

        // Make sure target state id is valid
        require(_transition.targetStateId == nameToId(_transition.targetStateName), INVALID_TARGET_ID);

        // Get the target state
        State storage state = getState(_machineId, _stateId, true);

        // Zero init a new transitions array element in storage
        state.transitions.push();

        // Get the new transition's storage index in the state's transitions array
        uint256 index = state.transitions.length - 1;

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
     * @notice Add a new Machine to Fismo.
     *
     * Emits:
     * - MachineInstalled
     * - StateAdded
     * - TransitionAdded
     *
     * Reverts if:
     * - Caller is not contract owner
     * - Operator address is zero
     * - Machine id is not valid for Machine name
     * - Machine already exists
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(Machine memory _machine)
    internal
    {
        // Make sure operator address is not the black hole
        require(_machine.operator != address(0), INVALID_OPERATOR_ADDR);

        // Make sure machine id is valid
        require(_machine.id == nameToId(_machine.name), INVALID_MACHINE_ID);

        // Get the machine's storage location
        Machine storage machine = getStore().machine[_machine.id];

        // Make sure machine doesn't already exist
        require(machine.id != _machine.id, MACHINE_EXISTS);

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
        emit MachineInstalled(_machine.id, _machine.name);

    }

    /**
     * @notice Store a State.
     *
     * Note:
     * - Shared by addState and updateState.
     *
     * Reverts if:
     * - No code is found at a guarded state's guardLogic address
     *
     * @param _machine - the machine's storage location
     * @param _state - the state's storage location
     * @param _shouldExist - true if the state should exist
     */
    function storeState(Machine storage _machine, State memory _state, bool _shouldExist)
    internal
    {
        // Overwrite the state in the machine's states array
        State storage state = getState(_machine.id, _state.id, _shouldExist);
        state.id = _state.id;
        state.name = _state.name;
        state.exitGuarded = _state.exitGuarded;
        state.enterGuarded = _state.enterGuarded;
        if (_state.exitGuarded || _state.enterGuarded) {
            requireContractCode(_state.guardLogic, CODELESS_GUARD);
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

    }

    /**
     * @notice Map a State's index in Machine's states array.
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
     * @notice Set the current State for a given user in a given Machine.
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
     * @notice Set the isFismo flag.
     *
     * @dev Will the real Fismo please stand up?
     *
     * @param _assertion - true if this contract is an original deployment
     */
    function setIsFismo(bool _assertion)
    internal
    {
        getStore().isFismo = _assertion;
    }

    /**
     * @notice Verify an address is a contract and not an EOA
     *
     * Reverts if address has no contract code
     *
     * @param _contract - the contract to check
     * @param _errorMessage - the revert reason to throw
     */
    function requireContractCode(address _contract, string memory _errorMessage) internal view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(_contract)
        }
        require(contractSize > 0, _errorMessage);
    }

}