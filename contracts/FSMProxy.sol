// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FSMLib } from "./FSMLib.sol";
import { FSMTypes } from "./domain/FSMTypes.sol";

/**
 * @title FSMProxy
 *
 * - Maintains configurations and current state for named Finite State Machines
 *
 * - Configuration describes...
 *   - Discrete states and all valid transitions to other states
 *   - Actions that trigger transitions from one state to another
 *   - Whether proxied guard logic exists for exiting the current state
 *   - Whether proxied guard logic exists for entering the next state
 *
 * - Initiate states transitions whe actions are invoked
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
contract FSMProxy is FSMTypes {

    modifier onlyActionIntiator() {
        FSMLib.FSMStorage storage fsms = FSMLib.fsmStorage();
        require(msg.sender == fsms.actionInitiator, "Only action initiator may call");
        _;
    }

    constructor(address _actionInitiator) {
        FSMLib.FSMStorage storage fsms = FSMLib.fsmStorage();
        fsms.actionInitiator = _actionInitiator;
    }

    /**
     * Invoke an action on a configured FSM
     *
     * @param _fsmId - the id of the target FSM
     * @param _actionId - the id of the action to invoke
     */
    function invokeAction(bytes32 _fsmId, bytes32 _actionId)
    onlyActionIntiator
    external {
        FSMLib.FSMStorage storage fsms = FSMLib.fsmStorage();
    }

    function addMachine(Machine _fsm) external {

        FSMLib.FSMStorage storage fsms = FSMLib.fsmStorage();
        require(_fsm.id == keccak256(_fsm.name), "Machine ID is invalid");
        require(fsms.machines(_fsm.id) == 0, "Machine with that ID already exists");

    }

}