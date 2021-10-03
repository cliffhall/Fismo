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
 *   - All action invocations must come from the configured action initiator contract
 *   - Action initiator contract manages which roles can trigger which actions
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

    constructor(address _owner, address _actionInitiator) payable {
        FismoLib.configureAccess( _owner, _actionInitiator);
    }

    /**
     * Invoke deterministic guard logic
     */
    fallback() external payable {

        // Make sure the implementation exists
        address implementation = fismoSlot().guardLogic[msg.sig];
        require(implementation != address(0), "Guard logic implementation does not exist");

        // Invoke guard with delagatecall
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

    /**
     * @notice Contract accepts ETH.
     *
     * Guards can receive and/or send ETH as users pass from state to state.
     * E.g.,Paying to get into an exclusive club, that only allows you in if you're
     * in a certain state in a certain machine. And into VIP area if you're in a
     * different state in that machine.
     *
     * TODO: Also needs an ownerOnly drain() method.
     */
    receive() external payable {}
}