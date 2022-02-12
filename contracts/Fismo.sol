// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.0;

import { FismoOperate } from  "./components/FismoOperate.sol";

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
 *   - All action invocations must come from the configured operator contract
 *   - operator contract manages which roles can trigger which actions
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
 *   - guard function selectors are deterministic based on: machineName, stateName, guardType
 *
 * @author Cliff Hall <cliff@futurescale.com> (https://twitter.com/seaofarrows)
 */
contract Fismo is FismoOperate  {

    /**
     * Constructor
     *
     * Sets the initial contract owner
     *
     * @param _owner the address of the contract owner
     */
    constructor(address _owner) payable {
        setOwner( _owner);
    }

}