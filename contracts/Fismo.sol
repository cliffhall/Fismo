// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { FismoLib } from "./FismoLib.sol";
import { FismoBase } from "./FismoBase.sol";

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
 *   - A user's state changed in some machine
 *   - A user is about to exit a state
 *   - A user is about to enter a state
 *   - A machine is created
 *   - A machine is modified
 *   - A state's guard logic contract is changed
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
contract Fismo is FismoBase {

    constructor(address _owner, address _catalyst) payable {
        FismoLib.configureAccess( _owner, _catalyst);
    }

}