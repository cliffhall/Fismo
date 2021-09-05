// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoLib } from "./FismoLib.sol";
import { FismoTypes } from "./domain/FismoTypes.sol";
import { StringUtils } from "./utils/StringUtils.sol";

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
 * - Initiate state transitions when actions are invoked
 *   - All action invocations must come from the configured action initiator contract
 *   - Action initiator contract manages which roles can trigger which actions
 *
 * - Emits events upon...
 *   - entering a state
 *   - exiting a state
 *   - current state changing
 *
 * - Reverts if...
 *   - a configured entrance guard returns false
 *   - a configured exit guard returns false
 *
 * - Delegates to an implementation...
 *   - exit guard logic
 *   - entrance guard logic
 *   - guard function selectors are deterministic based on: fromStateName, toStateName, exit|enter
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Fismo is FismoTypes, StringUtils {

    event ActionTaken(address indexed user, bytes4 indexed machineId, bytes4 indexed actionId);

    modifier onlyActionIntiator() {
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();
        require(msg.sender == fismoSlot.actionInitiator, "Only action initiator may call");
        _;
    }

    constructor(address _actionInitiator) {
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();
        fismoSlot.actionInitiator = _actionInitiator;
    }

    /**
     * Invoke an action on a configured FSM
     *
     * @param _machineId - the id of the target FSM
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(address _user, bytes4 _machineId, bytes4 _actionId)
    onlyActionIntiator
    external
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Get the machine
        Machine storage machine = fismoSlot.machine[_machineId];

        // Make sure the machine exists
        require(machine.id == _machineId, "Machine does not exist.");

        // Get the current state of the user
        State storage currentState = FismoLib.getUserState(_user, _machineId);

        // Make sure action is valid for given state
        Action storage action;
        bool valid = false;
        for (uint32 i = 0; i < currentState.transitions.length; i++) {
            if (state.transitions[i].actionId == _actionId) {
                valid = true;
                action = state.transitions[i];
                break;
            }
        }

        // if there is exit logic, call it

        // if there is enter logic, call it

        // if we made it this far, set the new state
        FismoLib.setUserState(_user, _machineId, _newStateId);

        // emit ActionTaken event
    }

    /**
     * Create a new FSM
     */
    function addMachine(Machine memory _machine) external
    {
        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Make sure machine id is valid
        require(_machine.id == keccak256(_machine.name), "Machine ID is invalid");

        // Make sure machine doesn't already exist
        require(fismoSlot.machine(_machine.id) == 0, "Machine with that ID already exists");

        // Store the machine
        fismoSlot.machine[_machineId] = _machine;

        // Create machine's state mappings
        for (uint32 i = 0; i < _machine.states.length; i++) {

            // Get the state
            State storage state = _machine.states[i];

            // Map state id to index of state in machine's states array
            fismoSlot.stateIndex[_machine.id][_machine.states[i].id] = i;

            // Map deterministic enter guard function selector to implementation
            if (state.enterGuarded) {

                // determine enter guard function signature for state
                // N.B. machineName_enter_stateName(address _user)
                string memory enterGuardName = strConcat(
                    strConcat(
                        strConcat(_machine.name,"_enter_"),
                        state.name
                    ),
                    "(address _user)"
                );

                // Map the entrance guard function selector to the address of the guard logic implementation for this state
                fismoSlot.guardLogic[keccak256(enterGuardName)] = state.guardLogic;

            }

            // Map deterministic exit guard function selector to implementation
            if (state.exitGuarded) {

                // determine exit guard function signature for state
                // N.B. machineName_exit_stateName(address _user)
                string memory exitGuardName = strConcat(
                    strConcat(
                        strConcat(_machine.name,"_exit_"),
                        state.name
                    ),
                    "(address _user)"
                );

                // Map the exit guard function selector to the address of the guard logic implementation for this state
                fismoSlot.guardLogic[keccak256(exitGuardName)] = state.guardLogic;

            }

        }
    }

    /**
 * Fallback function. Called when the specified function doesn't exist
 *
 * Find facet for function that is called and execute the
 * function if a facet is found and returns any value.
 */
    fallback() external payable {

        // Get the storage slot
        FismoLib.FismoSlot storage fismoSlot = FismoLib.fismoSlot();

        // Make sure the implementation exists
        address implementation = fismoSlot.guardLogic[msg.sig];
        require(implementation != address(0), "Guard logic implementation does not exist");

        // Invoke the function with delagatecall
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }

    }

    /// Contract can receive ETH
    receive() external payable {}

}