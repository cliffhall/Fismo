// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC165.sol";
import { FismoLib } from "./FismoLib.sol";
import { IFismo } from "./interfaces/IFismo.sol";
import { FismoTypes } from "./domain/FismoTypes.sol";
import { FismoEvents } from "./domain/FismoEvents.sol";

/**
 * @title Fismo
 *
 * - Maintains configurations and current state for named Finite State Machines
 * - Accepts action invocations that trigger transitions to other states
 * - Accepts portal invocations that trigger transitions to other state machines
 * - Delegates entrance and exit guard logic to proxied logic contracts
 * - Keeps history of user position (machine + state)
 *
 * - Configuration describes...
 *   - Discrete states and all valid transitions to other states
 *   - Actions that trigger transitions from one state to another
 *   - Whether proxied guard logic exists for exiting the current state
 *   - Whether proxied guard logic exists for entering the next state
 *
 * - Initiates state transitions when actions are invoked
 *   - All action invocations must come from the configured Catalyst contract
 *   - Catalyst contract manages which roles can trigger which actions
 *
 * - Emits events upon...
 *   - A user has entered a state in some machine
 *   - A user has exited a state in some machine
 *   - A machine is created
 *   - A machine is modified
 *   - A state's guard logic contract is changed
 *
 * - Reverts if...
 *   - a configured enter guard returns false
 *   - a configured exit guard returns false
 *
 * - Delegates to an implementation...
 *   - exit guard logic
 *   - entrance guard logic
 *   - guard function selectors are deterministic based on: fromStateName, toStateName, exit|enter
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Fismo is IFismo, FismoTypes, FismoEvents  {

    // TODO: Catalyst is 1-to-1 with Fismo. Should it be per machine?
    constructor(address _owner, address _catalyst) payable {
        FismoLib.configureAccess( _owner, _catalyst);
    }

    modifier onlyOwner() {
        require(msg.sender == fismoSlot().owner, "Only owner may call");
        _;
    }

    modifier onlyCatalyst() {
        require(msg.sender == fismoSlot().catalyst, "Only catalyst may call");
        _;
    }

    /**
     * @notice Onboard implementation of ERC-165 interface detection standard.
     *
     * @param _interfaceId - the sighash of the given interface
     */
    function supportsInterface(bytes4 _interfaceId) external
    pure
    returns (bool)
    {
        return (
            _interfaceId == type(IERC165).interfaceId ||
            _interfaceId == type(IFismo).interfaceId
        ) ;
    }

    /**
     * @notice Get the Fismo storage slot
     *
     * @return fismoStorageSlot - Fismo storage slot
     */
    function fismoSlot()
    internal
    pure
    returns (FismoLib.FismoSlot storage)
    {
        return FismoLib.fismoSlot();
    }

    /**
     * Invoke an action on a configured FSM
     *
     * @param _machineId - the id of the target FSM
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
    external
    override
    onlyCatalyst
    returns(ActionResponse memory response)
    {
        // Get the machine
        Machine storage machine = FismoLib.getMachine(_machineId);

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

        // Get the next state
        State storage nextState = FismoLib.getState(_machineId, transition.targetStateId);

        // Create the action response
        response.machineName = machine.name;
        response.priorStateName = state.name;
        response.nextStateName = nextState.name;
        response.action = transition.action;

        // if there is exit guard logic for the current state, call it
        if (state.exitGuarded) {
            response.exitMessage = challengeGuard(_user, machine.name, state.name, Guard.Exit);
        }

        // if there is enter guard logic for the next state, call it
        if (nextState.enterGuarded) {
            response.enterMessage = challengeGuard(_user, machine.name, nextState.name, Guard.Enter);
        }

        // if we made it this far, set the new state
        FismoLib.setUserState(_user, _machineId, _actionId);

        // emit events
        emit Transitioned(_user, _machineId, _actionId, response);

    }

    /**
     * @notice Make a delegatecall to the specified guard function
     *
     * Reverts if
     * - Guard logic decides to
     * - delegatecall attempt fails
     *
     * @param _user - the user address the call is being invoked for
     * @param _machineName - the name of the machine
     * @param _stateName - the name of the state
     * @param _guard - the guard type (enter/exit) See: {FismoTypes.Guard}
     */
    function challengeGuard(
        address _user,
        string memory _machineName,
        string memory _stateName,
        FismoTypes.Guard _guard
    )
    internal
    returns (string memory guardMessage)
    {
        // Get the function selector
        bytes4 selector = FismoLib.getGuardSelector(_machineName, _stateName, _guard);

        // Make sure the logic implementation exists
        address guardAddress = FismoLib.getGuardAddress(selector);

        // Encode the signature and arguments
        bytes memory challenge = abi.encodeWithSelector(
            selector,
            _user,
            _stateName
        );

        // Challenge the guard
        (bool success, bytes memory response) = guardAddress.delegatecall(challenge);

        // Revert if not successful
        require(success, 'Call failed');

        // Return the guard message
        guardMessage = abi.decode(response, (string));

    }

    /**
     * @notice Add a new Machine
     *
     * @param _machine - the machine definition to add
     */
    function addMachine(Machine memory _machine)
    external
    override
    onlyOwner
    {
        // Make sure machine id is valid
        require(_machine.id == FismoLib.nameToId(_machine.name), "Machine ID is invalid");

        // Get the machine's storage location
        Machine storage machine = fismoSlot().machine[_machine.id];

        // Make sure machine doesn't already exist
        require(machine.id != _machine.id, "Machine with that ID already exists");

        // Store the machine
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

            // Map state id to index of state in machine's states array
            FismoLib.mapStateIndex(_machine.id, _machine.states[i].id, i);

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
    function addState(bytes4 _machineId, State memory _state)
    public
    override
    onlyOwner
    {
        // Make sure state id is valid
        require(_state.id == FismoLib.nameToId(_state.name), "State ID is invalid");

        // Get the machine's storage location
        Machine storage machine = FismoLib.getMachine(_machineId);

        // Get the new state's storage location
        uint256 index = machine.states.length;

        // Map state id to index of state in machine's states array
        FismoLib.mapStateIndex(_machineId, _state.id, index);

        // Store the new state in the machine's states array
        storeState(machine, _state, index);
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
    public
    override
    onlyOwner
    {
        // Get the machine
        Machine storage machine = FismoLib.getMachine(_machineId);

        // Make sure state exists
        uint256 index = FismoLib.getStateIndex(_machineId, _state.id);
        require(machine.states[index].id == _state.id, "State does not exist");

        // Overwrite the state in the machine's states array
        storeState(machine, _state, index);
    }

    /**
     * @notice Store a state
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
        state.guardLogic = _state.guardLogic;

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
        FismoLib.updateStateGuards(_machine, _state);
    }

    /**
     * @notice Add a transition to an existing state of an existing machine
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
        // Get the state
        State storage state = FismoLib.getState(_machineId, _stateId);

        // Get the new transition's storage location
        uint256 index = state.transitions.length;

        // Overwrite the state in the machine's states array
        Transition storage transition = state.transitions[index];
        transition.actionId = _transition.actionId;
        transition.action = _transition.action;
        transition.targetStateId = _transition.targetStateId;

    }

}