// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoLib } from "./FismoLib.sol";
import { FismoTypes } from "./domain/FismoTypes.sol";

/**
 * @title FismoBase
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract FismoBase is FismoTypes  {

    event StateExited(address indexed user, bytes4 indexed machineId, bytes4 indexed oldState);
    event StateEntered(address indexed user, bytes4 indexed machineId, bytes4 indexed newStateId);
    event ActionSuccess(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId);

    modifier onlyOwner() {
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();
        require(msg.sender == fismoSlot.owner, "Only owner may call");
        _;
    }

    modifier onlyActionInitiator() {
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();
        require(msg.sender == fismoSlot.actionInitiator, "Only action initiator may call");
        _;
    }

    /**
     * Invoke an action on a configured FSM
     *
     * @param _machineId - the id of the target FSM
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
    external
    onlyActionInitiator
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Get the machine
        Machine storage machine = fismoSlot.machine[_machineId];

        // Make sure the machine exists
        require(machine.id == _machineId, "Machine does not exist.");

        // Get the user's current state in the machine
        State storage state = FismoLib.getUserState(_user, _machineId);

        // Find the transition triggered by the given action
        Transition memory transition;
        bool valid = false;
        for (uint32 i = 0; i < state.transitions.length; i++) {
            if (state.transitions[i].actionId == _actionId) {
                valid = true;
                transition = state.transitions[i];
                break;
            }
        }

        // Make sure action is valid for given state
        require(transition.actionId == _actionId, "No such action");

        // if there is exit logic, call it
        if (state.exitGuarded) {

        }

        // if there is enter logic, call it
        if (state.exitGuarded) {

        }

        // if we made it this far, set the new state
        FismoLib.setUserState(_user, _machineId, _actionId);

        // emit events

    }

    /**
     * @notice Add a new Machine
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(Machine memory _machine)
    external
    onlyOwner
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Make sure machine id is valid
        require(_machine.id == FismoLib.nameToId(_machine.name), "Machine ID is invalid");

        // Make sure machine doesn't already exist
        require(fismoSlot.machine[_machine.id] == 0, "Machine with that ID already exists");

        // Store the machine
        fismoSlot.machine[_machine.id] = _machine;

        // Map the machine's states
        for (uint32 i = 0; i < _machine.states.length; i++) {

            // Get the state
            State memory state = _machine.states[i];

            // Make sure machine id is valid
            require(state.id == FismoLib.nameToId(state.name), "State ID is invalid");

            // Map state id to index of state in machine's states array
            fismoSlot.stateIndex[_machine.id][_machine.states[i].id] = i;

            // Determine the state guard
            FismoLib.updateStateGuards(_machine, state);
        }
    }

    /**
     * @notice Add a state to an existing Machine
     *
     * @param _machineId - the id of the machine
     * @param _state - the state to add to the machine
     */
    function addState(bytes4 _machineId, State calldata _state)
    external
    onlyOwner
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Get the machine
        Machine storage machine = FismoLib.getMachine(_machineId);

        // Push the state onto the machine's states array
        machine.states.push(_state);

        // Map state id to index of state in machine's states array
        fismoSlot.stateIndex[_machineId][_state.id] = machine.states.length - 1;

        // Index the the state guard logic
        FismoLib.updateStateGuards(machine, _state);
    }

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
    function updateState(bytes4 _machineId, State memory _state)
    external
    onlyOwner
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Get the machine
        Machine storage machine = FismoLib.getMachine(_machineId);

        // Make sure state exists
        uint256 index = fismoSlot.stateIndex[_machineId][_state.id];
        require(machine.states[index].id == _state.id);

        // Overwrite the state in the machine's states array
        machine.states[index] = _state;

        // Index the the state guard logic
        FismoLib.updateStateGuards(machine, _state);
    }

    /**
     * @notice Add a transition to an existing state of an existing machine
     *
     * @param _machineId - the id of the machine
     * @param _stateId - the id of the state
     * @param _transition - the transition to add to the state
     */
    function addTransition(bytes4 _machineId, bytes4 _stateId, Transition calldata _transition)
    external
    onlyOwner
    {
        // Get the machine
        Machine storage machine = FismoLib.getMachine(_machineId);

        // Get the state
        State storage state = FismoLib.getState(_machineId, _stateId);

        // Add the transition
        state.transitions.push(_transition);

    }

}